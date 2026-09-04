# Architecture

## Runtime boundary

```text
Browser → Frontend → Backend API → PostgreSQL
                              └→ Redis
```

## Data ownership

| 저장소 | 보관 데이터 |
| --- | --- |
| PostgreSQL | 회원, 상품, 주문, 주문상품 |
| Redis | 상품 캐시, 장바구니, 재고 제어, 멱등성 요청 상태, 랭킹 |

Redis에 장애가 나면 상품 캐시는 PostgreSQL로 우회할 수 있습니다. 재고 차감과 멱등성 주문은 Redis 의존 기능이므로 요청을 실패 처리합니다.

상세 요구사항은 `Jerry_Blossom_PRD.md`, 데이터 모델은 `../Jerry_Blossom_ERD.vuerd.json`을 기준으로 합니다.
