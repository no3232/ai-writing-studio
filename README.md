# AI Writing Studio

AI Writing Studio is an Electron-based story workbench for managing markdown worldbuilding documents, exploring plot-first workflows, and drafting chapters with a local story engine.

This repository is the codebase for the application itself. It is separate from the PersonalOpsHQ document repository, which is used for planning and design notes rather than application runtime code.

## Workspace Layout

- `apps/desktop`: Electron shell and React UI
- `packages/story-engine`: core domain, application, and infrastructure logic
- `fixtures`: sample workspace content for development and tests
- `docs`: architecture notes, ADRs, and implementation plans

## Local Prerequisites

- Node.js 22 or newer
- pnpm 10 or newer
- macOS, Windows, or Linux environment capable of running Electron
