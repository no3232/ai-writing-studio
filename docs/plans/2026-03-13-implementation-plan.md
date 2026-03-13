# AI-Writing-Studio 구현 마스터 플랜

> **에이전트 작업용:** REQUIRED: 구현 시 superpowers:subagent-driven-development (subagent 사용 가능 시) 또는 superpowers:executing-plans 를 사용한다. 진행 추적은 체크박스(`- [ ]`)로 관리한다.

**목표:** Markdown 기반 세계관 문서, 플롯 우선 워크플로, 챕터 집필, 채팅형 AI 제안 패널을 갖춘 개인용 Electron 멀티에이전트 스토리 워크벤치의 첫 번째 동작 가능한 기반을 만든다.

**아키텍처:** 새 코드 레포 하나 안에 데스크톱 앱과 내부 `story-engine` 패키지를 함께 둔다. DDD-lite는 story-engine에만 적용하고, UI는 실용적으로 가져간다. 문서 종류에 따라 편집기를 분리한다. 구조 문서는 텍스트 중심, 챕터는 리치 텍스트 중심으로 다루고, 얇은 수직 슬라이스 단위로 구현해 각 단계가 독립적으로 테스트 가능하도록 한다.

**기술 스택:** Electron, TypeScript, Node.js, React, Vite, Zustand, Tailwind CSS, CodeMirror 6, Lexical, React Flow, vis-timeline(또는 동급 OSS 타임라인 라이브러리), 파일 기반 Markdown 저장, gray-matter, Vitest, React Testing Library, Playwright(후속)

---

## 범위와 진행 순서

이 계획서는 **새 코드 레포** 기준이며, PersonalOpsHQ 문서 레포가 아니다.

이번 마스터 플랜은 아래 첫 구현 슬라이스까지만 다룬다.

1. 레포 부트스트랩
2. Markdown 스키마 + 파서
3. story-engine DDD-lite 경계 정의
4. 플롯 우선 상호작용 루프
5. 챕터 에디터 셸
6. 채팅형 제안 패널
7. 검증 패스
8. 그래프/타임라인 읽기 전용 스타터 뷰
9. provider/auth 리서치 경계

고급 RAG, 실제 provider 연동, 과한 UI 다듬기를 너무 일찍 시작하지 않기 위한 범위 제한이다.

---

## 제안 레포 구조

```text
ai-writing-studio/
  README.md
  package.json
  pnpm-workspace.yaml
  tsconfig.base.json
  .editorconfig
  .gitignore

  apps/
    desktop/
      package.json
      electron.main.ts
      electron.preload.ts
      src/
        app/
        features/
          workspace/
          plot-chat/
          chapter-editor/
          graph-view/
          timeline-view/
          knowledge-editor/
        shared/
      tests/

  packages/
    story-engine/
      package.json
      src/
        domain/
          knowledge/
          plotting/
          simulation/
          validation/
        application/
        infrastructure/
          fs/
          markdown/
          providers/
        contracts/
      tests/

  fixtures/
    sample-project/
      characters/
      events/
      locations/
      factions/
      rules/
      chapters/

  docs/
    adr/
    architecture/
```

### 파일 책임 맵

- `apps/desktop/*`: Electron 앱, UI 조립, 로컬 상호작용 셸
- `apps/desktop/src/features/knowledge-editor/*`: CodeMirror 기반 세계관/설정 문서 편집기
- `apps/desktop/src/features/chapter-editor/*`: Lexical 기반 챕터 집필 편집기
- `packages/story-engine/domain/knowledge/*`: Markdown 문서 개념, 관계/인지/인식 규칙
- `packages/story-engine/domain/plotting/*`: 플롯 제안 로직과 유스케이스
- `packages/story-engine/domain/simulation/*`: 캐릭터 반응 및 장면 제안 로직
- `packages/story-engine/domain/validation/*`: 세계관 규칙, 타임라인, 관계 일관성 검증
- `packages/story-engine/application/*`: UI에서 호출하는 애플리케이션 유스케이스
- `packages/story-engine/infrastructure/fs/*`: 로컬 파일 시스템 어댑터
- `packages/story-engine/infrastructure/markdown/*`: frontmatter 파싱 및 인덱싱
- `packages/story-engine/infrastructure/providers/*`: provider/auth 추상화 경계만 정의
- `fixtures/sample-project/*`: 테스트 및 수동 개발용 샘플 문서 코퍼스

---

## 초기에 고정할 도메인 용어

코드, 문서, 테스트 전반에서 아래 용어를 일관되게 사용한다.

- Workspace
- Knowledge Document
- Character
- Event
- Location
- Faction
- Rule
- Chapter
- Relationship
- Perception
- Awareness
- Plot Proposal
- Scene Suggestion
- Validation Finding
- Orchestrator

명시적으로 추가하지 않는 한 `note`, `entry`, `memory card` 같은 다른 표현은 도입하지 않는다.

---

## Chunk 1: 레포 부트스트랩과 작업 공간 셸

### 작업 1: 새 코드 레포 기본 골격 만들기

**파일:**
- Create: `README.md`
- Create: `package.json`
- Create: `pnpm-workspace.yaml`
- Create: `tsconfig.base.json`
- Create: `.gitignore`
- Create: `.editorconfig`

- [ ] **Step 1: 레포에서 패키지 매니저 메타데이터 초기화**

실행:
```bash
pnpm init
```

기대 결과: 루트 `package.json` 생성.

- [ ] **Step 2: 루트 워크스페이스 설정 작성**

`pnpm-workspace.yaml` 생성:
```yaml
packages:
  - apps/*
  - packages/*
```

- [ ] **Step 3: 공통 TypeScript 설정 작성**

Node + Electron + React에 공통으로 쓰는 `tsconfig.base.json` 작성.

- [ ] **Step 4: 기본 ignore/editor 파일 추가**

`.gitignore`에 아래 항목 포함:
- `node_modules/`
- `dist/`
- `out/`
- `.playwright/`
- `.vite/`
- `.DS_Store`

- [ ] **Step 5: README 작성**

포함 내용:
- 이 레포가 만드는 것
- PersonalOpsHQ 문서 레포와의 관계
- 상위 패키지 구조
- 로컬 개발 전제 조건

- [ ] **Step 6: 커밋**

```bash
git add README.md package.json pnpm-workspace.yaml tsconfig.base.json .gitignore .editorconfig
git commit -m "chore: bootstrap ai-writing-studio workspace"
```

### 작업 2: desktop 앱과 story-engine 패키지 추가

**파일:**
- Create: `apps/desktop/package.json`
- Create: `packages/story-engine/package.json`
- Create: `apps/desktop/src/app/`
- Create: `packages/story-engine/src/`

- [ ] **Step 1: 패키지 폴더 생성**

실행:
```bash
mkdir -p apps/desktop/src apps/desktop/tests packages/story-engine/src packages/story-engine/tests
```

- [ ] **Step 2: desktop 패키지 매니페스트 작성**

필수 스크립트:
- `dev`
- `build`
- `test`

- [ ] **Step 3: story-engine 패키지 매니페스트 작성**

필수 스크립트:
- `test`
- `typecheck`

- [ ] **Step 4: 기본 의존성 설치**

실행:
```bash
pnpm add -D typescript vitest @types/node
pnpm add -D -F @ai-writing-studio/desktop electron vite react react-dom @types/react @types/react-dom
```

패키지 이름은 실제 manifest 기준으로 맞춘다.

- [ ] **Step 5: 워크스페이스 해상도 확인**

실행:
```bash
pnpm install
pnpm -r test
```

기대 결과: 설치 성공, 테스트가 비어 있어도 명령 자체는 정상 종료.

- [ ] **Step 6: 커밋**

```bash
git add apps packages package.json pnpm-lock.yaml
git commit -m "chore: add desktop and story-engine packages"
```

### 작업 3: 선택한 UI/에디터 라이브러리 추가

**파일:**
- Modify: `apps/desktop/package.json`

- [ ] **Step 1: 앱 UI 의존성 설치**

실행:
```bash
pnpm add -F @ai-writing-studio/desktop zustand tailwindcss @tailwindcss/vite @codemirror/state @codemirror/view @uiw/react-codemirror lexical @lexical/react reactflow vis-timeline
```

- [ ] **Step 2: UI 테스트 의존성 설치**

실행:
```bash
pnpm add -D -F @ai-writing-studio/desktop @testing-library/react @testing-library/jest-dom jsdom
```

- [ ] **Step 3: 설치 확인**

실행:
```bash
pnpm install
```

기대 결과: lockfile 정상 업데이트.

- [ ] **Step 4: 커밋**

```bash
git add apps/desktop/package.json pnpm-lock.yaml
git commit -m "chore: add desktop ui and editor dependencies"
```

---

## Chunk 2: story-engine 도메인 골격 (DDD-lite)

### 작업 4: bounded context 폴더와 계약 정의

**파일:**
- Create: `packages/story-engine/src/domain/knowledge/index.ts`
- Create: `packages/story-engine/src/domain/plotting/index.ts`
- Create: `packages/story-engine/src/domain/simulation/index.ts`
- Create: `packages/story-engine/src/domain/validation/index.ts`
- Create: `packages/story-engine/src/contracts/index.ts`
- Test: `packages/story-engine/tests/contracts/contexts.test.ts`

- [ ] **Step 1: context export용 실패 테스트 작성**

```ts
import { knowledgeContextName, plottingContextName, simulationContextName, validationContextName } from '../../src/contracts';
import { describe, expect, it } from 'vitest';

describe('context contracts', () => {
  it('exports stable context names', () => {
    expect(knowledgeContextName).toBe('knowledge');
    expect(plottingContextName).toBe('plotting');
    expect(simulationContextName).toBe('simulation');
    expect(validationContextName).toBe('validation');
  });
});
```

- [ ] **Step 2: 테스트를 실행해 실패 확인**

실행:
```bash
pnpm --filter @ai-writing-studio/story-engine vitest run packages/story-engine/tests/contracts/contexts.test.ts
```

기대 결과: export 미존재로 FAIL.

- [ ] **Step 3: 최소 계약 구현**

`src/contracts/index.ts`에서 문자열 상수 export.

- [ ] **Step 4: 테스트 재실행 후 PASS 확인**

- [ ] **Step 5: 커밋**

```bash
git add packages/story-engine/src/contracts packages/story-engine/tests/contracts
git commit -m "feat: define initial story-engine context contracts"
```

### 작업 5: 핵심 knowledge document 타입 모델링

**파일:**
- Create: `packages/story-engine/src/domain/knowledge/knowledge-document.ts`
- Create: `packages/story-engine/src/domain/knowledge/document-types.ts`
- Test: `packages/story-engine/tests/domain/knowledge/knowledge-document.test.ts`

- [ ] **Step 1: 지원 문서 타입 실패 테스트 작성**

허용 타입:
- `character`
- `event`
- `location`
- `faction`
- `rule`
- `chapter`

- [ ] **Step 2: 테스트를 실행해 실패 확인**

- [ ] **Step 3: 최소 타입 모델 구현**

`KnowledgeDocument` 인터페이스 필드:
- `id`
- `type`
- `title`
- `tags`
- `links`
- `status`
- `body`

- [ ] **Step 4: 테스트 재실행 후 PASS 확인**

- [ ] **Step 5: 커밋**

```bash
git add packages/story-engine/src/domain/knowledge packages/story-engine/tests/domain/knowledge
git commit -m "feat: add core knowledge document model"
```

### 작업 6: 캐릭터 관계 / 인식 / 인지 구조 모델링

**파일:**
- Create: `packages/story-engine/src/domain/knowledge/character-relations.ts`
- Test: `packages/story-engine/tests/domain/knowledge/character-relations.test.ts`

- [ ] **Step 1: 비대칭 관계 지원 실패 테스트 작성**

표현 가능해야 하는 예시:
- A는 B를 스승으로 봄
- 관계는 상호적이지 않음
- A는 B가 자신을 인정한다고 믿음
- 그 믿음은 거짓일 수 있음
- A는 C의 존재를 모름

- [ ] **Step 2: 테스트를 실행해 실패 확인**

- [ ] **Step 3: 최소 관계/인식/인지 타입 구현**

예시 인터페이스:
```ts
export interface Relationship {
  target: string;
  relation: string;
  mutual: boolean;
  notes?: string;
}

export interface Perception {
  target: string;
  belief: string;
  truthStatus: 'true' | 'false' | 'unknown';
}

export interface Awareness {
  target: string;
  knowsExistence: boolean;
}
```

- [ ] **Step 4: 테스트 재실행 후 PASS 확인**

- [ ] **Step 5: 커밋**

```bash
git add packages/story-engine/src/domain/knowledge/character-relations.ts packages/story-engine/tests/domain/knowledge/character-relations.test.ts
git commit -m "feat: model character relation perception and awareness"
```

---

## Chunk 3: Markdown 스키마와 파일 시스템 파싱

### 작업 7: 샘플 프로젝트 fixture 추가

**파일:**
- Create: `fixtures/sample-project/characters/kira.md`
- Create: `fixtures/sample-project/characters/borin.md`
- Create: `fixtures/sample-project/events/first-duel.md`
- Create: `fixtures/sample-project/locations/northern-castle.md`
- Create: `fixtures/sample-project/rules/magic-oath.md`
- Create: `fixtures/sample-project/chapters/chapter-01.lexical.json`

- [ ] **Step 1: fixture 디렉터리 생성**
- [ ] **Step 2: 관계/인식/인지 필드가 들어간 캐릭터 fixture 작성**
- [ ] **Step 3: event/location/rule Markdown fixture 작성**
- [ ] **Step 4: Lexical JSON 챕터 fixture 작성**
- [ ] **Step 5: 수동으로 읽어보며 구조 확인**

기대 결과: knowledge 문서는 사람이 읽을 수 있는 Markdown이고, chapter fixture는 복원 가능한 JSON 구조를 가짐.

- [ ] **Step 6: 커밋**

```bash
git add fixtures/sample-project
git commit -m "test: add sample workspace fixtures"
```

### 작업 8: Markdown frontmatter를 domain document로 파싱

**파일:**
- Create: `packages/story-engine/src/infrastructure/markdown/parse-markdown-document.ts`
- Create: `packages/story-engine/src/infrastructure/markdown/gray-matter-adapter.ts`
- Test: `packages/story-engine/tests/infrastructure/markdown/parse-markdown-document.test.ts`

- [ ] **Step 1: frontmatter 파서 설치**

실행:
```bash
pnpm add -F @ai-writing-studio/story-engine gray-matter
```

- [ ] **Step 2: fixture 기반 실패 테스트 작성**

검증 항목:
- type이 올바르게 파싱됨
- body가 보존됨
- links가 정규화됨
- rule 문서가 인식됨

- [ ] **Step 3: 테스트를 실행해 실패 확인**
- [ ] **Step 4: 최소 파서 구현**

주의: 현재 테스트가 요구하는 수준 이상으로 검증 로직을 늘리지 않는다.

- [ ] **Step 5: 테스트 재실행 후 PASS 확인**

- [ ] **Step 6: 커밋**

```bash
git add packages/story-engine/src/infrastructure/markdown packages/story-engine/tests/infrastructure/markdown package.json pnpm-lock.yaml
git commit -m "feat: parse markdown knowledge documents"
```

### 작업 9: workspace 폴더를 읽어 메모리 인덱스 구축

**파일:**
- Create: `packages/story-engine/src/infrastructure/fs/load-workspace.ts`
- Create: `packages/story-engine/src/application/build-workspace-index.ts`
- Test: `packages/story-engine/tests/application/build-workspace-index.test.ts`

- [ ] **Step 1: sample workspace 인덱싱 실패 테스트 작성**

기대 항목:
- 모든 fixture 문서 로드
- type 기준 조회 가능
- id 기준 조회 가능

- [ ] **Step 2: 테스트를 실행해 실패 확인**
- [ ] **Step 3: 최소 파일 워커와 인덱서 구현**

초기에는 Node fs API 기반, 캐싱 없이 구현.

- [ ] **Step 4: 테스트 재실행 후 PASS 확인**

- [ ] **Step 5: 커밋**

```bash
git add packages/story-engine/src/infrastructure/fs packages/story-engine/src/application/build-workspace-index.ts packages/story-engine/tests/application/build-workspace-index.test.ts
git commit -m "feat: build workspace index from local files"
```

---

## Chunk 4: 플롯 우선 애플리케이션 흐름

### 작업 10: plot proposal 계약 정의

**파일:**
- Create: `packages/story-engine/src/contracts/plot-proposal.ts`
- Test: `packages/story-engine/tests/contracts/plot-proposal.test.ts`

- [ ] **Step 1: 계약 실패 테스트 작성**

필수 필드:
- `id`
- `summary`
- `beats`
- `referencedDocumentIds`
- `rationale`

- [ ] **Step 2: 테스트를 실행해 실패 확인**
- [ ] **Step 3: 최소 계약 구현**
- [ ] **Step 4: 테스트 재실행 후 PASS 확인**

- [ ] **Step 5: 커밋**

```bash
git add packages/story-engine/src/contracts/plot-proposal.ts packages/story-engine/tests/contracts/plot-proposal.test.ts
git commit -m "feat: define plot proposal contract"
```

### 작업 11: 플롯 생성 유스케이스 스텁 만들기

**파일:**
- Create: `packages/story-engine/src/application/generate-plot-proposals.ts`
- Test: `packages/story-engine/tests/application/generate-plot-proposals.test.ts`

- [ ] **Step 1: 선택 문서 기반 플롯 제안 실패 테스트 작성**

테스트 조건:
- document ids를 입력받음
- 하나 이상의 plot proposal 반환
- 결과에 referenced document ids 포함

- [ ] **Step 2: 테스트를 실행해 실패 확인**
- [ ] **Step 3: 최소 결정적(deterministic) 구현 작성**

주의: 여기서는 실제 모델 호출 금지. workspace 데이터를 이용한 placeholder proposal만 만든다.

- [ ] **Step 4: 테스트 재실행 후 PASS 확인**

- [ ] **Step 5: 커밋**

```bash
git add packages/story-engine/src/application/generate-plot-proposals.ts packages/story-engine/tests/application/generate-plot-proposals.test.ts
git commit -m "feat: add initial plot proposal use case"
```

### 작업 12: 플롯 선택 / 재생성 상태 모델 정의

**파일:**
- Create: `packages/story-engine/src/application/plot-session-state.ts`
- Test: `packages/story-engine/tests/application/plot-session-state.test.ts`

- [ ] **Step 1: 플롯 lifecycle 실패 테스트 작성**

포함 항목:
- proposal 생성
- 하나 선택
- regenerate 시 선택 해제

- [ ] **Step 2: 테스트를 실행해 실패 확인**
- [ ] **Step 3: 최소 상태 모델 구현**
- [ ] **Step 4: 테스트 재실행 후 PASS 확인**

- [ ] **Step 5: 커밋**

```bash
git add packages/story-engine/src/application/plot-session-state.ts packages/story-engine/tests/application/plot-session-state.test.ts
git commit -m "feat: model plot selection and regeneration state"
```

---

## Chunk 5: 편집기와 채팅형 제안 루프

### 작업 13: knowledge editor 셸 만들기

**파일:**
- Create: `apps/desktop/src/features/knowledge-editor/knowledge-editor.tsx`
- Create: `apps/desktop/src/features/knowledge-editor/knowledge-editor.test.tsx`

- [ ] **Step 1: 실패 UI 테스트 작성**

CodeMirror 기반 셸에서 아래를 렌더링:
- 문서 제목
- raw content 영역
- 저장 버튼 placeholder

- [ ] **Step 2: 테스트를 실행해 실패 확인**
- [ ] **Step 3: 최소 knowledge editor 셸 구현**
- [ ] **Step 4: 테스트 재실행 후 PASS 확인**

- [ ] **Step 5: 커밋**

```bash
git add apps/desktop/src/features/knowledge-editor
git commit -m "feat: add knowledge editor shell"
```

### 작업 14: chapter editor 셸 만들기

**파일:**
- Create: `apps/desktop/src/features/chapter-editor/chapter-editor.tsx`
- Create: `apps/desktop/src/features/chapter-editor/chapter-editor.test.tsx`

- [ ] **Step 1: 실패 UI 테스트 작성**

Lexical 기반 챕터 에디터 셸에서 아래를 렌더링:
- 챕터 제목
- 편집 영역
- 저장 버튼 placeholder

- [ ] **Step 2: 테스트를 실행해 실패 확인**
- [ ] **Step 3: 최소 editor 셸 구현**
- [ ] **Step 4: 테스트 재실행 후 PASS 확인**

- [ ] **Step 5: 커밋**

```bash
git add apps/desktop/src/features/chapter-editor
git commit -m "feat: add chapter editor shell"
```

### 작업 15: 통합 채팅형 suggestion panel 셸 만들기

**파일:**
- Create: `apps/desktop/src/features/plot-chat/plot-chat-panel.tsx`
- Create: `apps/desktop/src/features/plot-chat/plot-chat-panel.test.tsx`

- [ ] **Step 1: 실패 UI 테스트 작성**

패널에 아래가 보여야 한다:
- assistant message
- user prompt input
- plot / character / validation 필터 컨트롤

- [ ] **Step 2: 테스트를 실행해 실패 확인**
- [ ] **Step 3: 최소 panel 셸 구현**

외형은 통합 채팅이지만, agent view 전환 버튼 포함.

- [ ] **Step 4: 테스트 재실행 후 PASS 확인**

- [ ] **Step 5: 커밋**

```bash
git add apps/desktop/src/features/plot-chat
git commit -m "feat: add unified chat-style suggestion panel"
```

### 작업 16: chapter 문맥을 scene suggestion 요청에 연결

**파일:**
- Create: `packages/story-engine/src/contracts/scene-suggestion.ts`
- Create: `packages/story-engine/src/application/generate-scene-suggestions.ts`
- Test: `packages/story-engine/tests/application/generate-scene-suggestions.test.ts`

- [ ] **Step 1: chapter-context suggestion 실패 테스트 작성**

기대 항목:
- chapter text 또는 lexical payload 입력 가능
- selected character ids 입력 가능
- rationale이 포함된 suggestion message 반환

- [ ] **Step 2: 테스트를 실행해 실패 확인**
- [ ] **Step 3: 최소 결정적 scene suggestion 유스케이스 구현**

여기서도 실제 provider 호출 금지.

- [ ] **Step 4: 테스트 재실행 후 PASS 확인**

- [ ] **Step 5: 커밋**

```bash
git add packages/story-engine/src/contracts/scene-suggestion.ts packages/story-engine/src/application/generate-scene-suggestions.ts packages/story-engine/tests/application/generate-scene-suggestions.test.ts
git commit -m "feat: add scene suggestion use case"
```

---

## Chunk 6: 검증과 findings

### 작업 17: validation finding 계약 모델링

**파일:**
- Create: `packages/story-engine/src/contracts/validation-finding.ts`
- Test: `packages/story-engine/tests/contracts/validation-finding.test.ts`

- [ ] **Step 1: 실패 계약 테스트 작성**

필수 필드:
- `kind`
- `severity`
- `message`
- `documentIds`
- `evidence`

- [ ] **Step 2: 테스트를 실행해 실패 확인**
- [ ] **Step 3: 최소 계약 구현**
- [ ] **Step 4: 테스트 재실행 후 PASS 확인**

- [ ] **Step 5: 커밋**

```bash
git add packages/story-engine/src/contracts/validation-finding.ts packages/story-engine/tests/contracts/validation-finding.test.ts
git commit -m "feat: define validation finding contract"
```

### 작업 18: workspace + chapter 대상 결정적 validation pass 추가

**파일:**
- Create: `packages/story-engine/src/application/run-validation-pass.ts`
- Test: `packages/story-engine/tests/application/run-validation-pass.test.ts`

- [ ] **Step 1: validation 실패 테스트 작성**

최소 한 케이스:
- chapter가 존재하지 않는 캐릭터를 참조함
- severity와 evidence가 포함된 finding 반환

- [ ] **Step 2: 테스트를 실행해 실패 확인**
- [ ] **Step 3: 최소 validation pass 구현**

초기 규칙:
- unknown references
- missing required linked docs
- relation awareness mismatch (데이터가 있을 경우)

- [ ] **Step 4: 테스트 재실행 후 PASS 확인**

- [ ] **Step 5: 커밋**

```bash
git add packages/story-engine/src/application/run-validation-pass.ts packages/story-engine/tests/application/run-validation-pass.test.ts
git commit -m "feat: add initial validation pass"
```

---

## Chunk 7: 읽기 전용 그래프와 타임라인 스타터

### 작업 19: React Flow 기반 graph view 셸 만들기

**파일:**
- Create: `apps/desktop/src/features/graph-view/graph-view.tsx`
- Create: `apps/desktop/src/features/graph-view/graph-view.test.tsx`

- [ ] **Step 1: graph shell 렌더링 실패 UI 테스트 작성**

처음엔 단순 node/edge props로 시작하고, 이후 최소 React Flow 인스턴스를 붙인다.

- [ ] **Step 2: 테스트를 실행해 실패 확인**
- [ ] **Step 3: 최소 graph shell 구현**
- [ ] **Step 4: 테스트 재실행 후 PASS 확인**

- [ ] **Step 5: 커밋**

```bash
git add apps/desktop/src/features/graph-view
git commit -m "feat: add graph view shell"
```

### 작업 20: OSS 타임라인 기반 timeline view 셸 만들기

**파일:**
- Create: `apps/desktop/src/features/timeline-view/timeline-view.tsx`
- Create: `apps/desktop/src/features/timeline-view/timeline-view.test.tsx`

- [ ] **Step 1: ordered timeline items 실패 UI 테스트 작성**
- [ ] **Step 2: 테스트를 실행해 실패 확인**
- [ ] **Step 3: 최소 timeline shell 구현**

초기엔 ordered item 렌더링부터 만들고, baseline이 안정되면 실제 라이브러리를 붙인다.

- [ ] **Step 4: 테스트 재실행 후 PASS 확인**

- [ ] **Step 5: 커밋**

```bash
git add apps/desktop/src/features/timeline-view
git commit -m "feat: add timeline view shell"
```

---

## Chunk 8: 실제 GPT 흐름을 확정하지 않은 provider/auth 경계

### 작업 21: provider adapter 인터페이스 정의

**파일:**
- Create: `packages/story-engine/src/contracts/provider-adapter.ts`
- Test: `packages/story-engine/tests/contracts/provider-adapter.test.ts`

- [ ] **Step 1: provider adapter 형태 실패 테스트 작성**

필수 메서드:
- `generatePlotProposals`
- `generateSceneSuggestions`
- `runValidationAssist`

- [ ] **Step 2: 테스트를 실행해 실패 확인**
- [ ] **Step 3: 최소 TypeScript 인터페이스 구현**
- [ ] **Step 4: 테스트 재실행 후 PASS 확인**

- [ ] **Step 5: 커밋**

```bash
git add packages/story-engine/src/contracts/provider-adapter.ts packages/story-engine/tests/contracts/provider-adapter.test.ts
git commit -m "feat: define provider adapter boundary"
```

### 작업 22: auth/provider 리서치 스파이크와 비목표 문서화

**파일:**
- Create: `docs/architecture/provider-auth-research.md`

- [ ] **Step 1: 리서치 질문 문서 작성**

포함 질문:
- GPT를 OAuth/session 흐름으로 개인 도구에서 쓸 수 있는가?
- 공식 지원 범위는 어디까지인가?
- 어떤 부분이 취약하거나 금지될 수 있는가?
- 지원되지 않을 경우 fallback 경로는 무엇인가?

- [ ] **Step 2: 명시적 비목표 문장 추가**

초기 동작 버전은 deterministic stub + interface boundary까지를 목표로 하고, 검증 전에는 실제 provider 연동을 확정하지 않는다고 적는다.

- [ ] **Step 3: 커밋**

```bash
git add docs/architecture/provider-auth-research.md
git commit -m "docs: add provider auth research spike"
```

---

## 모든 구현 작업에 적용할 공통 규칙

- [ ] 항상 실패 테스트부터 작성한다.
- [ ] 가장 작은 단위의 테스트 명령으로 먼저 실패를 확인한다.
- [ ] 테스트를 통과시키는 최소 구현만 작성한다.
- [ ] 집중 테스트를 다시 돌린다.
- [ ] 관련 패키지 테스트를 다시 돌린다.
- [ ] 태스크가 통과하면 바로 커밋한다.
- [ ] 파일은 작고 책임이 분명하게 유지한다.
- [ ] provider adapter와 research 문서가 생기기 전에는 실제 GPT/provider 로직을 붙이지 않는다.
- [ ] UI 컴포넌트 안에 도메인 로직을 넣지 않는다.
- [ ] knowledge docs는 Markdown 우선, chapters는 rich-text 우선 원칙을 유지한다.

---

## 추천 실행 순서

바로 구현을 시작한다면 아래 순서로 진행한다.

1. 작업 1
2. 작업 2
3. 작업 3
4. 작업 4
5. 작업 5
6. 작업 6
7. 작업 7
8. 작업 8
9. 작업 9
10. 작업 10
11. 작업 11
12. 작업 12
13. 작업 13
14. 작업 14
15. 작업 15
16. 작업 16
17. 작업 17
18. 작업 18
19. 작업 19
20. 작업 20
21. 작업 21
22. 작업 22

이 순서면 위험한 provider/auth 작업에 들어가기 전에 충분히 동작하는 골격을 확보할 수 있다.

---

## 첫 번째 구현 마일스톤의 완료 조건

아래 상태가 되면 첫 마일스톤 완료로 본다.

- desktop app shell이 로컬에서 실행된다
- sample workspace를 로드할 수 있다
- story-engine이 knowledge document와 관계를 인덱싱한다
- deterministic plot proposal이 생성된다
- CodeMirror 기반 knowledge editor shell이 동작한다
- Lexical 기반 chapter editor shell이 동작한다
- 통합 chat suggestion panel이 plot/character/validation 메시지를 보여준다
- validation finding이 생성된다
- graph/timeline starter view가 인덱스 데이터를 렌더링한다
- provider/auth 연동은 계약 경계 뒤에 깔끔하게 격리되어 있다

---

## 다음 계획 패스에서 다룰 항목

첫 마일스톤 이후 다음 계획서에는 아래를 포함한다.

- 실제 provider 연동 경로
- 더 풍부한 world-rule validation
- graph visualization 튜닝
- timeline 편집 기능
- chapter save/load persistence UX
- agent prompt pack/versioning
- Lexical JSON에서 사용자-facing export 포맷으로 변환하는 파이프라인
