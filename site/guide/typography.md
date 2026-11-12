# Typography

Keston UI uses **Lato** in regular (400) and bold (700), with italics. It's served with the library from `theme.css`, so it works everywhere, including Safari, with no requests to Google.

## Sizes

The components use Tailwind's text sizes:

| Class | Size | Used for |
|---|---|---|
| `text-xs` | 12px | Helper text, field messages, small buttons, captions |
| `text-sm` | 14px | Most interface text: labels, fields, medium buttons, tables |
| `text-base` | 16px | Body text, large buttons, card titles |
| `text-lg` | 18px | Panel titles, e.g. a Slideover's |
| `text-xl` | 20px | Page and sign-in headings |

On touch screens, form fields use 16px text: iPhone zooms the page into any field with smaller text when it's tapped.

## Weight

Use bold (`font-bold`) for headings, names and totals. Everything else is regular. There's no semibold or light: two weights keep the hierarchy clear.

## Writing

- Sentence case everywhere: "Add a student", not "Add A Student".
- Say what something does: "Save changes", not "OK".
- Keep labels short, and put guidance in helper text.
