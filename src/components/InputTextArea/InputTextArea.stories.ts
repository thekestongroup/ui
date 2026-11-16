import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { ref } from "vue";
import InputTextArea from "./InputTextArea.vue";

const meta = {
  title: "Components/Form/InputTextArea",
  component: InputTextArea,
  tags: ["autodocs"],
  argTypes: {
    helperPlacement: { options: ["below", "icon"], control: { type: "inline-radio" } },
    status: { options: [undefined, "error", "success", "loading"], control: { type: "inline-radio" } },
  },
  args: {
    label: "Redirect addresses",
    helper: "One address per line.",
    helperPlacement: "below",
    placeholder: "https://example.com/callback",
    disabled: false,
  },
  decorators: [() => ({ template: '<div class="max-w-120"><story /></div>' })],
  render: (args) => ({
    components: { InputTextArea },
    setup: () => ({ args, value: ref("") }),
    template: '<InputTextArea v-bind="args" v-model="value" />',
  }),
} satisfies Meta<typeof InputTextArea>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Four lines tall to start with; it grows with the text up to 15 lines, then scrolls. */
export const Default: Story = {};

export const WithText: Story = {
  render: (args) => ({
    components: { InputTextArea },
    setup: () => ({ args, value: ref("https://app.keston.co/callback\nhttps://staging.keston.co/callback") }),
    template: '<InputTextArea v-bind="args" v-model="value" />',
  }),
};

/** Too long shows as soon as the text passes `maxLength`. */
export const MaxLength: Story = {
  args: { label: "Reason", helper: "", maxLength: 40, placeholder: "" },
  render: (args) => ({
    components: { InputTextArea },
    setup: () => ({ args, value: ref("This reason is much longer than forty characters.") }),
    template: '<InputTextArea v-bind="args" v-model="value" />',
  }),
};

export const WithError: Story = { args: { errorText: "Enter at least one address" } };
export const Disabled: Story = { args: { disabled: true } };
