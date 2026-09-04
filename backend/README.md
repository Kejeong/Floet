# Backend

Spring Boot API가 위치할 영역입니다. Java 17과 Gradle 기반의 Spring Boot 프로젝트가 생성되어 있습니다.

```text
backend/
├── src/
│   ├── main/
│   │   ├── java/com/jerryblossom/
│   │   │   ├── global/
│   │   │   │   ├── config/       # DB, Redis, Swagger 등 설정
│   │   │   │   ├── exception/    # 공통 예외와 예외 처리
│   │   │   │   ├── response/     # 공통 API 응답 형식
│   │   │   │   └── security/     # JWT, Spring Security
│   │   │   ├── auth/             # 로그인, 토큰 재발급
│   │   │   ├── user/             # 회원
│   │   │   ├── item/             # 상품, 상품 이미지
│   │   │   ├── cart/             # Redis 장바구니
│   │   │   └── order/            # 주문, 재고 차감, 멱등성
│   │   └── resources/
│   │       ├── db/migration/     # DB 마이그레이션 SQL
│   │       └── static/           # 서버가 직접 제공할 정적 파일
│   └── test/java/com/jerryblossom/
└── uploads/
    └── items/                    # 개발 환경의 로컬 상품 이미지
```

각 기능 패키지는 구현 시 `controller`, `service`, `repository`, `domain`, `dto` 하위 패키지를 필요해지는 시점에 추가합니다. 처음부터 모두 만들면 빈 폴더만 늘어나므로 현재는 기능 경계까지만 둡니다.

PostgreSQL에는 회원·상품·주문을, Redis에는 장바구니·캐시·재고 제어·멱등성 상태를 둡니다. `uploads/`는 개발용이며 Git에 포함하지 않습니다.

## Local run

```bash
./gradlew bootRun
```

실행 경로를 `backend`로 두면 `../.env`를 읽어 PostgreSQL에 연결합니다. 현재는 Flyway를 사용하지 않으므로, JPA의 `ddl-auto: update`가 엔티티 기준으로 로컬 테이블을 생성·변경합니다.
