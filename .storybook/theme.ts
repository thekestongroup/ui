import { create } from 'storybook/theming'

// Keston branding for the docs site: the Storybook frame (sidebar, toolbar)
// and the docs pages. Values come from src/styles/theme.css.
const black = '#050505'
const white = '#fafafa'
const kblue = '#023750'
const line = 'rgba(5, 5, 5, 0.15)'
const muted = 'rgba(5, 5, 5, 0.65)'

export const kestonTheme = create({
  base: 'light',

  brandTitle: 'Keston UI',
  brandUrl: './',
  brandTarget: '_self',

  colorPrimary: kblue,
  colorSecondary: kblue,

  // Sidebar on Keston's light grey surface, content on white.
  appBg: '#ebebeb',
  appContentBg: white,
  appPreviewBg: white,
  appHoverBg: '#e1e1e1',
  appBorderColor: line,
  appBorderRadius: 4,

  fontBase: '"Lato", sans-serif',

  textColor: black,
  textInverseColor: white,
  textMutedColor: muted,

  barTextColor: muted,
  barHoverColor: kblue,
  barSelectedColor: kblue,
  barBg: white,

  buttonBg: white,
  buttonBorder: line,
  booleanBg: '#e1e1e1',
  booleanSelectedBg: white,

  inputBg: white,
  inputBorder: line,
  inputTextColor: black,
  inputBorderRadius: 4,
})
