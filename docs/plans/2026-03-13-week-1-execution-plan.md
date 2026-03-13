# AI-Writing-Studio 1주차 실행 플랜

> **에이전트 작업용:** REQUIRED: 구현 시 superpowers:subagent-driven-development (subagent 사용 가능 시) 또는 superpowers:executing-plans 를 사용한다. 진행 추적은 체크박스(`- [ ]`)로 관리한다.

**목표:** 새 `ai-writing-studio` 코드 레포를 세팅하고, 선택한 스택을 고정한 뒤, 세계관 문서를 읽고 플롯 제안을 생성할 수 있는 첫 번째 deterministic story-engine 슬라이스를 만든다.

**아키텍처:** 1주차 범위는 좁게 가져간다. 레포 기초, DDD-lite story-engine 경계, Markdown knowledge parsing, relationship/perception 모델링, deterministic plot proposal 유스케이스까지만 만든다. 이번 주에는 실제 provider 연동을 시작하지 않는다.

**기술 스택:** Electron, React, TypeScript, Vite, Zustand, Tailwind CSS, CodeMirror 6, Lexical, gray-matter, Vitest

---

## 1주차 목표 상태

1주차가 끝나면 아래 상태가 되어 있어야 한다.

- 새 GitHub 레포를 로컬에 부트스트랩했다
- `apps/desktop`, `packages/story-engine` 구조가 생겼다
- 샘플 세계관 fixture 문서가 있다
- Markdown knowledge docs를 파싱하고 인덱싱할 수 있다
- character relationship / perception / awareness 모델이 있다
- 선택 문서를 기반으로 deterministic plot proposal을 생성할 수 있다
- 아직 실제 GPT/provider 연동은 시도하지 않았다

---

## Day 1: 레포 부트스트랩과 스택 고정

### 작업 1: 새 레포 로컬 초기화

**파일:**
- Create: `README.md`
- Create: `package.json`
- Create: `pnpm-workspace.yaml`
- Create: `tsconfig.base.json`
- Create: `.gitignore`
- Create: `.editorconfig`

- [ ] `git clone git@github.com:no3232/ai-writing-studio.git` 실행
- [ ] `pnpm init` 실행
- [ ] workspace 파일과 base TS config 작성
- [ ] `chore: bootstrap repository`로 커밋

### 작업 2: 앱/엔진 패키지 골격과 핵심 의존성 추가

**파일:**
- Create: `apps/desktop/package.json`
- Create: `packages/story-engine/package.json`

- [ ] `apps/desktop`, `packages/story-engine` 생성
- [ ] Electron, React, Vite, TypeScript, Vitest 설치
- [ ] Zustand, Tailwind, CodeMirror, Lexical 설치
- [ ] `chore: add app and engine package skeleton`로 커밋

---

## Day 2: DDD-lite story-engine 기초

### 작업 3: context 계약 정의

**파일:**
- Create: `packages/story-engine/src/contracts/index.ts`
- Test: `packages/story-engine/tests/contracts/contexts.test.ts`

- [ ] context export용 실패 테스트 작성
- [ ] 최소 contracts 구현
- [ ] 테스트 실행
- [ ] `feat: define story-engine context contracts`로 커밋

### 작업 4: knowledge document 타입 정의

**파일:**
- Create: `packages/story-engine/src/domain/knowledge/knowledge-document.ts`
- Create: `packages/story-engine/src/domain/knowledge/document-types.ts`
- Test: `packages/story-engine/tests/domain/knowledge/knowledge-document.test.ts`

- [ ] knowledge document type 실패 테스트 작성
- [ ] 최소 모델 구현
- [ ] 테스트 실행
- [ ] `feat: add knowledge document model`로 커밋

### 작업 5: character relation / perception / awareness 모델 정의

**파일:**
- Create: `packages/story-engine/src/domain/knowledge/character-relations.ts`
- Test: `packages/story-engine/tests/domain/knowledge/character-relations.test.ts`

- [ ] 비대칭 관계와 잘못된 믿음 표현용 실패 테스트 작성
- [ ] 최소 타입 구현
- [ ] 테스트 실행
- [ ] `feat: model character relations and perceptions`로 커밋

---

## Day 3: workspace fixture와 Markdown 파싱

### 작업 6: sample workspace fixture 작성

**파일:**
- Create: `fixtures/sample-project/characters/*.md`
- Create: `fixtures/sample-project/events/*.md`
- Create: `fixtures/sample-project/locations/*.md`
- Create: `fixtures/sample-project/rules/*.md`
- Create: `fixtures/sample-project/chapters/chapter-01.lexical.json`

- [ ] 합의한 스키마에 맞는 sample fixture 작성
- [ ] character fixture에 relationship/perception/awareness 포함
- [ ] `test: add sample workspace fixtures`로 커밋

### 작업 7: Markdown knowledge document 파싱

**파일:**
- Create: `packages/story-engine/src/infrastructure/markdown/parse-markdown-document.ts`
- Test: `packages/story-engine/tests/infrastructure/markdown/parse-markdown-document.test.ts`

- [ ] parser 실패 테스트 작성
- [ ] `gray-matter` 설치
- [ ] 최소 parser 구현
- [ ] 테스트 실행
- [ ] `feat: parse markdown knowledge documents`로 커밋

---

## Day 4: workspace indexing과 plot proposal

### 작업 8: 메모리 workspace index 구축

**파일:**
- Create: `packages/story-engine/src/infrastructure/fs/load-workspace.ts`
- Create: `packages/story-engine/src/application/build-workspace-index.ts`
- Test: `packages/story-engine/tests/application/build-workspace-index.test.ts`

- [ ] sample workspace indexing 실패 테스트 작성
- [ ] 최소 indexer 구현
- [ ] 테스트 실행
- [ ] `feat: build workspace index`로 커밋

### 작업 9: plot proposal 계약과 유스케이스 정의

**파일:**
- Create: `packages/story-engine/src/contracts/plot-proposal.ts`
- Create: `packages/story-engine/src/application/generate-plot-proposals.ts`
- Test: `packages/story-engine/tests/application/generate-plot-proposals.test.ts`

- [ ] proposal shape + deterministic proposal generation 실패 테스트 작성
- [ ] 최소 deterministic proposal 유스케이스 구현
- [ ] 테스트 실행
- [ ] `feat: add deterministic plot proposal use case`로 커밋

---

## Day 5: 리뷰, 정리, 다음 주 인계

### 작업 10: 첫 슬라이스 안정화 및 UI 준비

**파일:**
- Modify: Days 1~4 동안 수정한 파일들
- Create: `docs/architecture/provider-auth-research.md` (시간이 남으면)

- [ ] 현재 테스트 전체 실행
- [ ] naming과 폴더 경계 정리
- [ ] 도메인 용어 일관성 확인
- [ ] 시간이 남으면 provider/auth research note 초안 추가
- [ ] `chore: stabilize week 1 foundation`로 커밋

---

## 1주차 하드 룰

- [ ] 이번 주에는 실제 GPT/provider 연동 금지
- [ ] 이번 주에는 graph/timeline 구현 금지
- [ ] 이번 주에는 UI polish 최소화
- [ ] 모든 작업은 TDD-first
- [ ] 의미 있는 슬라이스마다 바로 커밋
- [ ] desktop UI 안에 story-engine 도메인 로직을 넣지 않기

---

## 1주차 완료 조건

- 레포가 로컬에서 부트스트랩됨
- 테스트 실행 가능
- Markdown knowledge docs 파싱 가능
- relationship/perception/awareness 모델 존재
- workspace indexing 가능
- deterministic plot proposal 가능
- 2주차 UI 셸 작업으로 넘어갈 준비가 됨
