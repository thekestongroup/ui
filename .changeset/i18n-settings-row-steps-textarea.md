---
"@thekestongroup/ui": minor
---

Languages: components now take their words from vue-i18n, and there's a language switcher. **Breaking:** apps must install `vue-i18n` (11 or later) and set it up with `createKestonI18n` (see Guide → Languages); components throw without it. Text props such as `emptyText`, `finishLabel` and `removeLabel` still override the defaults. New components: `LanguageSwitcher`, `SettingsRow` (a setting's label and description beside its control), `CheckboxGroup` (several tick boxes under one question), `Steps` (a step header: segments plus "Step 2 of 3: Licences") and `InputTextArea` (plain multi-line text that grows with what's typed). `Switch` gains `hideLabel`.
