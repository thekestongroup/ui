import type { Meta, StoryObj } from "@storybook/vue3-vite";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Copy,
  Download,
  Pencil,
  Plus,
  RotateCcw,
  Save,
  Search,
  Star,
  Trash2,
  X,
} from "@lucide/vue";
import { computed, ref } from "vue";
import Button, { type ButtonProps, type ButtonStatus } from "./Button.vue";

// Icons offered in the Controls panel. Add any Lucide icon here.
const icons = {
  None: null,
  Star,
  Plus,
  Check,
  X,
  Pencil,
  Trash2,
  Copy,
  Save,
  Download,
  Search,
  RotateCcw,
  ArrowLeft,
  ArrowRight,
  ChevronDown,
};
type IconName = keyof typeof icons;

// Story-only controls on top of the real props.
type ButtonStoryArgs = ButtonProps & {
  label: string;
  leadingIcon: IconName;
  trailingIcon: IconName;
};

const iconControl = {
  options: Object.keys(icons),
  control: { type: "select" },
  table: { category: "Content" },
} as const;

// Splits the story-only args from the real props and resolves the icons.
function useStoryButton(args: ButtonStoryArgs) {
  const buttonProps = computed(() => {
    const {
      label: _label,
      leadingIcon: _leading,
      trailingIcon: _trailing,
      ...rest
    } = args;
    return rest;
  });
  const leading = computed(() => icons[args.leadingIcon]);
  const trailing = computed(() => icons[args.trailingIcon]);
  return { args, buttonProps, leading, trailing };
}

const buttonContent = `
  <template v-if="leading" #leading><component :is="leading" /></template>
  {{ args.label }}
  <template v-if="trailing" #trailing><component :is="trailing" /></template>`;

const meta = {
  title: "Components/Button",
  component: Button,
  // The docs page is Button.mdx (sizes, typography, states), not autodocs.
  argTypes: {
    label: { control: "text", table: { category: "Content" } },
    leadingIcon: iconControl,
    trailingIcon: iconControl,
    status: {
      options: ["idle", "loading", "success", "error"],
      control: { type: "inline-radio" },
    },
  },
  args: {
    label: "Button",
    leadingIcon: "None",
    trailingIcon: "None",
    variant: "basic",
    size: "md",
    disabled: false,
    square: false,
    status: "idle",
  },
  render: (args) => ({
    components: { Button },
    setup: () => useStoryButton(args),
    template: `<Button v-bind="buttonProps">${buttonContent}</Button>`,
  }),
} satisfies Meta<ButtonStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Playground: use the controls below. */
export const Default: Story = {};

export const Primary: Story = { args: { variant: "primary" } };

/** Low-emphasis actions: toolbars, icon buttons, × on panels. */
export const Ghost: Story = { args: { variant: "ghost", label: "Export", leadingIcon: "Download" } };

/** Every variant side by side, in the order of emphasis. */
export const AllVariants: Story = {
  render: () => ({
    components: { Button },
    template: `
      <div class="flex flex-wrap items-center gap-2">
        <Button variant="primary">Primary</Button>
        <Button variant="basic">Basic</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="danger">Danger</Button>
      </div>`,
  }),
};

/**
 * Text and icon-only (square) buttons side by side, at each size. Icon buttons
 * are exactly as tall as the text buttons next to them, and just as wide.
 */
export const WithIconButtons: Story = {
  render: () => ({
    components: { Button, Save, Pencil, Trash2, Copy, Plus },
    template: `
      <div class="flex flex-col gap-4">
        <div v-for="size in ['sm', 'md', 'lg']" :key="size" class="flex items-center gap-2">
          <Button variant="primary" :size="size"><template #leading><Save /></template>Save</Button>
          <Button variant="ghost" :size="size">Cancel</Button>
          <Button variant="ghost" :size="size" square aria-label="Edit"><Pencil /></Button>
          <Button :size="size" square aria-label="Copy"><Copy /></Button>
          <Button variant="primary" :size="size" square aria-label="Add"><Plus /></Button>
          <Button variant="danger" :size="size" square aria-label="Delete"><Trash2 /></Button>
        </div>
      </div>`,
  }),
};

export const Danger: Story = {
  args: { variant: "danger", label: "Delete", leadingIcon: "Trash2" },
};

export const Previous: Story = {
  args: { label: "Previous", leadingIcon: "ArrowLeft" },
};

export const Next: Story = {
  args: { label: "Next", trailingIcon: "ArrowRight" },
};

export const Disabled: Story = { args: { disabled: true } };

/**
 * Click the button: it loads for a second, then randomly succeeds, fails, or
 * goes straight back to idle. Success and error return to idle on their own
 * after `statusDuration`.
 */
export const StatusDemo: Story = {
  name: "Status (click me)",
  args: {
    variant: "primary",
    label: "Save",
    leadingIcon: "Save",
    loadingText: "",
    successText: "",
    errorText: "",
  },
  argTypes: { status: { table: { disable: true } } },
  render: (args) => ({
    components: { Button },
    setup() {
      const status = ref<ButtonStatus>("idle");
      const lastResult = ref<ButtonStatus | null>(null);
      const outcomes: ButtonStatus[] = ["success", "error", "idle"];

      function run() {
        status.value = "loading";
        setTimeout(() => {
          const result = outcomes[Math.floor(Math.random() * outcomes.length)];
          status.value = result;
          lastResult.value = result;
        }, 1000);
      }

      return { ...useStoryButton(args), status, lastResult, run };
    },
    template: `
      <div class="flex flex-col items-start gap-3">
        <Button v-bind="buttonProps" v-model:status="status" @click="run">${buttonContent}</Button>
        <small class="text-xs text-black/60">
          Last result: {{ lastResult ?? "—" }}
        </small>
      </div>`,
  }),
};
