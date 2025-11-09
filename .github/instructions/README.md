# Module-Specific Instructions

This directory contains detailed, path-specific instructions for working with different parts of the codebase. These instructions supplement the main [copilot-instructions.md](../copilot-instructions.md) file.

## Available Instruction Files

### [components.instructions.md](./components.instructions.md)
**Use when working with:** `src/components/`
- React component development patterns
- Component structure and organization
- Props, state, and event handling
- Styling with CSS modules and Material-UI
- Localization in components
- Accessibility best practices

### [hooks.instructions.md](./hooks.instructions.md)
**Use when working with:** `src/hooks/`
- Custom React hooks patterns
- Hook naming and structure
- State management in hooks
- Effect dependencies and cleanup
- Testing custom hooks
- Common hook patterns (data fetching, form state)

### [services.instructions.md](./services.instructions.md)
**Use when working with:** `src/services/`
- API service development
- Authentication patterns (Bearer tokens)
- Request/response typing
- Error handling and retry logic
- File uploads and pagination
- Mocking services in tests

### [testing.instructions.md](./testing.instructions.md)
**Use when working with:** `tests/` or writing tests
- Vitest and React Testing Library setup
- Testing components, hooks, and reducers
- Mocking patterns (axios, MSAL, modules)
- Async testing with waitFor
- Accessibility testing
- Test coverage best practices

## How to Use These Instructions

1. **Start with the main instructions**: Always read [copilot-instructions.md](../copilot-instructions.md) first for project-wide guidelines.

2. **Use path-specific instructions**: When working on a specific module, refer to the relevant instruction file for detailed patterns and examples.

3. **Follow the patterns**: These files contain actual code examples from the project or aligned with project conventions.

4. **Keep them updated**: When patterns evolve or new best practices emerge, update these files accordingly.

## Organization

Each instruction file follows a similar structure:
- **Overview**: Purpose and context
- **Key Patterns**: Common code patterns with examples
- **Best Practices**: Do's and don'ts
- **Testing**: How to test the code
- **Anti-Patterns**: What to avoid

## Questions or Improvements

If you find gaps in these instructions or have suggestions for improvements, please:
1. Open an issue describing the missing guidance
2. Submit a PR with proposed additions
3. Discuss in team meetings

These instructions are living documents that should evolve with the project.
