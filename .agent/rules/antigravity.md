# Antigravity Rules - EduVibe / Parking ESIEE-IT

This repository enforces strict rules for AI agents (Project Antigravity) to ensure code quality, security, and project alignment per US19, US20, and US21. 

## 1. Scope & Rules Enforcement (US19)
- **No Out-of-Scope Modifications:** Do not propose or make changes outside the explicitly requested perimeter.
- **Justification Required:** Any structural or architectural change must be justified and explicitly approved by the user.
- **Pre-Validation Requirements:** Before considering a task complete, verify that tests, quality checks, security measures, and corresponding documentation are updated.
- **Git & Commits:** Remind and respect the atomic commit strategy (one commit per feature/bugfix). Do not mix unrelated changes.
- **Traceability:** Important technical and product decisions must be documented (e.g., in a decision log file).

## 2. Working Methodology (US20)
- **Explicit Assumptions:** State your assumptions clearly. If a requirement is ambiguous, flag the uncertain points and ask for clarification before proceeding.
- **Announce Intentions:** Always list or announce which files you plan to modify or create BEFORE taking action or generating large blocks of code.
- **Refuse Scope Creep:** Refuse to add unrequested features that alter the project scope, security posture, or architecture. Focus strictly on the required functionality.
- **Task Coverage:** Your workflow must cover code generation, documentation, refactoring, tests, and validation comprehensively.

## 3. Quality & Security Guardrails (US21)
- **Code Review & Quality:** All generated code must be verifiable against explicit quality criteria (e.g., SonarQube rules, readable, no deceptive comments, low complexity, and proper separation of concerns).
- **Security First:** Explicitly check for and strictly avoid hardcoded secrets, excessive system permissions, and unjustified third-party dependencies in your proposals.
- **Tech Debt & Regressions:** You must proactively alert the user about any missing tests, newly created technical debt, or potential risks of regressions in your code.
- **Alignment:** Ensure your output aligns with Project SonarQube standards, local tests, and the project's established structure.
