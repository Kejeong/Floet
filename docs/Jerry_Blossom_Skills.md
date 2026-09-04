# Jerry Blossom — Skills (기술 구현 전략)

| 항목 | 내용 |
| --- | --- |
| 문서 버전 | v1.1 |
| 작성일 | 2026-09-04 |
| 관련 문서 | Jerry Blossom — PRD, Jerry Blossom — ERD |

이 문서는 백엔드 구현 전략을 정리한다. 기능 요구사항은 PRD, 관계형 데이터 모델은 ERD를 참고한다.

---

## 1. 시스템 아키텍처

레이어드 아키텍처(Controller → Service → Repository) 기반 모놀리식을 사용한다. 기능 분리보다 재고 동시성·캐싱 구현의 깊이를 우선한다.

```text
[React Client] -- HTTPS --> [Spring Boot + Spring Security JWT Filter]
                                  |-- PostgreSQL (JPA/Hibernate)
                                  `-- Redis (Cache / Stock / Idempotency / Ranking)

Docker Compose: app + postgres + redis
```

- **Controller**: Bean Validation, 공통 응답 DTO, `Idempotency-Key` 헤더 검증
- **Service**: 트랜잭션 경계, 재고 예약·보상 및 캐시 무효화 오케스트레이션
- **Repository**: Spring Data JPA. 복잡 조회는 QueryDSL 또는 fetch join을 사용한다.

성능 구현 시 HikariCP를 서버 사양에 맞게 조정하고, N+1은 `@EntityGraph`/fetch join으로 우선 해결한다. 컬렉션 fetch join 페이징 문제는 `@BatchSize`로 보완한다. MVP는 Offset 페이징으로 시작한다.

---

## 2. Redis 활용 전략

| 용도 | 자료구조 | 키 예시 | TTL | 설명 |
| --- | --- | --- | --- | --- |
| 상품 기본 정보 캐시 | String | `product:{id}` | 5~10분 | 재고를 제외한 이름·가격·태그 등을 캐싱 |
| 최신 재고 | String Counter | `stock:{productId}` | 없음 | 상품 상세 응답 시 별도 조회하는 최신 수량 |
| 장바구니 | Hash | `cart:{userId}` | 없음 | field=`productId`, value=`quantity` |
| Refresh Token | String | `refresh:{userId}` | 토큰 만료시간 | 원문 대신 해시 저장 |
| 주문 멱등성 | String | `idem:order:{userId}:{key}` | 상태별 | 처리 중 상태 또는 완료 응답을 보관 |
| 인기 랭킹 | Sorted Set | `ranking:product:view` | 없음 | `ZINCRBY`, `ZREVRANGE` |

### 2.1 재고 동시성 제어와 보상

주문 요청은 아래 순서로 처리한다.

1. 주문 상품 전체를 입력으로 받아 Lua 스크립트에서 각 `stock:{productId}`를 확인한다.
2. 하나라도 부족하면 어떤 키도 변경하지 않고 `INSUFFICIENT_STOCK`을 반환한다.
3. 모두 충분하면 하나의 Lua 실행 안에서 전체 수량을 차감한다.
4. DB 트랜잭션으로 `orders`, `order_items`를 저장하고 영속 재고도 차감한다.
5. DB 저장 또는 커밋이 실패하면 보상 Lua 스크립트로 **동일 수량 전체를 증가**시킨다.
6. DB 커밋이 성공한 뒤에만 해당 상품의 `product:{id}` 캐시를 무효화한다.

보상 자체가 실패하면 주문 실패 응답을 반환하고, 주문 ID·상품 ID·수량을 오류 로그와 재조정 대상으로 남긴다. Redis 재고 키는 DB 재고를 초기값으로 하여 준비하며, 재고 관리 변경도 DB와 Redis를 함께 갱신한다.

상품 상세는 캐시에서 상품 기본 정보를 읽은 뒤 `stock:{id}`를 별도로 읽어 최신 재고를 합성한다. 따라서 재고 값이 캐시 본문에 남아 사용자에게 오래 보이는 문제를 방지한다. 주문 성공 뒤 상세 캐시도 명시적으로 무효화한다.

### 2.2 중복 주문 생성 방지

`SETNX`와 `EXPIRE`를 나누지 않고 `SET key value NX EX seconds`로 처리 중 상태를 원자적으로 선점한다.

- 최초 요청: `PROCESSING` 상태를 설정하고 주문을 처리한다.
- 처리 중 동일 키: `409 REQUEST_IN_PROGRESS`을 반환한다.
- 주문 성공: 첫 성공 응답 전체를 `COMPLETED` 상태로 저장하고 5초 TTL을 설정한다.
- 완료 뒤 동일 키: 저장했던 성공 응답을 그대로 반환한다. 새 주문은 생성하지 않는다.
- 실패: 처리 중 키를 제거하여 안전하게 재시도할 수 있게 한다.

상태 전이와 TTL 갱신은 Lua 스크립트 또는 단일 원자 연산 조합으로 구현해, 처리 중 키가 영구히 남거나 완료 응답이 유실되는 일을 방지한다.

### 2.3 캐시

Cache-Aside 패턴을 사용한다. 가격·상품 정보 변경과 주문 성공 뒤 `product:{id}`를 무효화하며, 조회 응답의 재고는 Redis 카운터에서 별도로 합성한다. 인기 상품 캐시의 동시 만료는 TTL에 소폭 랜덤 값을 더해 분산한다.

---

## 3. 인증/보안

- Access Token: 30분, `Authorization: Bearer {token}` 전달
- Refresh Token: 2주, Redis에 해시 저장 및 TTL 자동 만료
- 로그아웃: Refresh Token만 삭제. `cart:{userId}`는 유지
- 비밀번호: BCrypt 해싱, 평문 저장·로그 금지
- Spring Security `FilterChain`에 JWT 검증 필터 적용, 인증 실패는 401 형식 통일
- Should-have: 로그인 API Rate Limiting

## 4. 성능·정합성 측정 계획

| 항목 | 측정 방법 | 비교 대상 |
| --- | --- | --- |
| 캐싱 효과 | k6 또는 nGrinder로 상품 상세 부하 테스트 | 캐시 전/후 P50·P95·TPS |
| 최신 재고 | 캐시 히트 상태에서 주문 직후 상세 조회 | 캐시 데이터와 Redis 재고 합성 결과 |
| N+1 해결 | Hibernate 로그 또는 P6Spy | fetch join 전/후 쿼리 수 |
| 동시성·보상 | 100개 재고에 200개 동시 주문 및 강제 DB 저장 실패 | 성공 100건·오버셀 0·Redis 보상 여부 |
| 멱등성 | 같은 키로 처리 중·완료 후 재요청 | 진행 중 409, 완료 후 동일 응답·신규 주문 0건 |
