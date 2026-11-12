import { addons } from 'storybook/manager-api'
import { kestonTheme } from './theme.ts'

// The Storybook frame (sidebar, toolbar) branded as the Keston UI docs site.
// Lato, the favicon and the tab titles are set in manager-head.html.
addons.setConfig({ theme: kestonTheme })
