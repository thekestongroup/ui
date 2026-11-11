import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { AtSign, Lock, Mail, Search, User, X } from "@lucide/vue";
import { computed, ref } from "vue";
import Button from "../Button/Button.vue";
import Input, { type InputProps } from "./Input.vue";

// Icons offered in the Controls panel. Add any Lucide icon here.
const icons = { None: null, Search, User, Mail, AtSign, Lock, X };
type IconName = keyof typeof icons;

// Story-only controls on top of the real props.
type InputStoryArgs = InputProps & {
  placeholder: string;
  leadingIcon: IconName;
  trailingIcon: IconName;
};

const iconControl = {
  options: Object.keys(icons),
  control: { type: "select" },
  table: { category: "Content" },
} as const;

// Splits the story-only args from the real props and resolves the icons.
function useStoryInput(args: InputStoryArgs) {
  const inputProps = computed(() => {
    const { leadingIcon: _leading, trailingIcon: _trailing, ...rest } = args;
    return rest;
  });
  const leading = computed(() => icons[args.leadingIcon]);
  const trailing = computed(() => icons[args.trailingIcon]);
  const value = ref("");
  return { args, inputProps, leading, trailing, value };
}

const inputTemplate = `
  <Input v-bind="inputProps" v-model="value">
    <template v-if="leading" #leading><component :is="leading" /></template>
    <template v-if="trailing" #trailing><component :is="trailing" /></template>
  </Input>`;

const meta = {
  title: "Components/Input",
  component: Input,
  tags: ["autodocs"],
  argTypes: {
    placeholder: { control: "text", table: { category: "Content" } },
    leadingIcon: iconControl,
    trailingIcon: iconControl,
    helperPlacement: { options: ["below", "icon"], control: { type: "inline-radio" } },
    status: { options: [undefined, "error", "success"], control: { type: "inline-radio" } },
  },
  args: {
    label: "First name",
    placeholder: "",
    helper: "",
    helperPlacement: "below",
    leadingIcon: "None",
    trailingIcon: "None",
    disabled: false,
  },
  decorators: [() => ({ template: '<div class="max-w-80"><story /></div>' })],
  render: (args) => ({
    components: { Input },
    setup: () => useStoryInput(args),
    template: inputTemplate,
  }),
} satisfies Meta<InputStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Playground: use the controls below. */
export const Default: Story = {};

export const HelperBelowLabel: Story = {
  args: {
    label: "Student ID",
    helper: "Found on the student's enrolment letter, e.g. KS-20491.",
  },
};

export const HelperBehindIcon: Story = {
  args: {
    label: "Student ID",
    helper: "Found on the student's enrolment letter, e.g. KS-20491.",
    helperPlacement: "icon",
  },
};

/** Type fewer than 3 characters and leave the field, or more than 20. */
export const LengthCheck: Story = {
  args: { label: "Username", minLength: 3, maxLength: 20, leadingIcon: "AtSign" },
};

export const WithIcons: Story = {
  args: { label: "Search students", placeholder: "Name or ID", leadingIcon: "Search" },
};

/** `errorText` alone puts the field in its error state. */
export const WithErrorText: Story = {
  args: { label: "Email", errorText: "Enter a valid email address", leadingIcon: "Mail" },
};

/**
 * How a schema (Zod, VeeValidate…) drives the Input: the form validates and
 * passes the message, or `undefined` when valid, to `errorText`. Checked when
 * you leave the field, then again as you type once an error is showing.
 * In an app this would be e.g. `:error-text="errors.email"` from VeeValidate.
 */
export const SchemaValidation: Story = {
  args: { label: "Email", placeholder: "name@school.org", leadingIcon: "Mail" },
  render: (args) => ({
    components: { Input },
    setup() {
      const story = useStoryInput(args);
      const error = ref<string>();
      // Stand-in for z.string().min(1, …).email(…)
      const validate = (value: string) =>
        !value ? "Enter an email address"
        : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "Enter a valid email address"
        : undefined;
      const onBlur = () => (error.value = validate(story.value.value));
      const onInput = () => { if (error.value) error.value = validate(story.value.value); };
      return { ...story, error, onBlur, onInput };
    },
    template: `
      <Input v-bind="inputProps" v-model="value" :error-text="error" @blur="onBlur" @input="onInput">
        <template v-if="leading" #leading><component :is="leading" /></template>
      </Input>`,
  }),
};

export const ErrorStatus: Story = {
  args: { label: "Email", status: "error", statusText: "Enter a valid email address", leadingIcon: "Mail" },
};

export const SuccessStatus: Story = {
  args: { label: "Username", status: "success", statusText: "Username is available", leadingIcon: "AtSign" },
};

export const Disabled: Story = { args: { disabled: true, placeholder: "Not editable" } };

/** Lined up with a medium basic Button to compare height, border and padding. */
export const NextToButton: Story = {
  args: { label: "Search students", placeholder: "Name or ID", leadingIcon: "Search" },
  decorators: [() => ({ template: '<div class="max-w-120"><story /></div>' })],
  render: (args) => ({
    components: { Input, Button },
    setup: () => useStoryInput(args),
    template: `
      <div class="flex items-end gap-2">
        <div class="flex-1">${inputTemplate}</div>
        <Button><template #leading><component :is="leading" /></template>Search</Button>
      </div>`,
  }),
};
