# AETHER v0 Accessibility Verification Checklist

## Scope

This checklist verifies the existing AETHER v0 behavior. It does not authorize visual redesign, source changes, token changes, or interaction refactoring.

## Keyboard

- [ ] All family filters are reachable in a logical order.
- [ ] The current family state is communicated programmatically.
- [ ] Shader cards or inspect actions are reachable without a pointer.
- [ ] Opening the inspection drawer moves focus to a meaningful element inside it.
- [ ] Focus remains contained when the drawer behaves as a modal surface.
- [ ] Escape closes the drawer when appropriate.
- [ ] Closing the drawer returns focus to the triggering control.
- [ ] No keyboard trap occurs.
- [ ] Visible focus remains discernible against animated and iridescent backgrounds.
- [ ] Free, paid, unavailable, and disabled states are distinguishable without relying on color alone.

## Reduced motion

Test with `prefers-reduced-motion: reduce` enabled before page load.

- [ ] Continuous decorative motion is removed or substantially reduced.
- [ ] Essential state changes remain understandable.
- [ ] No rapid flashing, strobing, or high-frequency luminance change appears.
- [ ] Drawer, filter, hover, and focus transitions do not depend on large movement.
- [ ] Paused or reduced shader behavior does not leave controls unusable.
- [ ] The preference is respected on initial render without requiring a manual toggle.

## Screen-reader and semantic spot checks

- [ ] The page has one clear primary heading.
- [ ] Filter controls expose names, roles, and selected state.
- [ ] Inspect controls have unique accessible names.
- [ ] Drawer title and description are associated with the drawer container.
- [ ] Tier and availability information is exposed as text.
- [ ] Canvas content has an appropriate accessible fallback or description.
- [ ] Decorative visuals are not announced redundantly.
- [ ] Error or fallback states are announced when they materially change the experience.

## Viewports

Run at minimum:

- [ ] 320 px width
- [ ] 768 px width
- [ ] 1440 px width

At each viewport confirm there is no obscured focus, unreachable control, horizontal overflow that hides actions, or drawer content clipped beyond scrolling access.

## Evidence record

For each run retain:

- commit SHA
- browser and operating system
- viewport
- reduced-motion state
- keyboard path followed
- failures found
- screenshots of focus and drawer states
- remediation issue links when applicable

## Approval rule

Approval is blocked by a keyboard trap, invisible focus, inaccessible drawer, unusable reduced-motion state, missing textual availability information, or a canvas failure that removes access to the page's core meaning.
