# AI Writing Studio Product Spec v1

## 1. Product Definition
AI Writing Studio is an AI-assisted fiction workbench that combines writing, setting management, plot management, and relationship exploration into one product.

It is not just a text editor and not just an AI chat tool. It is a multi-mode writing workbench for long-form or setting-heavy fiction.

## 2. Why This Product Exists
Existing tools usually separate these activities:
- chapter writing
- setting and character document management
- plot and event planning
- AI-assisted writing help
- post-writing continuity updates

As a result, writers move between multiple disconnected tools. AI support is also usually detached from the writer’s actual setting documents and project context.

AI Writing Studio exists to unify those workflows into one operating environment.

## 3. Core User
Primary user:
- genre fiction writers with heavy setting/context management needs
- writers who want to actively use AI for scene help, draft assistance, and continuity maintenance

## 4. Core User Situations
This product should be especially useful in these moments:
1. when the writer is actively drafting a chapter
2. when the writer gets stuck and needs help with the next scene, paragraph, or development
3. when the writer finishes a chapter and needs to update project knowledge/continuity
4. when the writer needs to inspect plot flow or relationships
5. when the writer needs to quickly reference worldbuilding documents while drafting

## 5. Core Product Modes
These are first-class modes, not secondary utilities.

### 5.1 Writing Mode
- primary drafting space
- central editor is the main working surface
- right AI panel helps during drafting

### 5.2 Knowledge / Setting Mode
- character documents
- setting documents
- event documents
- optional expansion to locations, rules, factions

### 5.3 Plot / Event Mode
- chapter/event flow
- plot structure
- continuity and progression overview

### 5.4 Relationship / Exploration Mode
- graph-style view of characters, events, settings, and their links
- exploration and consistency support

## 6. AI Assistance Model
AI is a shared system across the workbench, not a separate product.

### 6.1 AI panel structure
AI is presented as a common right-side panel, but its content changes by mode.

### 6.2 Writing mode AI
- next paragraph suggestion
- scene suggestion
- dialogue or tone assistance

### 6.3 Plot mode AI
- plot gap detection
- sequencing help
- tension and payoff suggestions

### 6.4 Relationship mode AI
- possible missing links
- relationship inconsistencies
- structural interpretation help

### 6.5 Setting mode AI
- setting update draft generation
- contradiction detection
- organization/helpful rewrite proposals

## 7. Core Experience Loop
The core loop is:
1. the writer drafts a chapter
2. the writer asks AI for help when stuck
3. AI responds using saved project knowledge and current chapter context
4. the writer finishes the chapter
5. AI generates setting/character/event update drafts based on what became newly true in the chapter
6. the writer reviews and approves those updates
7. the approved knowledge becomes the basis for future writing and AI suggestions

## 8. Document and Data Model
### 8.1 Document types
The product structurally distinguishes at least these document types:
- chapter
- character
- setting
- event
- optional later extensions: location, rule, faction

### 8.2 Storage direction
- setting-style documents are markdown-first
- chapter documents are intended to become structured rich-text content (eventually Lexical-oriented)

### 8.3 AI reference basis
AI should primarily use the project’s saved markdown knowledge plus the current working chapter/context.

## 9. MVP Scope
This MVP is not a toy prototype. It is the smallest version that still feels like the intended product.

MVP includes:
- writing mode
- knowledge/setting mode
- plot/event mode
- relationship/exploration mode
- shared right AI panel
- in-writing suggestion flow
- post-chapter setting update draft flow
- project/document navigation and reference support

MVP does not require:
- fully automatic setting application without review
- advanced collaboration
- publishing workflow
- full long-term version management

## 10. UI Direction
UI SOT is based on the provided reference images.

Working assumptions:
- central writing/editor area is the main focus in writing mode
- left side supports navigation and reference
- right side is the shared AI assistance panel
- plot and graph are distinct main modes, not hidden utilities

## 11. Installation / Runtime Model
### 11.1 Product shape
The product is a desktop workbench application with a remote-first server model.

### 11.2 Runtime structure
The runtime is composed of three layers:
1. **Desktop Client**
   - the locally running Electron workbench application
   - responsible for the writing UI, mode switching, navigation, graph/plot views, and AI panel presentation
   - communicates only with the product backend APIs
2. **AI Writing Studio Backend**
   - product-specific HTTP API server
   - provides project/document/AI APIs in product terms
   - owns product-domain logic such as document handling, AI action orchestration, and setting-update draft generation
   - communicates internally with OpenClaw
3. **OpenClaw Runtime**
   - underlying runtime/execution layer for AI, tools, and context-aware operations
   - not treated as the direct user-facing application API

### 11.3 Communication model
The default communication path is:

**Desktop Client → AI Writing Studio Backend → OpenClaw Runtime**

This separation exists so the desktop client can depend on stable product APIs rather than OpenClaw’s internal execution structure.

### 11.4 Remote-first principle
The product assumes a remote-first connection model.

That means:
- the user runs the desktop client locally
- the backend + OpenClaw side runs on a prepared server environment
- the desktop app connects to that environment over HTTP APIs

The product does not assume that the full AI/runtime stack is embedded directly inside the desktop client.

### 11.5 Onboarding principle
The default onboarding flow is:
1. the user installs the desktop app
2. the app instructs the user to prepare or choose an OpenClaw-based server
3. the user connects/logs in/pairs with that server
4. the app starts work against that connected environment

The initial product may assume that OpenClaw is already running before connection.

### 11.6 Future installation direction
Future versions may support a more guided setup flow such as:
- companion server installation wizard
- connection to an already-running OpenClaw server
- packaged backend + OpenClaw server bundle

However, the top-level product model still remains:

**Desktop Client + Product Backend + OpenClaw Runtime**

### 11.7 Installation details deferred to lower-level specs
The following are intentionally deferred to dedicated detailed specs:
- authentication model
- pairing/login/token flow
- health check and reconnect behavior
- local companion installation automation
- backend deployment model
- API security and trust boundaries
- differences between development and user runtime environments

## 12. Domain Breakdown for Detailed Specs
Follow-up detailed specs should be written separately for:
1. writing mode
2. setting/knowledge mode
3. plot/event mode
4. relationship/exploration mode
5. AI panel and AI action model
6. setting-update draft workflow
7. runtime/install/connect flow
8. backend/data/API architecture

## 13. Backend-First Direction
Implementation should be reorganized around backend/domain/API stability before major frontend refinement.

The backend should define:
- project/document contracts
- document type semantics
- AI request/response contracts by mode
- setting update draft generation contract
- runtime connection and execution model

The frontend should follow the product SOT and backend contracts, rather than leading architecture decisions first.
