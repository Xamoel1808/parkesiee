---
description: Pre-commit Security & Quality Check for EduVibe
---

# Workflow: Pre-commit Security & Quality Check

An Antigravity workflow triggered before finalizing task implementation (US19 & US21).

1. Execute a fast static analysis or manual check for unhashed passwords and exposed secrets.
2. Review added logic to confirm corresponding tests exist or are added.
3. Validate if the new code follows SonarQube principles (low complexity, DRY, descriptive naming).
4. Prompt the user for approval or modifications before validating atomic Git commits.
