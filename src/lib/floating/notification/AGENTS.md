# `@dvcol/neo-svelte/floating/notification`

```ts
import { NeoNotificationItem, NeoNotificationProvider, NeoNotificationStack, NeoSimpleNotification } from '@dvcol/neo-svelte/floating/notification';
```

## Components

- `NeoNotificationProvider` — app-level provider that owns the notification queue. Mount once near the root, inside `NeoThemeProvider`.
- `NeoNotificationStack` — renders the active notifications. Place at a stable location in your layout.
- `NeoNotificationItem` — single notification body; usually composed automatically by the stack.
- `NeoSimpleNotification` — drop-in toast for one-off messages without a provider.

## Concepts

- Imperative API surfaced via context: from any descendant of `NeoNotificationProvider`, push a notification with a service handle (success, error, info, warning, custom snippet).
- Queue strategy (`stack`, `replace`, `unique`) and lifetime (`duration`, `persistent`) are configured on the provider.

## Gotchas

- Notifications portal out of the trigger; without a `NeoThemeProvider` ancestor they render unstyled.
- Multiple providers in the same tree create separate queues — usually a bug; mount one per app.

See also: [floating/portal](../portal/AGENTS.md), [floating](../AGENTS.md).
