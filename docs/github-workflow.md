# GitHub Workflow and Evidence Guide

## Recommended commit sequence

1. `chore: scaffold MediStock React project`
2. `feat: build responsive operations dashboard`
3. `feat: add transactional MySQL inventory API`
4. `docs: add requirements backlog and UML designs`
5. `test: add traceable test matrix and test plan`

## Required branch and pull request

```bash
git switch -c feature/mysql-inventory-ledger
git add server design/architecture.md
git commit -m "feat: add transactional MySQL inventory API"
git push -u origin feature/mysql-inventory-ledger
```

Create a pull request titled `Add transactional inventory ledger`. Describe scope, linked user stories/requirements, test evidence, data/security impact, screenshots, and rollback. Obtain review, resolve comments, pass checks, then use **Squash and merge** or the instructor’s preferred strategy.

## Screenshots to capture

- Repository root showing `/requirements`, `/design`, `/planning`, `/testing`, `/server`, and `/app`.
- Commit history showing meaningful progress over time.
- Feature branch and open pull request with description.
- Review/checks and merged status.
- Excel test matrix stored in `/testing`.

The repository URL, timestamps, account names, review comments, and merge status must come from the real GitHub repository. They cannot be replaced with fabricated images.

## Traceability convention

Include IDs such as `US-06`, `FR-06`, and `TC-INT-03` in issues, cards, PR descriptions, or test evidence. Never commit passwords, `.env`, private customer data, database dumps, or access tokens.
