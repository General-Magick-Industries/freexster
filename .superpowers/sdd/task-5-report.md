# Task 5 Report: Desktop App Shell

## Summary

Implemented the desktop-first Freexster app shell on top of the existing state and adapter work:

- Added `AppShell` with inbox-first layout, surface navigation, trust context, and native status topbar.
- Added scoped shell components: `Sidebar`, `InboxPanel`, `ThreadPanel`, and `TrustPanel`.
- Wired `FreexsterApp` through `useFreexsterData` and the mock client so the shell renders real state instead of a static landing screen.
- Replaced the starter CSS with the desktop shell styling from the brief.

Because the ownership boundary did not include new `ChannelsPanel.tsx` and `PlaceholderSurface.tsx` files, I implemented the exact briefed temporary behavior as local helper components inside `src/components/AppShell.tsx` to preserve scope.

## TDD Evidence

1. Added `src/components/AppShell.test.tsx` exactly as specified.
2. Ran `npm test -- src/components/AppShell.test.tsx`.
3. Confirmed the expected red failure: import resolution failed because `./AppShell` did not exist yet.
4. Implemented the shell and reran the focused test until green.

The focused red failure was:

```text
Failed to resolve import "./AppShell" from "src/components/AppShell.test.tsx". Does the file exist?
```

## Implementation Notes

### `src/components/Sidebar.tsx`

- Used a local `SidebarIcon` alias with `import type { ComponentType } from "react"` to resolve the brief's `React.ComponentType` type-position issue cleanly in TypeScript.
- Preserved the intended navigation behavior and labels from the brief.

### `src/components/AppShell.tsx`

- Uses `getActiveThread`, `getActiveChannel`, and `listApprovedChannels` selectors.
- Shows inbox panels for the default surface, channels when selected, and honest placeholders for the remaining surfaces.
- Chooses trust proofs from the active thread by default and from the active channel on the channels surface.

### `src/app/FreexsterApp.tsx`

- Swapped the splash-screen placeholder for the real app shell wiring using `createMockFreexsterClient()` and `useFreexsterData()`.
- Preserved loading and error boot states.

### `src/styles.css`

- Applied the desktop shell layout and responsive breakpoints from the brief.
- Kept the UI compact and work-oriented, with a mixed neutral/teal palette rather than a one-hue surface.

## Test Adjustment Outside Original File List

The existing `src/app/FreexsterApp.test.tsx` targeted the old synchronous splash screen. After the brief-required app wiring, `FreexsterApp` now renders a loading state first and then the shell asynchronously. I updated that test to wait for the loaded heading with `findByRole(...)` so the required verification command in the brief can pass against the new behavior.

## Verification

Ran and passed:

```powershell
npm test -- src/components/AppShell.test.tsx src/app/FreexsterApp.test.tsx
npm run build
```

Results:

- `3` tests passed across `2` test files.
- Production build completed successfully with Vite.

## Commit

Created commit with the exact requested message:

```text
feat: add desktop app shell
```

## Self-Review

- Scope stayed within the requested app-shell surface plus one necessary test update for the async boot behavior.
- No unrelated files were modified.
- The inbox-first layout, curated channels surface, and visible trust context are all present from the first loaded screen.

## Fix Report

### What changed

- Replaced the topbar mojibake separator with the ASCII string ` / ` and added a regression assertion in `AppShell.test.tsx`.
- Extracted the inline `ChannelsPanel` and `PlaceholderSurface` helpers out of `AppShell.tsx` so the shell file now focuses on layout and surface routing.
- Added channel request lifecycle handling in `ChannelsPanel.tsx`: pending state, disabled button while in flight, success message, and error recovery message.
- Added `aria-current="page"` to the active sidebar item.
- Expanded `AppShell` coverage so the tests render the channels surface, assert active navigation semantics, exercise the request action, and verify duplicate clicks are blocked while a request is pending.

### Tests run and outputs/results

- `npm test -- src/components/AppShell.test.tsx src/app/FreexsterApp.test.tsx`
  - Result: passed
  - Output summary:
    - `src/app/FreexsterApp.test.tsx` passed (`1` test)
    - `src/components/AppShell.test.tsx` passed (`3` tests)
    - `Test Files 2 passed`
    - `Tests 4 passed`
- `npm run build`
  - Result: passed
  - Output summary:
    - `tsc -b && vite build`
    - `1590 modules transformed`
    - emitted `dist/index.html`, `dist/assets/index-rKgzHB1z.css`, and `dist/assets/index-BDAfjVKh.js`
    - `built in 1.51s`

### Files changed

- `src/components/AppShell.tsx`
- `src/components/Sidebar.tsx`
- `src/components/ChannelsPanel.tsx`
- `src/components/PlaceholderSurface.tsx`
- `src/components/AppShell.test.tsx`
- `src/styles.css`

### Self-review notes

- The new request feedback stays local to the channels surface and does not require widening app state ownership.
- Duplicate channel submissions are blocked in the UI while the first async request is unresolved.
- Verification stayed within the requested commands, and both are green after the test-file syntax fix caught during the first run.

## Fix Report

### What changed

- Updated the shared action button style selector in `src/styles.css` to include `.reader-actions button`, so buttons in the `.reader-actions` wrapper receive the same chrome as `.actions button` and `.reader > button` instead of browser defaults.

### Tests run and outputs/results

- `npm test -- src/components/AppShell.test.tsx src/app/FreexsterApp.test.tsx`  
  - Result: passed (exit code 0).  
  - Output: `Test Files 2 passed (2)`, `Tests 4 passed (4)`, Duration `1.86s`.
- `npm run build`  
  - Result: passed (exit code 0).  
  - Output: `1590 modules transformed`, `✓ built in 1.52s`.

### Files changed

- `src/styles.css`
- `.superpowers/sdd/task-5-report.md`

### Self-review notes

- The change is minimal and scoped to shared button styling as requested.
- No functional behavior changed; only presentation consistency for channel request actions was adjusted.
