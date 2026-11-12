# Colours

Keston's colours are Tailwind theme tokens, defined in `theme.css`. Use them by name in classes, e.g. `bg-primary`, `text-red`, `border-black/15`. Avoid raw hex values, so every product stays in step when a colour changes.

## Brand and text

| | Token | Hex | Use for |
|---|---|---|---|
| <span class="swatch" style="background:#023750"></span> | `primary` (`kblue`) | `#023750` | Keston blue: primary buttons, selected items, the brand |
| <span class="swatch" style="background:#050505"></span> | `black` | `#050505` | Text. Use opacity for quieter text: `text-black/65` |
| <span class="swatch" style="background:#fafafa"></span> | `white` | `#FAFAFA` | Cards, fields, text on dark colours |

## Surfaces

| | Token | Hex | Use for |
|---|---|---|---|
| <span class="swatch" style="background:#e1e1e1"></span> | `background` | `#E1E1E1` | The app's frame behind the content: AppShell, Header, Sidebar |
| <span class="swatch" style="background:#ebebeb"></span> | `surface` | `#EBEBEB` | Quiet areas inside content |
| <span class="swatch" style="background:#f2f2f2"></span> | `surface-elevated` | `#F2F2F2` | Areas raised above a surface |

## Status

| | Token | Hex | Use for |
|---|---|---|---|
| <span class="swatch" style="background:#007a16"></span> | `green` | `#007A16` | Success |
| <span class="swatch" style="background:#f1c70b"></span> | `yellow` | `#F1C70B` | Warnings. Use black text on it |
| <span class="swatch" style="background:#d2042d"></span> | `red` | `#D2042D` | Errors and destructive actions |
| <span class="swatch" style="background:#035483"></span> | `blue` | `#035483` | Information, e.g. an info Badge or Notification |
| <span class="swatch" style="background:#007fc9"></span> | `focus` | `#007FC9` | The keyboard focus ring, and nothing else |

## Lines and quieter text

Borders and dividers are black at 15% (`border-black/15`). Secondary text is black at 65% (`text-black/65`), and placeholders at 55%. Using opacity, not extra greys, keeps them right on any of the surfaces above.
