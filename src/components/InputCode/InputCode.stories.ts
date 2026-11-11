import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { ref } from "vue";
import InputCode, { type InputCodeProps } from "./InputCode.vue";

const meta = {
  title: "Components/Form/InputCode",
  component: InputCode,
  tags: ["autodocs"],
  argTypes: {
    length: { control: { type: "number", min: 4, max: 8 } },
    helperPlacement: { options: ["below", "icon"], control: { type: "inline-radio" } },
    status: { options: [undefined, "error", "success", "loading"], control: { type: "inline-radio" } },
  },
  args: {
    label: "Code from your authenticator app",
    helper: "",
    helperPlacement: "below",
    length: 6,
    alphanumeric: false,
    disabled: false,
  },
  render: (args) => ({
    components: { InputCode },
    setup: () => ({ args, value: ref("") }),
    template: `<InputCode v-bind="args" v-model="value" />`,
  }),
} satisfies Meta<InputCodeProps>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Playground: type a code, or paste one (e.g. 042317) to fill every box. */
export const Default: Story = {};

export const EmailCode: Story = {
  args: {
    label: "Code from your email",
    helper: "We sent a 6-digit code to b•••@keston.school. It expires in 10 minutes.",
  },
};

/** Letters and digits, upper-cased as they're typed, e.g. a backup code. */
export const Alphanumeric: Story = {
  args: { label: "Backup code", length: 8, alphanumeric: true },
};

export const WithErrorText: Story = {
  args: { errorText: "That code didn't work. Check it and try again." },
};

export const Disabled: Story = { args: { disabled: true } };

/**
 * Checked as soon as the last box is filled, using `@complete`. Try 123456
 * for a code that works; anything else fails.
 */
export const CheckOnComplete: Story = {
  render: (args) => ({
    components: { InputCode },
    setup() {
      const value = ref("");
      const status = ref<InputCodeProps["status"]>();
      const statusText = ref<string>();
      async function check(code: string) {
        status.value = "loading";
        statusText.value = "Checking code…";
        await new Promise((resolve) => setTimeout(resolve, 900));
        const ok = code === "123456";
        status.value = ok ? "success" : "error";
        statusText.value = ok ? "Code accepted" : "That code didn't work. Check it and try again.";
        if (!ok) value.value = "";
      }
      return { args, value, status, statusText, check };
    },
    template: `
      <InputCode
        v-bind="args"
        v-model="value"
        :status="status"
        :status-text="statusText"
        :disabled="status === 'loading'"
        @complete="check"
      />`,
  }),
};
