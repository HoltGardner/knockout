# Migrating this tree to HoltGardner/exit-strategy

This directory is the complete future root of the dedicated repository
(decision D-004). It is staged inside the knockout fork only because remote
Claude sessions are repo-scoped and the session that built it could not be
granted access to the new repo (the `add_repo` approval never rendered).

## One-time migration (run on any machine with GitHub access)

```bash
git clone --depth 1 -b claude/escape-velocity-flagship-spec-g5brle \
  https://github.com/HoltGardner/knockout.git es-staging
cd es-staging/exit-strategy
git init -b main
git add -A
git commit -m "EXIT STRATEGY: spec, decisions, AI-first foundation, Phase 0 T0.1 scaffold"
git remote add origin https://github.com/HoltGardner/exit-strategy.git
git push -u origin main
cd ../.. && rm -rf es-staging
```

If the new repo was created with an initial README/`.gitignore`, add
`--force` to the push (it only contains auto-generated files) or pull and
merge first.

## After migrating

1. Verify GitHub Actions ran on `main`: three jobs — `typecheck-lint-unit`,
   `ethics`, `sim-balance` — all green.
2. Mark `ethics` and `sim-balance` as required status checks in branch
   protection for `main`.
3. Start future Claude sessions scoped to `HoltGardner/exit-strategy`; work
   continues from `docs/tickets/phase-0-infrastructure-spine.md` (T0.2).
4. Delete the `exit-strategy/` tree from the knockout fork and close its
   staging PR.
