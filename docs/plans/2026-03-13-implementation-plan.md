# AI-Writing-Studio 구현 마스터 플랜

## 핵심 구조
- `apps/desktop`: Electron 클라이언트
- `apps/backend`: Fastify 백엔드
- `packages/contracts`: 공용 계약
- `packages/openclaw-adapter`: OpenClaw 연동

## 구현 범위
1. monorepo 부트스트랩
2. desktop/backend 앱 생성
3. contracts/adapter 패키지 생성
4. backend 기본 REST + SSE 구조
5. OpenClaw adapter 골격
6. 프로젝트/문서 CRUD API 초안
7. AI 오케스트레이션 API 초안
8. desktop UI 셸 연결

## 1차 API 범위
### 프로젝트 API
- `project.list`
- `project.open`

### 문서 API
- `document.list`
- `document.get`
- `document.create`
- `document.update`

### AI API
- `plot.generate`
- `scene.suggest`
- `validation.run`
- `graph.snapshot`
- `timeline.snapshot`

## 첫 마일스톤 완료 조건
- monorepo 부트스트랩 완료
- desktop 실행 가능
- backend 실행 가능
- contracts / adapter 패키지 생성 완료
- 프로젝트/문서 API 동작
- AI API 기본 골격 동작
- desktop ↔ backend ↔ OpenClaw 흐름 연결
