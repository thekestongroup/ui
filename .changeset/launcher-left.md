---
"@thekestongroup/ui": minor
---

AppShell now puts the app launcher at the far left of the header, to the left of the menu / sidebar toggle. The launcher's panel is now a simple list, one app per line with its icon then its name (the apps' `description` is no longer shown or part of `AppLauncherApp`). Header gets a `start` slot for this, and AppLauncher an `align` prop (which edge its panel lines up with).
