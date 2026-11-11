import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { Lock } from "@lucide/vue";
import { ref } from "vue";
import Button from "../Button/Button.vue";
import Input from "../Input/Input.vue";
import InputPassword, { type InputPasswordProps } from "./InputPassword.vue";

// Story-only controls on top of the real props.
type InputPasswordStoryArgs = InputPasswordProps & {
  placeholder: string;
  autocomplete: "current-password" | "new-password";
};

const meta = {
  title: "Components/Form/InputPassword",
  component: InputPassword,
  tags: ["autodocs"],
  argTypes: {
    placeholder: { control: "text", table: { category: "Content" } },
    autocomplete: {
      options: ["current-password", "new-password"],
      control: { type: "inline-radio" },
      table: { category: "Attributes" },
    },
    helperPlacement: { options: ["below", "icon"], control: { type: "inline-radio" } },
    status: { options: [undefined, "error", "success", "loading"], control: { type: "inline-radio" } },
  },
  args: {
    label: "Password",
    placeholder: "",
    helper: "",
    helperPlacement: "below",
    autocomplete: "current-password",
    disabled: false,
  },
  decorators: [() => ({ template: '<div class="max-w-80"><story /></div>' })],
  render: (args) => ({
    components: { InputPassword },
    setup: () => ({ args, value: ref("") }),
    template: `<InputPassword v-bind="args" v-model="value" />`,
  }),
} satisfies Meta<InputPasswordStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Playground: type, then press the eye to show or hide the password. Turn Caps Lock on to see the note. */
export const Default: Story = {};

/** Choosing a password: `autocomplete="new-password"` lets password managers suggest and save one. */
export const NewPassword: Story = {
  args: {
    label: "New password",
    helper: "At least 12 characters. A few unrelated words works well.",
    autocomplete: "new-password",
  },
};

export const WithLeadingIcon: Story = {
  render: (args) => ({
    components: { InputPassword, Lock },
    setup: () => ({ args, value: ref("") }),
    template: `
      <InputPassword v-bind="args" v-model="value">
        <template #leading><Lock /></template>
      </InputPassword>`,
  }),
};

/** `errorText`, e.g. after a failed sign-in. It replaces the Caps Lock note. */
export const WithErrorText: Story = {
  args: { errorText: "Incorrect password" },
};

export const Disabled: Story = { args: { disabled: true } };

/**
 * A sign-in form. Show the password, then press Sign in: it's hidden again
 * when the form is submitted.
 */
export const SignInForm: Story = {
  render: () => ({
    components: { InputPassword, Input, Button },
    setup() {
      const email = ref("");
      const password = ref("");
      const error = ref<string>();
      const submitting = ref(false);
      async function signIn() {
        error.value = undefined;
        submitting.value = true;
        await new Promise((resolve) => setTimeout(resolve, 800));
        submitting.value = false;
        if (password.value !== "correct horse") error.value = "Incorrect email or password";
      }
      return { email, password, error, submitting, signIn };
    },
    template: `
      <form class="flex flex-col gap-4" @submit.prevent="signIn">
        <Input v-model="email" label="Email" type="email" autocomplete="username" />
        <InputPassword v-model="password" label="Password" :error-text="error" />
        <Button type="submit" variant="primary" :status="submitting ? 'loading' : 'idle'" loading-text="Signing in">Sign in</Button>
      </form>`,
  }),
};
