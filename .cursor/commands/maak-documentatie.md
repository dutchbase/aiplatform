# Add Documentation

## Purpose

Create or update documentation so teammates can understand what changed and how to use it. Write in clear language and store files in the correct location (for example, `/docs`, `README.md`, or inline comments when appropriate). Re-use existing sections and styles; do not duplicate content under different headings.

## Writing Steps

1. **Overview**
    - Describe what the feature or code does.
    - Explain why it exists and when to use it.
    - Define key concepts or terms introduced.
2. **API Documentation**
    - List function or method names with short descriptions.
    - Explain parameters, return values, and expected formats.
    - Provide at least one example call or snippet.
    - Note any errors, edge cases, or rate limits.
3. **Implementation Details**
    - Summarize the architecture or data flow.
    - Highlight important design decisions.
    - Mention dependencies, integrations, and configuration requirements.
4. **Examples & Guidance**
    - Give common usage examples end-to-end.
    - Share best practices and recommended patterns.
    - Warn about common pitfalls or gotchas.

## Changelog Requirement

Document updates must always include an entry in `docs/changelog.md`. Add a new dated section if needed and record the documentation work under the correct heading (usually **Changed**). Keep the format consistent with the existing Keep a Changelog structure.

## Checklist Before Finishing

- [ ] Explained what the code/feature does and why it matters.
- [ ] Defined key concepts and terminology.
- [ ] Documented function/method signatures.
- [ ] Documented parameters and return values.
- [ ] Added example usage with code snippets.
- [ ] Documented error handling and edge cases.
- [ ] Provided architecture or workflow overview.
- [ ] Listed important design decisions and dependencies.
- [ ] Included common use cases with full examples.
- [ ] Shared best practices and patterns.
- [ ] Flagged common pitfalls to avoid.
- [ ] Updated `docs/changelog.md` with the documentation changes.