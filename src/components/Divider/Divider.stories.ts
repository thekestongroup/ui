import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { Bold, Italic, Underline } from "@lucide/vue";
import Button from "../Button/Button.vue";
import Divider from "./Divider.vue";

const meta = {
  title: "Components/Element/Divider",
  component: Divider,
  tags: ["autodocs"],
  argTypes: {
    orientation: { options: ["horizontal", "vertical"], control: { type: "inline-radio" } },
  },
  args: { orientation: "horizontal", decorative: true },
  render: (args) => ({
    components: { Divider },
    setup: () => ({ args }),
    template: `
      <div class="flex max-w-sm flex-col gap-4 text-sm">
        <p>Above the line.</p>
        <Divider v-bind="args" />
        <p>Below the line.</p>
      </div>`,
  }),
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Between stacked content. */
export const Default: Story = {};

/** A short label in the middle, e.g. between two ways of doing something. */
export const WithLabel: Story = {
  render: () => ({
    components: { Divider, Button },
    template: `
      <div class="flex max-w-sm flex-col gap-4">
        <Button variant="primary">Sign in with Microsoft</Button>
        <Divider label="or" />
        <Button>Sign in with email</Button>
      </div>`,
  }),
};

/** Vertical, between groups of buttons in a row. */
export const Vertical: Story = {
  render: () => ({
    components: { Divider, Button, Bold, Italic, Underline },
    template: `
      <div class="flex h-9.5 items-center gap-1">
        <Button variant="ghost" square aria-label="Bold"><Bold /></Button>
        <Button variant="ghost" square aria-label="Italic"><Italic /></Button>
        <Divider orientation="vertical" class="mx-1 my-2" />
        <Button variant="ghost" square aria-label="Underline"><Underline /></Button>
      </div>`,
  }),
};
