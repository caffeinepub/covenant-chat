# Specification

## Summary
**Goal:** Deliver a simple private two-person web chat that unlocks via a shared password (no accounts) and updates via periodic polling, with messages persisted in an Internet Computer canister.

**Planned changes:**
- Add a shared-password unlock step that gates all message read/write actions (masked password input; clear English errors on failure).
- Implement canister-backed message storage with APIs to append messages (server timestamp), list messages chronologically (optionally since an id/timestamp), and password-protected clear/reset history.
- Build the two-person chat UI: “You” (right) vs “Partner” (left) message alignment, with human-readable timestamps and send via button/Enter.
- Add polling-based refresh for new messages using an interval; pause/stop polling when locked out (no valid password).
- Apply a consistent light/dark theme across unlock + chat screens with a clean messaging layout and a non-blue/purple-dominant palette.

**User-visible outcome:** Users open the app straight into an unlock prompt, enter a shared password to access a clean two-person chat, send/receive messages that persist across refreshes, and see new messages appear automatically within the polling interval in both light and dark mode.
