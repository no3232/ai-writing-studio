---
topic: [소설집필, 멀티에이전트, worldbuilding, electron, markdown, design, openclaw, monorepo]
type: design
source: conversation
project: [AI-Writing-Studio]
status: draft
created: 2026-03-13
updated: 2026-03-13
---

# AI-Writing-Studio — OpenClaw-Backed Story Workbench Design v0.5

## 핵심 요약
- 최소형 monorepo 채택
- `apps/desktop`: Electron 클라이언트
- `apps/backend`: Fastify 백엔드
- `packages/contracts`: 공용 API 계약
- `packages/openclaw-adapter`: OpenClaw 연동 계층
- 원본 저장소는 OpenClaw 호스트 측 프로젝트 저장소
- desktop ↔ backend ↔ OpenClaw 구조

## 제품 정의
OpenClaw 호스트가 프로젝트 원본 저장소와 AI 오케스트레이션을 담당하고, Electron 앱과 별도 백엔드 서비스가 그 위에서 문서 편집·플롯 생성·장면 제안·검증을 제공하는 소설 집필 워크벤치다.

## monorepo 구조
```text
ai-writing-studio/
  apps/
    desktop/
    backend/
  packages/
    contracts/
    openclaw-adapter/
```

## 역할 분리
### `apps/desktop`
- Electron + React 클라이언트
- 프로젝트 탐색
- 문서 편집
- 챕터 집필
- 그래프/타임라인
- 채팅형 AI 패널

### `apps/backend`
- Fastify 서버
- 프로젝트/문서 CRUD API
- AI orchestration API
- REST + SSE
- OpenClaw adapter 호출

### `packages/contracts`
- API 요청/응답 타입
- Zod 스키마
- 스트리밍 이벤트 타입

### `packages/openclaw-adapter`
- OpenClaw 호출 캡슐화
- 요청/응답 정규화
- 세션/오케스트레이션 연결

## 데이터/원본 전략
- 프로젝트 원본 저장소는 OpenClaw 호스트 측에 존재
- 세계관 문서: Markdown
- 챕터 문서: Lexical JSON 원본 저장
- 앱은 백엔드 API를 통해 문서 CRUD 수행

## AI 흐름
1. 사용자가 desktop 앱에서 요청
2. desktop이 backend API 호출
3. backend가 adapter를 통해 OpenClaw 요청
4. OpenClaw가 프로젝트 저장소를 읽고 오케스트레이션 수행
5. 결과를 backend가 응답 또는 SSE 스트리밍으로 반환
6. desktop이 채팅형 패널, 그래프, 타임라인, 집필 에디터에 반영

## 초기 API 범위
### 프로젝트/문서 API
- `project.list`
- `project.open`
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

## 스택
- Electron
- React
- TypeScript
- Vite
- Zustand
- Tailwind CSS
- CodeMirror 6
- Lexical
- React Flow
- vis-timeline
- Fastify
- Zod
- Vitest
