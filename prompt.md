# Production Engineering: Resolve Remaining Technical Debt

Act as a Senior Software Engineer responsible for bringing this codebase to production-grade quality.

Your task is to investigate, fix, and verify the remaining technical debt listed below. Do not blindly rewrite existing implementations. Understand the current architecture, identify the root causes, research official documentation where necessary, and implement maintainable solutions.

## 1. Secure `getLongUrl` Supabase filtering

**Current issue:**
`getLongUrl` constructs its `.or()` filter using a raw URL slug. Special characters such as commas and parentheses can alter the PostgREST filter expression.

**Requirements:**
- Inspect the complete URL resolution flow and current database schema.
- Research Supabase and PostgREST filter syntax and escaping requirements.
- Prefer a safer query design that avoids interpolating untrusted user input into raw `.or()` expressions.
- If appropriate, use separate parameterized filter methods or redesign the lookup.
- Validate and normalize incoming slugs before database queries.
- Ensure special characters cannot change query semantics.
- Preserve existing URL resolution behavior and response contracts.

**Tests:**
Cover commas, parentheses, quotes, periods, whitespace, URL-encoded characters, malformed slugs, and valid existing slugs.

Do not claim production database verification if Supabase credentials or a real project are unavailable.

## 2. Fix QR code downloads

**Current issue:**
The application uses `<a download>` with a cross-origin image URL. Some browsers ignore the download attribute and open the image instead.

**Requirements:**
- Inspect the current QR generation and storage flow.
- Implement a reliable download mechanism.
- Prefer fetching the image as a Blob and creating a temporary object URL when CORS permits.
- If the storage provider does not support CORS, consider a same-origin server-side download endpoint or an appropriate storage configuration.
- Set a meaningful filename and correct MIME type.
- Revoke temporary object URLs after use.
- Handle failed requests, unsupported formats, and network errors.
- Never silently report a successful download when it failed.

Test the implementation in supported browsers where practical.

## 3. Make short-code generation collision-safe

**Current issue:**
Short codes currently use four random characters without collision retries. Custom slugs are not validated.

**Requirements:**

- Inspect the existing short-code generation logic, database schema, and insert flow.
- Introduce a clearly defined slug validation policy.
- Define allowed characters, minimum and maximum lengths, normalization rules, and reserved slugs.
- Preserve valid existing custom slugs wherever possible.
- Prevent invalid, ambiguous, or potentially dangerous slug values.
- Add a database-level UNIQUE constraint on the short-code column.
- Implement bounded collision retries for automatically generated codes.
- Retry only on actual unique-constraint violations, not arbitrary database failures.
- Return a meaningful error when retry limits are exhausted.
- Ensure concurrent requests cannot create duplicate short codes.
- Do not rely exclusively on application-level existence checks.

Consider whether four-character codes provide sufficient capacity for the expected scale. If changing the length or alphabet is justified, explain backward compatibility and migration implications before implementing it.

## 4. Reduce JavaScript bundle size

**Current issue:**
The main JavaScript chunk is approximately 594 kB.

**Requirements:**

First, establish a baseline:
- Identify the build tool and bundler.
- Generate and inspect a production bundle analysis.
- Identify the largest dependencies and expensive imports.
- Distinguish genuinely necessary code from unnecessarily included code.

Then optimize:
- Introduce route-level code splitting where appropriate.
- Lazy-load expensive components that are not needed immediately.
- Remove unused dependencies and dead code.
- Review duplicate dependencies and oversized libraries.
- Replace unnecessarily heavy imports with smaller alternatives when justified.
- Review tree-shaking effectiveness.
- Avoid loading development-only utilities in production.
- Preserve existing application functionality and UX.

Do not blindly split everything or introduce unnecessary abstractions.

Provide before-and-after bundle measurements, including initial JavaScript size and largest chunks.

## 5. Regression and quality verification

After implementing the fixes:

- Run the existing test suite.
- Add targeted regression tests for every resolved issue.
- Run linting and type checking.
- Run a production build.
- Check for broken imports, hydration errors, console errors, and runtime regressions.
- Review database migrations and backward compatibility.
- Verify that existing short URLs continue to resolve.
- Verify that the removed, never-rendered device chart remains removed unless a concrete product requirement justifies restoring it.

Do not introduce unrelated refactoring.

## 6. Engineering constraints

Follow these principles throughout the task:

1. Audit before modifying.
2. Understand existing conventions before introducing new ones.
3. Prefer the smallest correct architectural change.
4. Use official documentation and maintained APIs.
5. Never invent successful test results.
6. Never weaken validation to make tests pass.
7. Never remove existing functionality without justification.
8. Avoid unnecessary dependencies.
9. Keep changes focused, readable, and maintainable.
10. Document environmental limitations explicitly.

If a fix requires external infrastructure, credentials, or configuration, implement everything that can be safely verified locally and document the remaining deployment requirement.

## 7. Final engineering report

At completion, provide:

| Area | Before | After | Verification |
|---|---|---|---|
| Supabase filtering | Vulnerable raw filter construction | Actual implementation | Test results |
| QR downloads | Cross-origin download issue | Actual implementation | Browser/CORS verification |
| Short codes | No collision retry | Actual implementation | Concurrency and DB tests |
| Bundle size | ~594 kB | Measured result | Production build |

Also include:

- Files modified and why.
- Database migrations introduced, if any.
- New tests and their results.
- Bundle-size comparison.
- Remaining technical debt.
- External configuration still required.
- Any fixes that could not be verified.

**Definition of done:** All four issues are either fixed and verified or explicitly documented with a concrete reason why they remain unresolved. No issue should be marked fixed merely because code was changed.

Start with a read-only audit. Then implement the fixes in logical stages and verify each stage before moving to the next.