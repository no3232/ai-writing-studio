# AI-Writing-Studio 구현 마스터 플랜

> **에이전트 작업용:** REQUIRED: 구현 시 superpowers:subagent-driven-development (subagent 사용 가능 시) 또는 superpowers:executing-plans 를 사용한다. 진행 추적은 체크박스(`- [ ]`)로 관리한다.

**목표:** 원격 OpenClaw 호스트를 AI 백엔드이자 프로젝트 저장소 서버로 사용하는 Electron 기반 소설 집필 워크벤치의 첫 번째 동작 가능한 기반을 만든다.

**아키텍처:** 새 코드 레포 안에 데스크톱 앱과 내부 `openclaw-bridge` 패키지를 함께 둔다. 앱은 작가용 UI에 집중하고, OpenClaw 호스트와의 통신은 브리지 계층이 담당한다. 초기에는 브리지를 앱 내부 TypeScript 모듈/패키지로 두고, 필요하면 별도 companion process로 분리 가능하게 설계한다.

**기술 스택:** Electron, TypeScript, Node.js, React, Vite, Zustand, Tailwind CSS, CodeMirror 6, Lexical, React Flow, vis-timeline(또는 동급 OSS 타임라인 라이브러리), Vitest, React Testing Library, Playwright(후속)

---

## 범위와 진행 순서

이번 마스터 플랜은 아래 첫 구현 슬라이스까지만 다룬다.

1. 레포 부트스트랩
2. OpenClaw 브리지 패키지 골격
3. 원격 호스트 연결 / 인증 흐름
4. 프로젝트 및 문서 CRUD API 초안
5. AI 오케스트레이션 API 초안
6. 에디터/채팅 패널 UI 셸
7. 그래프/타임라인 읽기 전용 스타터 뷰
8. 스트리밍/에러 처리 경계

## 제안 레포 구조

```text
ai-writing-studio/
  apps/
    desktop/
      src/
        features/
          host-connection/
          project-browser/
          knowledge-editor/
          chapter-editor/
          plot-chat/
          graph-view/
          timeline-view/
  packages/
    openclaw-bridge/
      src/
        host/
        projects/
        documents/
        ai/
        streaming/
        contracts/
```

## 구현 Chunk

### Chunk 1: 레포 부트스트랩
- 작업 1: 레포 초기화
- 작업 2: desktop + openclaw-bridge 패키지 생성
- 작업 3: UI/브리지 의존성 설치

### Chunk 2: 브리지 골격
- 작업 4: 브리지 계약 정의
- 작업 5: 호스트 연결 상태 모델
- 작업 6: health check / ping

### Chunk 3: 프로젝트 및 문서 API
- 작업 7: `project.list`, `project.open` 계약
- 작업 8: 프로젝트 브라우저 유스케이스
- 작업 9: `document.list`, `document.get`, `document.create`, `document.update` 계약
- 작업 10: 문서 읽기/생성/수정 브리지 구현

### Chunk 4: AI API
- 작업 11: `plot.generate`, `scene.suggest`, `validation.run`, `graph.snapshot`, `timeline.snapshot` 계약
- 작업 12: 플롯/장면/검증 요청 구현
- 작업 13: 그래프/타임라인 스냅샷 요청 구현

### Chunk 5: 스트리밍과 에러 처리
- 작업 14: 스트리밍 abstraction 구현
- 작업 15: 타임아웃/재시도/에러 정책 구현

### Chunk 6: 클라이언트 UI 셸
- 작업 16: 원격 호스트 연결 UI
- 작업 17: 프로젝트 브라우저 UI
- 작업 18: knowledge/chapter editor 연결
- 작업 19: 채팅형 AI 패널 연결
- 작업 20: 그래프/타임라인 뷰 연결

## 공통 규칙
- 항상 실패 테스트부터 작성
- UI는 OpenClaw 내부 tool/provider 세부를 몰라야 함
- 문서 API와 AI API를 분리
- 브리지는 초기엔 앱 내부, 이후 분리 가능하게 유지

## 첫 번째 구현 마일스톤 완료 조건
- desktop app shell이 실행됨
- 원격 OpenClaw 호스트에 연결 가능
- 프로젝트/문서 목록 조회 가능
- 원격 문서를 읽고 수정 가능
- plot.generate / scene.suggest / validation.run 요청 가능
- graph/timeline snapshot 렌더링 가능
- 스트리밍과 에러가 브리지 계층에서 처리됨
