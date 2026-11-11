import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { ref, watch } from "vue";
import InputRichText, { type InputRichTextProps } from "./InputRichText.vue";

const meta = {
  title: "Components/Form/InputRichText",
  component: InputRichText,
  tags: ["autodocs"],
  argTypes: {
    helperPlacement: { options: ["below", "icon"], control: { type: "inline-radio" } },
    status: { options: [undefined, "error", "success", "loading"], control: { type: "inline-radio" } },
  },
  args: {
    label: "Notes",
    placeholder: "Add a note…",
    helper: "",
    helperPlacement: "below",
    disabled: false,
  },
  decorators: [() => ({ template: '<div class="max-w-120"><story /></div>' })],
  render: (args) => ({
    components: { InputRichText },
    setup: () => ({ args, value: ref("") }),
    template: `
      <InputRichText v-bind="args" v-model="value" />
      <pre class="mt-4 text-xs whitespace-pre-wrap text-black/65">{{ value || '(empty)' }}</pre>`,
  }),
} satisfies Meta<typeof InputRichText>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Playground. Select text and press **B**, *I* or U, or use ⌘B / ⌘I / ⌘U
 * (Ctrl on Windows). The HTML it produces shows underneath.
 */
export const Default: Story = {};

export const WithText: Story = {
  args: { label: "Notes on Ada Okafor" },
  render: (args) => ({
    components: { InputRichText },
    setup: () => ({
      args,
      value: ref(
        "<p>Settled in well. <strong>Allergic to nuts</strong>: kitchen told on 2 September.</p><p>Mum prefers calls after 3pm; <em>not</em> on Fridays. <u>Check the medical form is signed</u> before the trip.</p>",
      ),
    }),
    template: '<InputRichText v-bind="args" v-model="value" />',
  }),
};

export const HelperBehindIcon: Story = {
  args: { helper: "Seen by staff only, not by parents.", helperPlacement: "icon" },
};

/** Long notes grow the field to 15 lines, then it scrolls. */
export const LongNotes: Story = {
  render: (args) => ({
    components: { InputRichText },
    setup: () => ({
      args,
      value: ref(
        Array.from({ length: 12 }, (_, i) => `<p>Week ${i + 1}: attended every session, homework handed in.</p>`).join(""),
      ),
    }),
    template: '<InputRichText v-bind="args" v-model="value" />',
  }),
};

/**
 * Saving as you type: "Saving…" while the note saves (faked here with a
 * delay after typing pauses), then "Saved".
 */
export const AutoSave: Story = {
  render: (args) => ({
    components: { InputRichText },
    setup() {
      const value = ref("");
      const status = ref<InputRichTextProps["status"]>();
      const statusText = ref<string>();
      let timer: ReturnType<typeof setTimeout> | undefined;
      watch(value, () => {
        clearTimeout(timer);
        status.value = "loading";
        statusText.value = "Saving…";
        timer = setTimeout(() => {
          status.value = "success";
          statusText.value = "Saved";
        }, 1000);
      });
      return { args, value, status, statusText };
    },
    template: '<InputRichText v-bind="args" v-model="value" :status="status" :status-text="statusText" />',
  }),
};

export const WithErrorText: Story = { args: { errorText: "Add a note before saving" } };

export const Disabled: Story = { args: { disabled: true } };
