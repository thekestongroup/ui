import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { ref } from "vue";
import FormField from "./FormField.vue";

const meta = {
  title: "Components/Form/FormField",
  component: FormField,
  tags: ["autodocs"],
  argTypes: {
    helperPlacement: { options: ["below", "icon"], control: { type: "inline-radio" } },
    status: { options: [undefined, "error", "success", "loading"], control: { type: "inline-radio" } },
  },
  args: {
    label: "Notes",
    helper: "Seen by staff only, not by parents.",
    helperPlacement: "below",
    disabled: false,
  },
  decorators: [() => ({ template: '<div class="max-w-80"><story /></div>' })],
  render: (args) => ({
    components: { FormField },
    setup: () => ({ args, value: ref("") }),
    // A control the library doesn't have yet: a native <textarea>. The slot
    // gives it the id and ARIA values; FormField does the rest.
    template: `
      <FormField v-bind="args">
        <template #default="{ id, describedBy, invalid }">
          <textarea
            :id="id"
            v-model="value"
            rows="3"
            :disabled="args.disabled"
            :aria-invalid="invalid"
            :aria-describedby="describedBy"
            class="min-h-5 min-w-0 flex-1 resize-y bg-transparent outline-none placeholder:text-black/55 disabled:cursor-not-allowed"
          />
        </template>
      </FormField>`,
  }),
} satisfies Meta<typeof FormField>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The shell Input, InputNumber, InputDate and Select are built on. Use it
 * for a text control the library doesn't have, so it matches them.
 */
export const Default: Story = {};

export const WithErrorText: Story = { args: { errorText: "Add a note before saving" } };

export const Loading: Story = { args: { status: "loading", statusText: "Saving…" } };

export const Disabled: Story = { args: { disabled: true } };
