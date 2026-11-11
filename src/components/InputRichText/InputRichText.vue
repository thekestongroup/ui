<script setup lang="ts">
import { defineComponent, onBeforeUnmount, ref, watch, watchEffect, type HTMLAttributes, type PropType } from 'vue'
import { EditorContent, useEditor } from '@tiptap/vue-3'
import type { Editor } from '@tiptap/core'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import HardBreak from '@tiptap/extension-hard-break'
import Bold from '@tiptap/extension-bold'
import Italic from '@tiptap/extension-italic'
import Underline from '@tiptap/extension-underline'
import { Placeholder, UndoRedo } from '@tiptap/extensions'
import { Bold as BoldIcon, Italic as ItalicIcon, Underline as UnderlineIcon } from '@lucide/vue'
import { cn } from '../../lib/cn'
import FormField, { type FormFieldStatus } from '../FormField/FormField.vue'
import Button from '../Button/Button.vue'
import Tooltip from '../Tooltip/Tooltip.vue'

/**
 * Several lines of text with bold, italic and underline, e.g. notes on a
 * student or an application. Only those three: no headings, lists, links or
 * colours, so notes look the same everywhere. Pasted text keeps its bold,
 * italic and underline and loses everything else.
 *
 * The value is HTML using only <p>, <br>, <strong>, <em> and <u>. Sanitise
 * it on the server like any HTML from a browser before showing it elsewhere.
 */
export interface InputRichTextProps {
  /** Visible label. Always set it: it is also the editor's accessible name. */
  label: string
  /** Extra guidance about what to write. */
  helper?: string
  /** Show helper text under the label, or behind a `?` icon next to it. */
  helperPlacement?: 'below' | 'icon'
  /** Error message, e.g. from a Zod schema. Overrides `status` / `statusText`. */
  errorText?: string
  /** Colours the field and the status text, e.g. 'loading' while it saves. */
  status?: FormFieldStatus
  /** Message under the field. */
  statusText?: string
  /** Shown in the empty editor, e.g. "Add a note…". */
  placeholder?: string
  disabled?: boolean
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<InputRichTextProps>(), {
  helperPlacement: 'below'
})

/** The text as HTML; an empty string when there's nothing in it. */
const model = defineModel<string>({ default: '' })

// An empty editor still holds an empty paragraph; report that as ''.
const html = () => (editor.value?.isEmpty ? '' : (editor.value?.getHTML() ?? ''))

const editor = useEditor({
  content: model.value,
  editable: !props.disabled,
  extensions: [
    Document,
    Paragraph,
    Text,
    HardBreak,
    Bold,
    Italic,
    Underline,
    UndoRedo,
    Placeholder.configure({ placeholder: () => props.placeholder ?? '' })
  ],
  onUpdate: () => {
    model.value = html()
  },
  // Every change, including moving the cursor, updates the toolbar.
  onCreate: ({ editor }) => updateActive(editor),
  onTransaction: ({ editor }) => updateActive(editor)
})

// Which formats are on at the cursor (or for the next text typed), for the
// toolbar's pressed state. Tiptap's isActive() isn't reactive by itself.
type Mark = 'bold' | 'italic' | 'underline'
const active = ref<Record<Mark, boolean>>({ bold: false, italic: false, underline: false })
function updateActive(e: Editor) {
  active.value = { bold: e.isActive('bold'), italic: e.isActive('italic'), underline: e.isActive('underline') }
}

// A value set from outside (e.g. a form reset) replaces the text; the
// editor's own updates come back unchanged and are skipped.
watch(model, (value) => {
  if (editor.value && value !== html()) editor.value.commands.setContent(value, { emitUpdate: false })
})

watch(
  () => props.disabled,
  (disabled) => editor.value?.setEditable(!disabled)
)

onBeforeUnmount(() => editor.value?.destroy())

// The editable area gets the id and ARIA values FormField hands out. It's a
// contenteditable <div>, so it needs the textbox role and the label by id.
// A render-less child, so the values (only known inside FormField's slot)
// are applied in a watcher rather than while rendering.
type FieldIds = { id: string; labelId: string; describedBy?: string; invalid?: true }
const EditorAttributes = defineComponent({
  props: { ids: { type: Object as PropType<FieldIds>, required: true } },
  setup(attrs) {
    watchEffect(() => {
      const { id, labelId, describedBy, invalid } = attrs.ids
      editor.value?.setOptions({
        editorProps: {
          attributes: {
            id,
            role: 'textbox',
            'aria-multiline': 'true',
            'aria-labelledby': labelId,
            ...(describedBy ? { 'aria-describedby': describedBy } : {}),
            ...(invalid ? { 'aria-invalid': 'true' } : {}),
            class: editable
          }
        }
      })
    })
    return () => null
  }
})

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)
const mod = isMac ? '⌘' : 'Ctrl+'

const marks = [
  { name: 'bold', label: 'Bold', icon: BoldIcon, key: 'B', toggle: () => editor.value?.chain().focus().toggleBold().run() },
  { name: 'italic', label: 'Italic', icon: ItalicIcon, key: 'I', toggle: () => editor.value?.chain().focus().toggleItalic().run() },
  { name: 'underline', label: 'Underline', icon: UnderlineIcon, key: 'U', toggle: () => editor.value?.chain().focus().toggleUnderline().run() }
] as const

// The text area: at least 4 lines, then it grows to 15 lines and scrolls.
// Paragraphs are 8px apart. The placeholder is drawn by Tiptap's Placeholder
// extension on the first empty paragraph.
const editable = [
  // 16px on touch screens, so iPhone doesn't zoom in when it's tapped.
  'min-h-24 max-h-80 overflow-y-auto px-3 py-2 text-sm pointer-coarse:text-base outline-none cursor-text',
  '[&_p+p]:mt-2',
  '[&_p.is-editor-empty:first-child]:before:pointer-events-none [&_p.is-editor-empty:first-child]:before:float-left',
  '[&_p.is-editor-empty:first-child]:before:h-0 [&_p.is-editor-empty:first-child]:before:text-black/55',
  '[&_p.is-editor-empty:first-child]:before:content-[attr(data-placeholder)]'
].join(' ')
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
    <template #default="slot">
      <!-- Fills FormField's box: negative margins cancel its padding, so the
           toolbar's line and the text area run to the edges. -->
      <div class="-mx-3 -my-2 flex min-w-0 flex-1 flex-col self-stretch">
        <!-- Pressing a button keeps focus (and the selection) in the text. -->
        <div
          role="toolbar"
          :aria-label="`Formatting for ${label}`"
          :aria-controls="slot.id"
          class="flex items-center gap-0.5 border-b border-black/15 px-1.5 py-1 [&_svg]:opacity-100!"
          @mousedown.prevent
        >
          <Tooltip v-for="mark in marks" :key="mark.name" :text="`${mark.label} (${mod}${mark.key})`" :disabled="disabled">
            <Button
              variant="ghost"
              size="sm"
              square
              :aria-label="mark.label"
              :aria-pressed="active[mark.name]"
              :aria-keyshortcuts="`${isMac ? 'Meta' : 'Control'}+${mark.key}`"
              :disabled="disabled"
              class="aria-pressed:bg-black/15"
              @click="mark.toggle()"
            >
              <component :is="mark.icon" />
            </Button>
          </Tooltip>
        </div>
        <EditorAttributes :ids="slot" />
        <EditorContent :editor="editor" :class="cn('min-w-0', disabled && 'cursor-not-allowed [&_*]:cursor-not-allowed')" />
      </div>
    </template>
  </FormField>
</template>
