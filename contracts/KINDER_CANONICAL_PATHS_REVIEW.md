# Kinder Garden — Canonical Paths and STOS Synchronization Review
Status: READ-ONLY INVENTORY / NON-DESTRUCTIVE · 2026-10-11
Branch assessed: main
Scope: Issue 3 of ten-point forensic hardening.

## Duplicate identity check (Git blob SHA)
| Root path | Curriculum mirror | Result |
|---|---|---|
| assets/app.js (9adcfc3) | curriculum/assets/app.js (64d1c15) | DIFFERENT: 12,986 vs 13,021 bytes |
| assets/certificate.js | curriculum/assets/certificate.js | IDENTICAL |
| assets/companion-layer.js | curriculum/assets/companion-layer.js | IDENTICAL |
| assets/lesson.css | curriculum/assets/lesson.css | IDENTICAL |
| assets/styles.css | curriculum/assets/styles.css | IDENTICAL |
| data/course-data.js (cb305c8) | curriculum/data/course-data.js (4b7169a) | DIFFERENT: 729,220 vs 512,673 bytes |
| data/course-data.json | curriculum/data/course-data.json | IDENTICAL |
| data/a-plus-mastery.js | curriculum/data/a-plus-mastery.js | IDENTICAL |
| data/midyear-mastery.js | curriculum/data/midyear-mastery.js | IDENTICAL |

## Retention and promotion rules
1. Do not delete or overwrite divergent JavaScript data or application scripts based solely on filename.
2. Determine which live entry points actually load each path, including STOS's private copy, before aliasing either file.
3. Compare schema and actual unit/lesson coverage in each data file and preserve the more complete learning content, including any later enhancements.
4. For identical mirrors, prefer stable canonical references only after static and deployed route tests. Preserve existing URLs during migration.
5. Audit root assessments, curriculum assessments, root lessons, and curriculum lessons independently: their relative paths are not interchangeable.
6. Never bulk synchronize local browser evidence, learner identifiers, family records, mentor interactions, or STOS private runtime data into GitHub Pages.
7. Existing GitHub files are not evidence that private STOS contents have the same version. Require a separate read-only STOS file manifest with size and SHA-256 before sync.
8. No deletion or cutover is authorized by this review.

## Proposed sync boundaries
GitHub public main: approved public HTML/CSS/JS, curriculum assets and public static educational media.
STOS: source of authority for protected academic records, identity, private service implementation, and internal backups.
Synchronization: explicitly allowlisted public artifacts only, provenance/hash manifest, conflict check, staged dry run, atomic release, and reversible rollback.
