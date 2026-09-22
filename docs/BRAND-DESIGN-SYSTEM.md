# BConnect Brand and UI Design System

## Brand lockup

BConnect is the official product name.

Tagline: Connect. Report. Respond.

The approved BConnect logo is the immutable primary brand mark. Product UI must not redraw, distort, recolor, crop, add effects to, or otherwise alter the approved symbol or wordmark. Use the approved artwork as supplied for brand placements and Android/web identity assets.

## Design principles

1. Trust first. Safety interfaces must feel calm, credible, and dependable.
2. Clarity under pressure. Emergency actions must be obvious and require minimal cognitive load.
3. Mobile first. Resident and responder workflows are optimized for Android phones before larger layouts.
4. Accessible by default. Text, controls, status colors, focus states, and touch targets must remain usable for people with visual, motor, or situational limitations.
5. Consistent system. Screens use shared tokens and component patterns rather than one-off styling.
6. Progressive detail. Show the most important incident information first and expose secondary information without clutter.

## Color tokens

Primary brand blue: `#0B66C3`

Primary blue dark: `#084D91`

Primary blue soft: `#EAF4FF`

Secondary brand green: `#1D9B68`

Green dark: `#13734D`

Green soft: `#E8F7F0`

Application background: `#F5F8FC`

Surface: `#FFFFFF`

Primary text: `#10233F`

Secondary text: `#53657A`

Muted text: `#718096`

Border: `#DCE6F0`

Success: `#16865B`

Warning: `#A86B00`

Error: `#C62828`

Emergency: `#B42318`

Emergency soft: `#FDECEC`

Never use color as the only signal for incident severity or status. Pair status color with text and/or an icon.

## Typography

Use a clean system sans stack with Inter as the preferred installed/web font where available:

`Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`

Hierarchy:

- Display: 32–40px, semibold, tight line height
- Page title: 24–30px, semibold
- Section title: 18–20px, semibold
- Body: 15–16px, regular, comfortable line height
- Supporting text: 13–14px
- Labels and metadata: 12–13px, medium
- Buttons: 14–16px, semibold

Avoid decorative, condensed, futuristic, or playful typefaces.

## Spacing

Use a 4px base grid. Preferred spacing values: 4, 8, 12, 16, 20, 24, 32, 40, 48.

Mobile page padding: 16–20px.

Primary action groups should have at least 12px separation.

## Shape and elevation

Default control radius: 10–12px.

Card radius: 16px.

Large feature surface radius: 20px.

Use restrained elevation. Prefer a subtle border plus a soft shadow over strong floating effects.

Do not use gradients, glassmorphism, bevels, 3D effects, or decorative shadows on brand marks.

## Buttons

Primary action: brand blue background with white text.

Secondary action: white surface with brand blue text and border.

Success action: green background with white text when the action represents a completed or positive operational state.

Emergency action: emergency red, reserved for genuinely urgent actions such as emergency escalation.

Disabled actions must have clear visual and semantic disabled states.

All interactive controls must have visible keyboard/focus treatment and a minimum touch target of approximately 44px.

## Incident status language

Use explicit labels such as:

- Submitted
- Under review
- Verified
- Assigned
- Accepted
- On the way
- On site
- Resolved
- Closed
- Queued

Status chips must remain understandable without color.

## Emergency reporting flow

The resident flow should follow this order:

Open BConnect → Report an Incident → incident type/description → location → evidence → review → submit → confirmation/tracking.

The primary report action should remain visually dominant without making the rest of the interface feel alarmist.

AI assistance can structure and clarify information but must not independently dispatch, determine guilt, diagnose, verify, reject, escalate, or close high-stakes incidents.

## Resident navigation

Use a simple mobile bottom navigation for high-frequency destinations. The report action may receive stronger emphasis than secondary destinations, but navigation must never compete with an active emergency flow.

## Responder navigation

Prioritize assigned incidents, availability, severity, location, ETA, current response status, and the next required action. Avoid decorative dashboard elements that delay operational decisions.

## Official dashboard

Prioritize queue health, incident severity, verification state, responder availability, assignment status, and auditability. Use dense information presentation on desktop while retaining readable cards and clear action hierarchy on tablets.

## Forms and inputs

Inputs require visible labels, clear validation, sufficient height, readable error text, and preserved user-entered content after validation failures. Location and evidence controls must expose permission or upload failures clearly.

## Accessibility

- Maintain strong foreground/background contrast.
- Never communicate critical state with color alone.
- Provide visible focus indicators.
- Support keyboard navigation on web.
- Respect reduced-motion preferences.
- Keep touch targets large enough for reliable use.
- Avoid flashing or rapid animation.
- Keep emergency and reporting flows usable when AI, GPS, push notifications, or network services fail.

## Motion

Motion is functional only. Use short, subtle transitions for navigation, expansion, confirmation, and loading. No animation should delay an emergency action or obscure incident information.

## Responsive layout

Mobile: single-column, thumb-friendly, high-priority actions near the lower reach zone.

Tablet: two-column where useful, with preserved touch targets.

Desktop: constrained content widths, multi-column operational dashboards, persistent navigation where appropriate.

## Component inventory

The shared system covers:

- App shell and brand header
- Approved BConnect logo lockup
- Buttons and icon buttons
- Cards and panels
- Inputs, selects, textareas, and validation states
- Status chips
- Emergency alerts
- Notification rows
- Incident cards and detail panels
- Map/location surfaces
- Evidence controls
- Report review and submission states
- Responder availability and assignment controls
- Announcements
- Profile/settings sections
- Bottom navigation
- Modals and confirmation dialogs
- Loading, empty, offline, queued, and error states

## Acceptance criteria

A screen is considered compliant only when it uses the shared color, typography, spacing, radius, status, accessibility, and interaction rules above and does not introduce a one-off visual language.

The approved logo remains visually unchanged everywhere it appears.
