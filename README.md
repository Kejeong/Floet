# Jerry Blossom

온라인 꽃·식물 쇼핑몰 프로젝트입니다.

## Repository layout

```text
.
├── backend/              # Spring Boot API
├── docs/                 # PRD, ERD, 설계 문서
├── frontend/             # 웹 클라이언트
├── docker-compose.yml    # PostgreSQL·Redis 로컬 개발 환경
└── .env                  # 로컬 환경변수
```

## Boundaries

| 영역           | 책임                                                  |
| -------------- | ----------------------------------------------------- |
| `frontend`     | 화면, 사용자 입력 검증, 백엔드 API 호출               |
| `backend`      | 인증, 상품·주문 도메인, PostgreSQL 영속화, Redis 사용 |
| `docs`         | 요구사항, 데이터 모델, API·아키텍처·트러블슈팅 기록   |
| Docker Compose | 로컬 PostgreSQL과 Redis 실행                          |

애플리케이션 소스·프레임워크 설정은 아직 추가하지 않습니다.

## Local infrastructure

```bash
docker compose up -d
```

- PostgreSQL: `localhost:5432`
- Redis: `localhost:6379`

초기 프로젝트 생성 뒤 백엔드는 `backend`, 프런트엔드는 `frontend`에서 각각 실행합니다.
