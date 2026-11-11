# @thekestongroup/ui

## 0.3.0

### Minor Changes

- Rebuild Keston UI from scratch. All earlier 0.x components have been removed and replaced: this release breaks apps using 0.2, which is allowed before 1.0.
- Add Checkbox, RadioGroup, Switch, Calendar, Checklist and InfoTip, and export FormField. InputDate now uses Calendar, and field help icons use InfoTip.
- Add InputCode: a one-time code (authenticator app, email or text message) with one box per character, built on Reka UI's PinInput. Pasting or the phone's suggested code fills every box, and `complete` fires when the last one is filled.
- Add InputPassword: a password field with a Show / Hide button and a Caps Lock note. It hides the password again when its form is submitted.
- Add InputRichText: several lines of notes with bold, italic and underline, built on Tiptap. Its value is HTML.
- FormField and InputPassword: a `label-trailing` slot for something at the end of the label row, e.g. a "Forgot password?" link. It comes after the field in the Tab order.
- Add Link: an underlined text link in the colour and size of the text around it. `newTab` opens it in a new tab with a small external-page icon (`:icon="false"` hides it), and tells screen readers.
- Add Progress: a thin bar that fills up, splits into segments for steps, or sweeps when there's no telling how long something will take.
- Slideover: multi-step forms. Pass `steps` for a segment per step at the top, the step's name, and Cancel / Previous and Next / Finish at the bottom; `validateStep` checks each step before moving on, and `finish` fires after the last.
  Enter in a text field moves to the next step.
- Form fields use 16px text on touch screens, so iPhone no longer zooms in when one is tapped (pinch-zoom still works). Large Buttons have slightly rounder corners (6px); small and medium stay at 4px.

### Patch Changes

- InputDate: the first Enter fills in the full date the text means (e.g. "tmrw" or "26/1") instead of submitting the form; Enter again submits as usual.
