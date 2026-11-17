/**
 * Keston UI's own words in English: what its components say and announce
 * (button names, screen reader text, empty and error messages). Apps add
 * these to their vue-i18n messages (see `createKestonI18n`) and keep their
 * own under other keys.
 *
 * To add a language, copy this object, translate the values and give it to
 * `createKestonI18n` under its code, e.g. `{ en, cy }`. Keep the keys and
 * the `{placeholders}` as they are.
 */
export const en = {
  ui: {
    age: {
      born: 'Born {date}',
      birthdayToday: 'Birthday today',
      birthdayTomorrow: 'Birthday tomorrow',
      birthdayInDays: 'Birthday in {days} days'
    },
    appShell: {
      menu: 'Menu',
      expandSidebar: 'Expand sidebar',
      collapseSidebar: 'Collapse sidebar'
    },
    avatar: {
      account: 'Account: {name}',
      accountWithInitials: '{initials}, account: {name}'
    },
    avatarGroup: {
      people: 'no people | 1 person | {count} people',
      more: '{count} more: {names}'
    },
    breadcrumb: { label: 'Breadcrumb' },
    calendar: {
      previousMonth: 'Previous month',
      nextMonth: 'Next month',
      previousYear: 'Previous year',
      nextYear: 'Next year',
      previousYears: 'Previous years',
      nextYears: 'Next years',
      chooseMonth: 'Choose month',
      chooseYear: 'Choose year'
    },
    changeIndicator: { changed: 'Changed from {from} to {to}' },
    chip: { remove: 'Remove' },
    formField: { about: 'About {label}' },
    header: {
      menu: 'Menu',
      signIn: 'Sign in',
      account: 'Account: {name}',
      accountWithInitials: '{initials}, account: {name}'
    },
    input: {
      maxLength: 'Must be {count} characters or fewer',
      minLength: 'Must be at least {count} characters'
    },
    inputCode: { character: 'Character {n} of {total}' },
    inputDate: {
      openCalendar: 'Open calendar',
      enterDate: 'Enter a date like {example}'
    },
    inputPassword: {
      capsLock: 'Caps Lock is on',
      show: 'Show password'
    },
    inputRichText: {
      formattingFor: 'Formatting for {label}',
      bold: 'Bold',
      italic: 'Italic',
      underline: 'Underline'
    },
    languageSwitcher: { label: 'Language' },
    notifications: {
      title: 'Notifications',
      region: 'Notification',
      hotkeyRegion: 'Notifications ({hotkey})',
      notifications: 'notifications',
      empty: 'You’re all caught up.',
      withUnread: '{label}, {count} unread',
      dismiss: 'Dismiss: {title}',
      close: 'Close: {title}',
      clearAll: 'Clear all',
      more: '+{count} more'
    },
    pageHeader: {
      actions: '{title} actions',
      moreActions: 'More actions'
    },
    progress: { stepOf: 'Step {current} of {total}' },
    select: {
      choose: 'Choose…',
      search: 'Search…',
      noMatches: 'No matches',
      showOptions: 'Show options',
      remove: 'Remove {name}'
    },
    sidebar: {
      main: 'Main',
      backFrom: 'Back from {name}',
      expand: 'Expand sidebar',
      collapse: 'Collapse sidebar'
    },
    slideover: {
      close: 'Close',
      cancel: 'Cancel',
      previous: 'Previous',
      next: 'Next',
      finish: 'Finish',
      steps: 'Steps',
      stepOf: 'Step {current} of {total}: {name}'
    },
    spinner: { loading: 'Loading' },
    statTile: { up: 'Up', down: 'Down', flat: 'No change' },
    steps: {
      stepOf: 'Step {current} of {total}',
      stepOfNamed: 'Step {current} of {total}: {name}'
    },
    summaryList: { notSet: 'Not set' },
    table: {
      table: 'Table',
      empty: 'Nothing to show.',
      selectAll: 'Select all rows',
      selectRow: 'Select row {n}',
      select: 'Select'
    },
    unsavedChangesBar: {
      message: 'Unsaved changes',
      discard: 'Discard',
      save: 'Save'
    }
  }
}

export type UiMessages = typeof en
