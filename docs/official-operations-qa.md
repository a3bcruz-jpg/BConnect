# Official Operations QA Checklist

Use this checklist when validating the official incident operations flow on the `feat/incident-ops-live` branch.

## Dashboard

- [ ] Dashboard loads incident records from `/api/incidents`.
- [ ] Active, critical, high, medium, and low counters match the loaded records.
- [ ] `All` and `Needs action` filters update the incident queue.
- [ ] Refresh reloads data without a full page navigation.
- [ ] Auto-refresh runs every 30 seconds and is cleaned up on unmount.
- [ ] Incident rows open the matching official incident detail page.
- [ ] Missing coordinates and missing location text are handled gracefully.
- [ ] API errors are shown in an accessible alert region.

## Incident detail and workflow

- [ ] Detail page loads the incident, workflow updates, and responders.
- [ ] Current status and priority are displayed clearly.
- [ ] AI priority is presented as advisory, not as the final official decision.
- [ ] Only valid next workflow transitions are displayed.
- [ ] Busy actions are disabled while a transition request is in progress.
- [ ] Responder assignment requires a selected responder.
- [ ] Offline responders cannot be assigned.
- [ ] Successful transitions reload incident and responder data.
- [ ] Failed transitions display an accessible error message.
- [ ] Terminal statuses do not expose additional workflow actions.

## Security and authorization

- [ ] API authorization is enforced server-side for every mutation.
- [ ] Client-side controls are not treated as a security boundary.
- [ ] Incident identifiers are URL-encoded before API requests.
- [ ] Unauthorized users cannot update incident status or assignment.

## Accessibility and responsive behavior

- [ ] Keyboard users can reach every action and navigation link.
- [ ] Focus indicators are visible on interactive controls.
- [ ] Disabled and busy states are visually and semantically clear.
- [ ] Layout remains usable at mobile, tablet, and desktop widths.
- [ ] Status and priority are not communicated by color alone.

## Release checks

- [ ] TypeScript check passes.
- [ ] Production build passes.
- [ ] Manual smoke test completed with a submitted incident.
- [ ] Manual smoke test completed through verification, assignment, response, resolution, and closure where permitted.
