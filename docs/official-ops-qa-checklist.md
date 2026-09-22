# Official Operations QA Checklist

Use this checklist before promoting the official incident operations experience to production.

## Incident queue

- [ ] Confirm the queue loads for an authenticated official account.
- [ ] Confirm the `All` and `Needs action` filters return the expected records.
- [ ] Confirm priority and status labels match the API payload.
- [ ] Confirm the queue refreshes without duplicating records.
- [ ] Confirm the empty state and API error state are readable on mobile.

## Incident detail and workflow

- [ ] Verify every workflow transition is authorized server-side.
- [ ] Verify invalid or out-of-order transitions are rejected.
- [ ] Verify duplicate, rejected, cancelled, and resolved states are rendered correctly.
- [ ] Verify responder assignment cannot be performed by unauthorized roles.
- [ ] Verify workflow history is ordered and displays the actor and timestamp.

## Security and privacy

- [ ] Test direct access to another incident ID with an account lacking permission.
- [ ] Verify API routes enforce authentication and role checks independently of the UI.
- [ ] Verify request bodies are validated for allowed status values and responder IDs.
- [ ] Verify sensitive resident information is not exposed in list responses unnecessarily.
- [ ] Verify Supabase RLS policies cover read, update, and assignment operations.

## Release validation

- [ ] Run TypeScript validation.
- [ ] Run the production build.
- [ ] Test the responsive layout at mobile, tablet, and desktop widths.
- [ ] Test keyboard focus and visible focus indicators for interactive controls.
- [ ] Test the Capacitor Android build after web validation passes.
