// Public API of @thekestongroup/ui.
// Components are grouped as in Storybook (Layout, Element, Form, Data,
// Navigation, Overlay). `pnpm new <Name> <Group>` adds a component's exports
// at the end of its group.

export { cn } from './lib/cn'

// Layout
export { default as AppShell } from './components/AppShell/AppShell.vue'
export type { AppShellProps } from './components/AppShell/AppShell.vue'
export { default as Header } from './components/Header/Header.vue'
export type { HeaderProps, HeaderUser, HeaderUserAction } from './components/Header/Header.vue'
export { default as PageHeader } from './components/PageHeader/PageHeader.vue'
export type { PageHeaderProps } from './components/PageHeader/PageHeader.vue'

// Element
export { default as Avatar } from './components/Avatar/Avatar.vue'
export type { AvatarProps, AvatarUser } from './components/Avatar/Avatar.vue'
export { default as AvatarGroup } from './components/AvatarGroup/AvatarGroup.vue'
export type { AvatarGroupProps } from './components/AvatarGroup/AvatarGroup.vue'
export { default as Badge } from './components/Badge/Badge.vue'
export type { BadgeProps } from './components/Badge/Badge.vue'
export { default as Button } from './components/Button/Button.vue'
export type { ButtonProps, ButtonStatus } from './components/Button/Button.vue'
export { default as Card } from './components/Card/Card.vue'
export type { CardProps } from './components/Card/Card.vue'
export { default as Chip } from './components/Chip/Chip.vue'
export type { ChipProps } from './components/Chip/Chip.vue'
export { default as Divider } from './components/Divider/Divider.vue'
export type { DividerProps } from './components/Divider/Divider.vue'
export { default as Spinner } from './components/Spinner/Spinner.vue'
export type { SpinnerProps } from './components/Spinner/Spinner.vue'
export { default as Progress } from './components/Progress/Progress.vue'
export type { ProgressProps } from './components/Progress/Progress.vue'

// Form
export { default as FormField } from './components/FormField/FormField.vue'
export type { FormFieldProps, FormFieldStatus } from './components/FormField/FormField.vue'
export { default as Input } from './components/Input/Input.vue'
export type { InputProps } from './components/Input/Input.vue'
export { default as InputNumber } from './components/InputNumber/InputNumber.vue'
export type { InputNumberProps } from './components/InputNumber/InputNumber.vue'
export { default as InputDate } from './components/InputDate/InputDate.vue'
export type { InputDateProps } from './components/InputDate/InputDate.vue'
export { default as InputRichText } from './components/InputRichText/InputRichText.vue'
export type { InputRichTextProps } from './components/InputRichText/InputRichText.vue'
export { default as InputPassword } from './components/InputPassword/InputPassword.vue'
export type { InputPasswordProps, InputPasswordStatus } from './components/InputPassword/InputPassword.vue'
export { default as InputCode } from './components/InputCode/InputCode.vue'
export type { InputCodeProps, InputCodeStatus } from './components/InputCode/InputCode.vue'
export { default as Select } from './components/Select/Select.vue'
export type { SelectProps } from './components/Select/Select.vue'
export { default as Checkbox } from './components/Checkbox/Checkbox.vue'
export type { CheckboxProps } from './components/Checkbox/Checkbox.vue'
export { default as RadioGroup } from './components/RadioGroup/RadioGroup.vue'
export type { RadioGroupProps, RadioOption, RadioValue } from './components/RadioGroup/RadioGroup.vue'
export { default as Switch } from './components/Switch/Switch.vue'
export type { SwitchProps } from './components/Switch/Switch.vue'
export { default as Calendar } from './components/Calendar/Calendar.vue'
export type { CalendarProps } from './components/Calendar/Calendar.vue'

// Data
export { default as Table } from './components/Table/Table.vue'
export type { TableProps } from './components/Table/Table.vue'
export type { TableColumn, TableSort, SortDirection } from './components/Table/table'
export { sortRows } from './components/Table/table'
export { default as StatTile } from './components/StatTile/StatTile.vue'
export type { StatTileProps } from './components/StatTile/StatTile.vue'
export { default as SummaryList } from './components/SummaryList/SummaryList.vue'
export type { SummaryListProps, SummaryListItem } from './components/SummaryList/SummaryList.vue'
export { default as Checklist } from './components/Checklist/Checklist.vue'
export type { ChecklistProps, ChecklistItem } from './components/Checklist/Checklist.vue'
export { default as RelativeTime } from './components/RelativeTime/RelativeTime.vue'
export type { RelativeTimeProps } from './components/RelativeTime/RelativeTime.vue'
export { default as Age } from './components/Age/Age.vue'
export type { AgeProps } from './components/Age/Age.vue'

// Navigation
export { default as Breadcrumb } from './components/Breadcrumb/Breadcrumb.vue'
export type { BreadcrumbProps, BreadcrumbItem } from './components/Breadcrumb/Breadcrumb.vue'
export { default as Sidebar } from './components/Sidebar/Sidebar.vue'
export type { SidebarProps, SidebarItem, SidebarSection } from './components/Sidebar/Sidebar.vue'
export { sidebarTrail } from './components/Sidebar/sidebar'
export { default as Link } from './components/Link/Link.vue'
export type { LinkProps } from './components/Link/Link.vue'

// Overlay
export { default as Popover } from './components/Popover/Popover.vue'
export type { PopoverProps } from './components/Popover/Popover.vue'
export { default as Slideover } from './components/Slideover/Slideover.vue'
export type { SlideoverProps } from './components/Slideover/Slideover.vue'
export { default as Tooltip } from './components/Tooltip/Tooltip.vue'
export type { TooltipProps } from './components/Tooltip/Tooltip.vue'
export { default as InfoTip } from './components/InfoTip/InfoTip.vue'
export type { InfoTipProps } from './components/InfoTip/InfoTip.vue'
export { default as Notification } from './components/Notification/Notification.vue'
export type { NotificationProps } from './components/Notification/Notification.vue'
export { default as NotificationPane } from './components/Notification/NotificationPane.vue'
export type { NotificationPaneProps } from './components/Notification/NotificationPane.vue'
export { default as Toaster } from './components/Notification/Toaster.vue'
export type { ToasterProps } from './components/Notification/Toaster.vue'
export { createNotifications, useNotifications, relativeTime } from './components/Notification/notifications'
export type {
  Notifications,
  NotificationItem,
  NotificationInput,
  NotificationAction,
  NotificationType,
  ToastOptions
} from './components/Notification/notifications'

// Helpers
export { age, daysToBirthday, formatDate, formatDateTime, toDate } from './lib/dates'
export type { DateInput } from './lib/dates'
export { useNow } from './lib/useNow'
