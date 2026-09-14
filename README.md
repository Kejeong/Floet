# Jerry Blossom

> 🌼 마음을 전하는 계절의 꽃

Jerry Blossom은 꽃말과 특별한 순간에 어울리는 꽃을 발견하고 주문할 수 있도록 만든 온라인 플라워 스토어 프로젝트입니다.

**상황별 테마 · 카테고리 · 상품명 검색**으로 원하는 꽃을 찾고 장바구니까지 자연스럽게 이어지는 쇼핑 경험을 목표로 합니다. React 기반 사용자 화면과 Spring Boot 기반 REST API를 하나의 저장소에서 관리합니다.

---

## ✨ 주요 기능

- **상품 탐색 및 복합 검색** — 상품명, 카테고리, 상황별 태그를 조합하여 검색하고 페이지 단위로 조회
- **상황별 테마 추천** — 생일, 기념일, 축하, 선물 등 목적에 맞는 상품 필터링
- **회원가입 / 로그인** — JWT Access Token과 HttpOnly Refresh Token Cookie 기반 인증
- **장바구니** — 로그인 사용자의 장바구니 조회, 추가, 수량 변경, 개별 삭제 및 전체 비우기
- **마이페이지** — `/mypage` 경로에서 내 정보와 주문 내역 UI 제공
- **관리자 상품 관리** — 상품 등록·수정·삭제와 이미지 업로드
- **캐시 및 조회 최적화** — Redis 캐시와 JPA `@EntityGraph`로 반복 조회 및 N+1 문제 완화

> 주문 완료 화면은 프론트엔드에 구현되어 있으며, 주문 생성·조회 API는 다음 개발 단계에서 완성합니다. 배송 기능은 현재 범위에 포함하지 않습니다.

---

## 🛠 기술 스택

### Frontend (`frontend/`)

| 분류 | 기술 |
| --- | --- |
| Framework | **React 19**, Vite |
| Language | TypeScript |
| UI / Style | Tailwind CSS, Lucide React |
| 상태 / 통신 | React Hooks, Fetch API |
| 품질 검사 | TypeScript (`tsc --noEmit`) |

### Backend (`backend/`)

| 분류 | 기술 |
| --- | --- |
| Framework | **Spring Boot 4.1.1** |
| Language | **Java 17** |
| Build | Gradle Wrapper |
| ORM | Spring Data JPA / Hibernate |
| DB | **PostgreSQL 16** |
| Cache | Redis 7 |
| Security | Spring Security, JWT, BCrypt |
| API Docs | Springdoc OpenAPI (Swagger UI) |
| Util | Lombok, Jakarta Validation |

### Infra / Tooling

- Docker Compose (PostgreSQL, Redis)
- Git / GitHub
- ERD: `docs/Jerry_Blossom_ERD.erd`

---

## 📂 프로젝트 구조

```bash
Jerry_Blossom/
├── frontend/                         # React 클라이언트
│   ├── src/
│   │   ├── api/                      # Auth, 상품, 장바구니 API 클라이언트
│   │   ├── assets/                   # 이미지 에셋
│   │   ├── components/               # Navbar, 상품 카드, 장바구니, 마이페이지 등
│   │   ├── App.tsx                   # 화면 상태 및 클라이언트 경로 제어
│   │   └── types.ts                  # 도메인 타입
│   ├── .env                          # VITE_API_URL 설정
│   └── package.json
│
├── backend/                          # Spring Boot 서버
│   ├── src/main/java/com/jerryblossom/
│   │   ├── auth/                     # 회원가입, 로그인, 토큰 재발급
│   │   ├── user/                     # 회원 / 내 정보
│   │   ├── item/                     # 상품 CRUD, 검색, 캐시
│   │   ├── cart/                     # 장바구니
│   │   ├── upload/                   # 상품 이미지 업로드
│   │   └── global/                   # Security, JWT, 예외, 공통 설정
│   ├── src/main/resources/
│   │   └── application.yml
│   └── build.gradle
│
├── docs/                             # PRD, ERD, 기술 문서
├── docker-compose.yml                # PostgreSQL, Redis 컨테이너
└── .env                              # 로컬 인프라 및 JWT 환경변수
```

---

## 🚀 시작하기

### 사전 요구 사항

- **JDK 17**
- **Node.js** 및 npm
- **Docker Desktop**

### 1. 환경변수 설정

프로젝트 루트에 `.env` 파일을 만들고 아래 값을 설정합니다.

```dotenv
POSTGRES_DB=jerry_blossom
POSTGRES_USER=jerry
POSTGRES_PASSWORD=change-me
POSTGRES_PORT=5434
REDIS_PORT=6379

JWT_SECRET=replace-with-a-long-random-secret
JWT_ACCESS_EXPIRATION=1800
JWT_REFRESH_EXPIRATION=1209600
UPLOAD_DIR=backend/uploads
```

`frontend/.env`에는 백엔드 API 주소를 설정합니다.

```dotenv
VITE_API_URL=http://localhost:8080
```

### 2. 데이터베이스와 Redis 실행

```bash
docker compose up -d
```

PostgreSQL은 `localhost:5434`, Redis는 `localhost:6379`에서 실행됩니다.

### 3. 백엔드 실행

```bash
cd backend
./gradlew bootRun
```

백엔드는 `http://localhost:8080`에서 실행됩니다.

### 4. 프론트엔드 실행

새 터미널에서 다음을 실행합니다.

```bash
cd frontend
npm install
npm run dev
```

브라우저에서 `http://localhost:3000`을 엽니다.

### 5. 품질 검사 및 프로덕션 빌드

```bash
# Backend test
cd backend
./gradlew test

# Frontend type check / build
cd frontend
npm run lint
npm run build
```

---

## 🔌 API 개요

자세한 요청/응답 구조는 Swagger UI에서 확인할 수 있습니다.

```text
http://localhost:8080/swagger-ui/index.html
```

인증이 필요한 API에는 다음 헤더를 포함합니다.

```http
Authorization: Bearer {accessToken}
```

| Method | Endpoint | 설명 | 인증 |
| --- | --- | --- | --- |
| POST | `/api/auth/signup` | 회원가입 | - |
| POST | `/api/auth/login` | 로그인 및 Access Token 발급 | - |
| POST | `/api/auth/reissue` | Refresh Token Cookie로 토큰 재발급 | Refresh Cookie |
| POST | `/api/auth/logout` | 로그아웃 | 선택 |
| GET | `/api/users/me` | 내 프로필 조회 | 필요 |
| GET | `/api/items` | 상품 목록 / 검색 / 페이징 조회 | - |
| GET | `/api/items/{id}` | 상품 상세 조회 | - |
| POST | `/api/items` | 상품 등록 | 관리자 |
| PUT | `/api/items/{id}` | 상품 수정 | 관리자 |
| DELETE | `/api/items/{id}` | 상품 삭제 | 관리자 |
| POST | `/api/uploads/items` | 상품 이미지 업로드 | 관리자 |
| GET | `/api/cart` | 장바구니 조회 | 필요 |
| POST | `/api/cart/items` | 장바구니 상품 추가 | 필요 |
| PATCH | `/api/cart/items/{itemId}` | 장바구니 수량 변경 | 필요 |
| DELETE | `/api/cart/items/{itemId}` | 장바구니 상품 삭제 | 필요 |
| DELETE | `/api/cart` | 장바구니 전체 비우기 | 필요 |

### 상품 검색 예시

```http
GET /api/items?keyword=장미&category=BOUQUET&occasionTag=BIRTHDAY&page=0&size=8
```

| 파라미터 | 예시 | 설명 |
| --- | --- | --- |
| `keyword` | `장미` | 상품명 부분 일치 검색 |
| `category` | `BOUQUET` | 상품 카테고리 |
| `occasionTag` | `BIRTHDAY` | 상황별 테마 태그 |
| `page` | `0` | 0부터 시작하는 페이지 번호 |
| `size` | `8` | 페이지당 상품 수 |

지원 카테고리: `BOUQUET`, `BASKET`, `VASE_ARRANGEMENT`, `FLOWER_BOX`, `PLANT`, `WREATH`, `PRESERVED_FLOWER`

---

## 🗺 로드맵

- [x] JWT 기반 회원가입 / 로그인 / 토큰 재발급
- [x] 상품 CRUD 및 상품 이미지 업로드
- [x] 상품명·카테고리·상황별 태그 복합 검색
- [x] 장바구니 CRUD와 Redis 캐시 적용
- [x] 페이지형 마이페이지 및 관리자 상품 관리
- [ ] 주문 생성 API 및 주문 상품 스냅샷 저장
- [ ] 주문 내역 조회 API와 마이페이지 실제 데이터 연동
- [ ] 프론트엔드 검색어 입력 디바운싱
- [ ] 운영 환경용 이미지 스토리지 및 배포 구성

---

## 📚 문서

- [제품 요구사항(PRD)](docs/Jerry_Blossom_PRD.md)
- [ERD](docs/Jerry_Blossom_ERD.erd)
