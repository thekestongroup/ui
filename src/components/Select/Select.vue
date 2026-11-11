<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useId, type Component, type HTMLAttributes } from 'vue'
import {
  ComboboxAnchor,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxLabel,
  ComboboxPortal,
  ComboboxRoot,
  ComboboxSeparator,
  ComboboxTrigger,
  ComboboxViewport,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectLabel,
  SelectPortal,
  SelectRoot,
  SelectSeparator,
  SelectTrigger,
  SelectViewport
} from 'reka-ui'
import { Check, ChevronDown, ChevronLeft, ChevronRight } from '@lucide/vue'
import { cn } from '../../lib/cn'
import Chip from '../Chip/Chip.vue'
import FormField, { type FormFieldStatus } from '../FormField/FormField.vue'
import { popoverContent } from '../Popover/popover'

export type SelectValueType = string | number

export interface SelectOption {
  /** Required. Shown in the list and, once chosen, in the field. */
  label: string
  /** What v-model is set to when chosen. Defaults to the label. Not used on options with children. */
  value?: SelectValueType
  /** Smaller grey text under the label, in the list only. Searchable lists match it too. */
  description?: string
  /** A Lucide (or any) icon component, shown before the label (and in the field once chosen). */
  icon?: Component
  disabled?: boolean
  /**
   * Nested options. Choosing this option opens them (with a back row to
   * return) instead of choosing it, e.g. Classes › Year 8 › 11Y/En2 › Ben.
   */
  children?: (SelectOption | string)[]
}

export interface SelectGroupOptions {
  /** Heading above the group's options. */
  label?: string
  /** A Lucide (or any) icon component, shown before the heading. */
  icon?: Component
  options: (SelectOption | string)[]
}

/**
 * Choose one option from a list that opens below the field, e.g. a year
 * group or a school. Looks like Input (same label, helper, status message and
 * box).
 *
 * - Default: built on Reka UI's Select. The field is a button; arrow keys,
 *   Home / End and typing the start of an option move through the list, Enter
 *   / Space choose, Escape closes.
 * - `searchable`: built on Reka UI's Combobox. The field is a text box;
 *   typing filters the options (anywhere in the label, ignoring case and
 *   accents), arrow keys move, Enter chooses. When it loses focus it shows
 *   the chosen option again.
 *
 * Options can be plain strings (label and value the same) or objects with a
 * label and, optionally, a description and an icon; they can be grouped under
 * headings, and nested (`children`): choosing an option with children opens
 * them, with a back row at the top. → / ← also go in and back. Searchable
 * lists search every level and show where each match is.
 *
 * Slots: leading (before the value, replacing the chosen option's icon).
 */
export interface SelectProps {
  /** Visible label. Always set it: it is also the field's accessible name. */
  label: string
  /** Options in a single list. Use `groups` for headings. */
  options?: (SelectOption | string)[]
  /** Groups of options, each with an optional heading. Shown after `options`. */
  groups?: SelectGroupOptions[]
  /** Type in the field to filter the options. Use for lists of more than about 10. */
  searchable?: boolean
  /**
   * Choose any number of options. v-model is then an array, the list stays
   * open while ticking, and the chosen options show as chips in the field
   * (with × to remove them when searchable).
   */
  multiple?: boolean
  /** Shown in the field when nothing is chosen. Default "Choose…", or "Search…" when searchable. */
  placeholder?: string
  /** Shown in the list when a search matches nothing. */
  emptyText?: string
  /** Extra guidance about what to choose. */
  helper?: string
  /** Show helper text under the label, or behind a `?` icon next to it. */
  helperPlacement?: 'below' | 'icon'
  /** Error message, e.g. from a Zod schema. Overrides `status` / `statusText`. */
  errorText?: string
  /** Colours the field and the status text. */
  status?: FormFieldStatus
  /** Message under the field. */
  statusText?: string
  /** Form field name: adds a hidden native field so the value is submitted with a form. */
  name?: string
  /** Must be chosen before a form can be submitted. */
  required?: boolean
  disabled?: boolean
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<SelectProps>(), {
  options: () => [],
  groups: () => [],
  emptyText: 'No matches',
  helperPlacement: 'below'
})

defineSlots<{
  leading?(): unknown
}>()

/** The chosen option's value, or undefined when nothing is chosen. */
const model = defineModel<SelectValueType | SelectValueType[] | undefined>()

// The chosen values as a list (empty, one, or several).
const values = computed<SelectValueType[]>(() =>
  Array.isArray(model.value) ? model.value : model.value === undefined ? [] : [model.value]
)

// Reka's Select treats an empty value as "nothing chosen" (shows the
// placeholder); Combobox takes undefined.
const rootValue = computed(() => {
  if (props.multiple) return values.value
  return props.searchable ? model.value : (model.value ?? '')
})
function setValue(next: unknown) {
  if (props.multiple) {
    model.value = Array.isArray(next) ? (next as SelectValueType[]) : []
    // Clear the search after each tick, ready for the next one. (Reka does
    // this for single choices only.) The input event updates Reka's own copy
    // of the search, so the list shows every option again.
    if (props.searchable && search.value) {
      search.value = ''
      nextTick(() => searchInput.value?.$el?.dispatchEvent(new Event('input', { bubbles: true })))
    }
    return
  }
  model.value = next === '' || next === null ? undefined : (next as SelectValueType)
  // Searchable: select the chosen label, so typing straight away replaces it
  // (as when the field is first focused) rather than adding to it.
  if (props.searchable) nextTick(() => searchInput.value?.$el?.select?.())
}

const placeholderText = computed(() => props.placeholder ?? (props.searchable ? 'Search…' : 'Choose…'))

const toOption = (option: SelectOption | string): SelectOption =>
  typeof option === 'string' ? { label: option, value: option } : { ...option, value: option.value ?? option.label }

interface Group {
  label?: string
  icon?: Component
  options: SelectOption[]
}

const allGroups = computed<Group[]>(() => [
  ...(props.options.length ? [{ options: props.options }] : []),
  ...props.groups
].map((group) => ({ label: group.label, icon: group.icon, options: group.options.map(toOption) })))

// ── Nesting ─────────────────────────────────────────────────────────────────
// Every choosable option (no children), with the parents above it. Options
// are matched by value, so one that appears in several places (a student in
// two classes) is chosen once: ticked wherever it appears, one chip.
interface Leaf {
  option: SelectOption
  path: SelectOption[]
}
function collectLeaves(options: SelectOption[], path: SelectOption[], into: Leaf[]) {
  for (const option of options) {
    if (option.children?.length) collectLeaves(option.children.map(toOption), [...path, option], into)
    else into.push({ option, path })
  }
  return into
}
const leaves = computed(() => allGroups.value.flatMap((group) => collectLeaves(group.options, [], [])))
const nested = computed(() => leaves.value.some((leaf) => leaf.path.length))

// The chosen option, for its icon and label in the field.
const selectedLeaf = computed(() =>
  props.multiple ? undefined : leaves.value.find((leaf) => leaf.option.value === model.value)
)
const selected = computed(() => selectedLeaf.value?.option)

// Multiple: the chosen options, in the order they were chosen.
const chosen = computed(() =>
  props.multiple
    ? values.value.flatMap((value) => leaves.value.find((leaf) => leaf.option.value === value)?.option ?? [])
    : []
)
function remove(value: SelectValueType) {
  model.value = values.value.filter((v) => v !== value)
}
// Searchable: Backspace in an empty search box removes the last chip.
function onSearchBackspace(event: KeyboardEvent) {
  if (!props.multiple || search.value || !values.value.length) return
  event.preventDefault()
  remove(values.value[values.value.length - 1]!)
}
const labelFor = (value: unknown) => leaves.value.find((leaf) => leaf.option.value === value)?.option.label ?? ''

// The parents opened so far; empty at the top level. Opening the list starts
// where the chosen option is, so people see it in place.
const trail = ref<SelectOption[]>([])
const current = computed(() => trail.value[trail.value.length - 1])

// Open or closed. Held here (not only in Reka) so a press anywhere in a
// searchable field can open it, not just on the text box itself.
const isOpen = ref(false)

function onOpenChange(open: boolean) {
  isOpen.value = open
  // Multiple choices can be on different levels, so those start at the top.
  if (open) trail.value = selectedLeaf.value ? [...selectedLeaf.value.path] : []
  // Closing hands focus back to the field. After the mouse (or touch), hide
  // the focus ring, as if the field had been clicked; after the keyboard,
  // keep it. Browsers can't tell, as Reka moves focus by script.
  else pointerFocus.value = usedPointer
}

// A text box always counts as focus-visible, so the ring would show while
// the list is open after a click, then fade when an option is chosen. Treat a
// click like the plain Select: no ring until a key is pressed.
function onSearchFocus(event: FocusEvent) {
  ;(event.target as HTMLInputElement).select()
  pointerFocus.value = usedPointer
}

// ── Focus ring after closing ────────────────────────────────────────────────
// Whether the mouse / touch or the keyboard was used last, anywhere on the
// page (the list is outside this component, in a portal).
let usedPointer = false
const pointerFocus = ref(false)
const onPointer = () => (usedPointer = true)
const onKey = () => {
  usedPointer = false
  pointerFocus.value = false
}
onMounted(() => {
  document.addEventListener('pointerdown', onPointer, true)
  document.addEventListener('keydown', onKey, true)
  // The chosen option and the back row are bold. Browsers only download a
  // font weight once something on the page uses it, and show a stand-in
  // until it arrives, so on a page with no other bold text the first option
  // chosen would visibly jump as the real bold swapped in. Load it now.
  document.fonts?.load(`700 1em ${getComputedStyle(document.body).fontFamily}`).catch(() => {})
})
onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onPointer, true)
  document.removeEventListener('keydown', onKey, true)
})

// Searchable: what has been typed. Group dividers are hidden while searching,
// as Reka hides groups with no matches and the lines would double up.
const search = ref('')
const searchInput = ref<{ $el?: HTMLInputElement }>()

// What the list shows: a row per option, grouped. Searching a nested list
// shows every matching option from every level, with its path.
interface Row {
  key: string
  option: SelectOption
  parent: boolean
  /** Where it is, e.g. "Classes › Year 8", when searching a nested list. */
  path?: string
}
const rowsFor = (options: SelectOption[], prefix: string): Row[] =>
  options.map((option, i) => {
    const parent = !!option.children?.length
    return { key: parent ? `${prefix}-parent-${i}` : `${prefix}-${String(option.value)}`, option, parent }
  })

const shownGroups = computed<(Omit<Group, 'options'> & { rows: Row[] })[]>(() => {
  if (props.searchable && search.value && nested.value) {
    // The same option can be in several places (a student in two classes).
    // It's one choice, so it's one row, listing every place it's in.
    const rows = new Map<SelectValueType, Row>()
    for (const leaf of leaves.value) {
      const path = leaf.path.map((parent) => parent.label).join(' › ')
      const row = rows.get(leaf.option.value!)
      if (row) row.path = [row.path, path].filter(Boolean).join(' · ') || undefined
      else rows.set(leaf.option.value!, { key: `leaf-${String(leaf.option.value)}`, option: leaf.option, parent: false, path: path || undefined })
    }
    return [{ rows: [...rows.values()] }]
  }
  if (current.value) {
    return [{ rows: rowsFor(current.value.children!.map(toOption), `level-${trail.value.length}`) }]
  }
  return allGroups.value.map((group, g) => ({ label: group.label, icon: group.icon, rows: rowsFor(group.options, `group-${g}`) }))
})

const showBack = computed(() => !!current.value && !(props.searchable && search.value))

// Parent rows and the back row are Reka items (so arrow keys and typing reach
// them), but they navigate instead of being chosen. These values are objects,
// so they can never match a real value.
const BACK = { back: true }
const navValue = (row: Row) => ({ parent: row.key })

const listId = `${useId()}-list`

// After moving between levels, put the highlight on the first option (not
// the back row, which is one ↑ away), so keyboard users carry on into it.
// Going back highlights the option just left instead.
async function focusRow(from?: SelectOption) {
  await nextTick()
  const list = document.querySelector<HTMLElement>(`[data-list-id="${listId}"]`)
  const fromKey = from && shownGroups.value.flatMap((group) => group.rows).find((row) => row.parent && row.option.label === from.label)?.key
  const first =
    (fromKey && list?.querySelector<HTMLElement>(`[data-parent-key="${fromKey}"]`)) ||
    list?.querySelector<HTMLElement>('[role="option"]:not([data-disabled]):not([data-back])') ||
    list?.querySelector<HTMLElement>('[role="option"][data-back]')
  if (!first) return
  if (props.searchable) first.dispatchEvent(new PointerEvent('pointermove', { bubbles: true }))
  else first.focus()
}

function openParent(event: Event, option: SelectOption) {
  event.preventDefault()
  trail.value = [...trail.value, option]
  focusRow()
}

function goBack(event?: Event) {
  event?.preventDefault()
  const from = current.value
  trail.value = trail.value.slice(0, -1)
  focusRow(from)
}

// → opens the highlighted parent, ← goes back a level. In a searchable list
// only while nothing is typed, so the arrows still move the text cursor.
function onListKeydown(event: KeyboardEvent) {
  // Reka can pass the listener on twice; handle each key press once.
  if (event.defaultPrevented || (props.searchable && search.value)) return
  if (event.key === 'ArrowLeft' && trail.value.length) {
    event.preventDefault()
    goBack()
  } else if (event.key === 'ArrowRight') {
    const list = document.querySelector<HTMLElement>(`[data-list-id="${listId}"]`)
    const highlighted = list?.querySelector<HTMLElement>('[data-highlighted][data-parent-key]')
    const row = highlighted && shownGroups.value.flatMap((group) => group.rows).find((r) => r.key === highlighted.dataset.parentKey)
    if (!row) return
    event.preventDefault()
    openParent(event, row.option)
  }
}

// The list is the same for both; only Reka's parts differ.
const parts = computed(() =>
  props.searchable
    ? {
        Root: ComboboxRoot,
        Portal: ComboboxPortal,
        Content: ComboboxContent,
        Viewport: ComboboxViewport,
        Group: ComboboxGroup,
        Label: ComboboxLabel,
        Separator: ComboboxSeparator,
        Item: ComboboxItem,
        ItemText: 'span',
        Indicator: ComboboxItemIndicator
      }
    : {
        Root: SelectRoot,
        Portal: SelectPortal,
        Content: SelectContent,
        Viewport: SelectViewport,
        Group: SelectGroup,
        Label: SelectLabel,
        Separator: SelectSeparator,
        Item: SelectItem,
        ItemText: SelectItemText,
        Indicator: SelectItemIndicator
      }
)

// The trigger (or the search box's anchor) fills FormField's box: negative
// margins cancel its padding, so the whole box opens the list. The box draws
// the border and focus ring.
const fill = '-mx-3 -my-2 flex min-w-0 flex-1 items-center gap-2 self-stretch px-3 py-2'

// The list is at least as wide as the field and no taller than the space
// below / above it; it scrolls inside.
const content = computed(() => cn(
  popoverContent,
  'overflow-hidden',
  props.searchable
    ? 'max-h-(--reka-combobox-content-available-height) min-w-(--reka-combobox-trigger-width) max-w-[max(var(--reka-combobox-trigger-width),--spacing(80))]'
    : 'max-h-(--reka-select-content-available-height) min-w-(--reka-select-trigger-width) max-w-[max(var(--reka-select-trigger-width),--spacing(80))]'
))

// Compact rows: 32px tall with a label only (6px + 20px line + 6px), 8px
// either side, tinted like a ghost Button. A description adds lines below;
// the icon and tick stay level with the label (h-5 slots, top-aligned).
const item = [
  'relative flex min-h-8 cursor-pointer items-start gap-2 rounded px-2 py-1.5 text-sm outline-none select-none',
  'data-highlighted:bg-black/10',
  'data-disabled:cursor-not-allowed data-disabled:opacity-40'
]

// Searchable lists filter on this: the label, description and path.
const searchText = (row: Row) =>
  props.searchable ? [row.option.label, row.option.description, row.path].filter(Boolean).join(' ') : row.option.label

// Turns over while the list is open.
const chevron = 'transition-transform duration-150 in-data-[state=open]:rotate-180 motion-reduce:transition-none'
</script>

<template>
  <FormField
    :label="label"
    :helper="helper"
    :helper-placement="helperPlacement"
    :error-text="errorText"
    :status="status"
    :status-text="statusText"
    :disabled="disabled"
    :class="props.class"
  >
    <template #default="{ id, describedBy, invalid }">
      <component
        :is="parts.Root"
        :model-value="rootValue"
        :name="name"
        :required="required"
        :disabled="disabled"
        :multiple="multiple"
        v-bind="searchable ? { openOnClick: true, class: 'contents' } : {}"
        @update:model-value="setValue"
        :open="isOpen"
        @update:open="onOpenChange"
      >
        <!-- Searchable: a text box that filters the list. (Combobox's root
             renders a <div>; `contents` above keeps this anchor a direct
             flex child of the box, so it fills it.) -->
        <!-- A press anywhere in the field opens the list: the padding, beside
             the chips, or on the text box (Reka itself only opens for the
             text box). Not on a chip's ×, which removes it instead. -->
        <ComboboxAnchor
          v-if="searchable"
          :class="fill"
          @pointerdown="pointerFocus = true"
          @click="!disabled && !($event.target as Element).closest('button') && onOpenChange(true)"
        >
          <slot name="leading">
            <component :is="selected.icon" v-if="selected?.icon" aria-hidden="true" />
          </slot>
          <!-- Multiple: a chip per chosen option, then the search box, wrapping
               onto more lines as needed. × removes one (mouse); keyboard users
               press Backspace in the empty box, or untick it in the list. -->
          <span :class="multiple ? 'flex min-w-0 flex-1 flex-wrap items-center gap-1' : 'contents'">
            <!-- pointerdown.stop keeps a press on × from opening the list. -->
            <Chip
              v-for="option in chosen"
              :key="String(option.value)"
              size="sm"
              removable
              :remove-label="`Remove ${option.label}`"
              :remove-focusable="false"
              :disabled="disabled"
              @pointerdown.stop
              @remove="remove(option.value!)"
            >
              <template v-if="option.icon" #leading><component :is="option.icon" aria-hidden="true" /></template>
              {{ option.label }}
            </Chip>
            <ComboboxInput
              :id="id"
              ref="searchInput"
              v-model="search"
              :display-value="multiple ? () => '' : labelFor"
              :placeholder="multiple && chosen.length ? '' : placeholderText"
              :aria-invalid="invalid"
              :aria-describedby="describedBy"
              autocomplete="off"
              :class="cn('h-5 min-w-0 flex-1 bg-transparent outline-none placeholder:text-black/55 disabled:cursor-not-allowed', multiple && 'min-w-16')"
              :data-pointer-focus="pointerFocus || undefined"
              @focus="onSearchFocus"
              @blur="pointerFocus = false"
              @keydown="($event.target as HTMLElement).ariaExpanded === 'true' && onListKeydown($event)"
              @keydown.backspace="onSearchBackspace"
            />
          </span>
          <ComboboxTrigger tabindex="-1" aria-label="Show options" class="flex cursor-pointer disabled:cursor-not-allowed">
            <ChevronDown aria-hidden="true" :class="chevron" />
          </ComboboxTrigger>
        </ComboboxAnchor>

        <!-- Default: a button showing the chosen option. -->
        <SelectTrigger
          v-else
          :id="id"
          :aria-invalid="invalid"
          :aria-describedby="describedBy"
          :data-pointer-focus="pointerFocus || undefined"
          @blur="pointerFocus = false"
          :class="cn(fill, 'cursor-pointer text-left outline-none disabled:cursor-not-allowed data-placeholder:text-black/55')"
        >
          <slot name="leading">
            <component :is="selected.icon" v-if="selected?.icon" aria-hidden="true" />
          </slot>
          <!-- The chosen label, from the options themselves rather than Reka's
               SelectValue, which only knows the options currently showing (a
               nested choice isn't, once the list is back at the top). -->
          <!-- Multiple: a chip per chosen option, wrapping onto more lines. -->
          <span v-if="multiple && chosen.length" class="flex min-w-0 flex-1 flex-wrap gap-1">
            <Chip v-for="option in chosen" :key="String(option.value)" size="sm">
              <template v-if="option.icon" #leading><component :is="option.icon" aria-hidden="true" /></template>
              {{ option.label }}
            </Chip>
          </span>
          <span v-else class="h-5 min-w-0 flex-1 truncate">{{ selected?.label ?? placeholderText }}</span>
          <ChevronDown aria-hidden="true" :class="chevron" />
        </SelectTrigger>

        <component :is="parts.Portal">
          <component
            :is="parts.Content"
            position="popper"
            :side-offset="6"
            :class="content"
            :data-list-id="listId"
            @keydown="!searchable && onListKeydown($event)"
            @mousedown="searchable && $event.preventDefault()"
          >
            <!-- Searchable: pressing in the list mustn't take focus from the
                 search box (the pressed option goes away as the list closes,
                 which would leave focus nowhere). -->
            <!-- Reka hides the scrollbar (its own injected style); show a thin
                 one so long lists look scrollable. -->
            <component
              :is="parts.Viewport"
              class="flex flex-col gap-0.5 p-1 [scrollbar-width:thin]! [&::-webkit-scrollbar]:block!"
            >
              <ComboboxEmpty v-if="searchable" class="px-2 py-1.5 text-sm text-black/65">
                {{ emptyText }}
              </ComboboxEmpty>

              <!-- Inside a nested option: back to the level above. -->
              <template v-if="showBack">
                <component
                  :is="parts.Item"
                  :value="BACK"
                  data-back
                  :text-value="current!.label"
                  :class="cn(item, 'font-bold')"
                  @select="goBack"
                >
                  <span class="flex h-5 shrink-0 items-center">
                    <ChevronLeft aria-hidden="true" class="size-4" />
                  </span>
                  <!-- Names the level being shown; pressing it goes up one. -->
                  <span class="min-w-0 flex-1 truncate"><span class="sr-only">Back from </span>{{ current!.label }}</span>
                </component>
                <component :is="parts.Separator" class="-mx-1 my-0.5 border-t border-black/15" />
              </template>

              <template v-for="(group, g) in shownGroups" :key="g">
                <component
                  :is="parts.Separator"
                  v-if="g > 0 && !search"
                  class="-mx-1 my-0.5 border-t border-black/15"
                />
                <component :is="parts.Group" class="flex flex-col gap-0.5">
                  <component
                    :is="parts.Label"
                    v-if="group.label"
                    class="flex h-6 items-center gap-1.5 px-2 text-xs font-bold text-black/65 uppercase"
                  >
                    <component :is="group.icon" v-if="group.icon" aria-hidden="true" class="size-3.5 shrink-0" />
                    <span class="truncate">{{ group.label }}</span>
                  </component>
                  <component
                    :is="parts.Item"
                    v-for="row in group.rows"
                    :key="row.key"
                    :value="row.parent ? navValue(row) : row.option.value!"
                    :disabled="row.option.disabled"
                    :text-value="searchText(row)"
                    :data-parent-key="row.parent ? row.key : undefined"
                    :class="item"
                    @select="row.parent && openParent($event, row.option)"
                  >
                    <!-- No empty space for options without an icon: an indent
                         reads as nesting. Give every option an icon, or none. -->
                    <span v-if="row.option.icon" class="flex h-5 shrink-0 items-center">
                      <component :is="row.option.icon" aria-hidden="true" class="size-4 opacity-70" />
                    </span>
                    <span class="flex min-w-0 flex-1 flex-col">
                      <component :is="parts.ItemText" class="truncate in-data-[state=checked]:font-bold">
                        {{ row.option.label }}<span v-if="row.parent" class="sr-only">, more options</span>
                      </component>
                      <span v-if="row.path" class="text-xs text-black/65">{{ row.path }}</span>
                      <span v-if="row.option.description" class="text-xs text-black/65">{{ row.option.description }}</span>
                    </span>
                    <!-- Parents: an arrow into their options. Others: the tick's
                         space, reserved on every row so labels don't shift. -->
                    <span class="flex h-5 w-4 shrink-0 items-center justify-center">
                      <ChevronRight v-if="row.parent" aria-hidden="true" class="size-4 opacity-70" />
                      <component :is="parts.Indicator" v-else><Check class="size-4" /></component>
                    </span>
                  </component>
                </component>
              </template>
            </component>
          </component>
        </component>
      </component>
    </template>
  </FormField>
</template>
