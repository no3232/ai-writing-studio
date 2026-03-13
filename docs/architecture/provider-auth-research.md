# Provider/Auth Research

Updated: 2026-03-13

## Questions

1. Can this project use GPT through an OAuth or ChatGPT session flow in a personal desktop tool?
2. What is officially supported by OpenAI today?
3. What approaches look fragile, private, or likely to break policy/support boundaries?
4. If direct OAuth/session use is not supported, what is the fallback path?

## Current Official Picture

### 1. The normal OpenAI API path is still API-key based

Official OpenAI API docs and best-practice material describe API authentication around API keys and project/service-account style credentials, not arbitrary end-user OAuth for desktop apps.

Relevant sources:
- OpenAI API authentication guide: https://platform.openai.com/docs/api-reference/authentication
- OpenAI production best practices: https://platform.openai.com/docs/guides/production-best-practices
- OpenAI API key safety: https://help.openai.com/en/articles/5112595-best-practices-for-api-key-safety

Practical reading:
- A personal desktop app should assume the supported path is still an app-controlled API credential flow.
- Client-side bundled secrets remain a bad idea.

### 2. OpenAI does document OAuth, but for GPT Actions inside ChatGPT

OpenAI has official documentation for OAuth in the context of GPT Actions. That is a ChatGPT product feature for connecting GPTs to third-party services. It is not presented as a general-purpose authentication mechanism for arbitrary local tools calling the OpenAI API.

Relevant source:
- GPT Actions authentication: https://platform.openai.com/docs/actions/authentication

Inference from the docs:
- GPT Actions OAuth is not the same thing as “my Electron app signs into OpenAI with OAuth and then calls the API as the user.”

### 3. There are product-specific sign-in flows, but they are not a general provider strategy

OpenAI currently documents sign-in with ChatGPT for Codex CLI. That flow is tied to a specific OpenAI product experience and still results in a usable API credential path rather than a generic reusable session-cookie integration pattern for third-party apps.

Relevant source:
- Codex CLI sign in with ChatGPT: https://help.openai.com/en/articles/11096431-openai-codex-cli-getting-started

Inference from the docs:
- This is evidence that OpenAI can offer product-scoped account sign-in flows.
- It is not evidence that arbitrary personal tools should scrape, reuse, or depend on ChatGPT web sessions.

## What Looks Fragile or Out of Bounds

These approaches should be treated as risky unless OpenAI publishes explicit support for them:

- Reusing ChatGPT web cookies or browser sessions inside the desktop app
- Reverse-engineering private ChatGPT endpoints
- Treating Codex CLI login behavior as a public auth pattern for unrelated apps
- Shipping raw API keys in the Electron renderer or checked-in config

Reasoning:
- None of the official sources above position those flows as supported integration paths.
- They are likely to be brittle, revocable, and hard to secure.

## Recommended Fallback Path

If supported OAuth/session use is unavailable, the project should use this fallback:

1. Keep the current deterministic local stub flows as the default implementation.
2. Keep provider integration behind a narrow `ProviderAdapter` boundary.
3. If real provider support is added later, prefer an officially documented API-key or server-mediated flow.
4. Do not finalize any direct end-user OAuth/session design until OpenAI publishes a clearly supported pattern for this exact use case.

## Explicit Non-Goals For The First Milestone

The first working milestone targets deterministic stubs plus interface boundaries only.

Non-goals:
- No direct GPT/provider integration yet
- No ChatGPT session reuse
- No unofficial OAuth/session workaround
- No renderer-side secret storage

Until OpenAI support is verified, this repository should treat provider access as a future integration behind contracts, not as part of the current milestone scope.
