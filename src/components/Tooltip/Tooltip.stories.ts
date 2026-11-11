import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { Download, Pencil, Trash2 } from "@lucide/vue";
import Button from "../Button/Button.vue";
import Tooltip from "./Tooltip.vue";

const meta = {
  title: "Components/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
  argTypes: {
    side: { options: ["top", "right", "bottom", "left"], control: { type: "inline-radio" } },
    align: { options: ["start", "center", "end"], control: { type: "inline-radio" } },
  },
  args: { text: "Download as CSV", side: "top", align: "center", delay: 400 },
  decorators: [() => ({ template: '<div class="p-16"><story /></div>' })],
  render: (args) => ({
    components: { Tooltip, Button, Download },
    setup: () => ({ args }),
    template: `<Tooltip v-bind="args"><Button variant="ghost" square aria-label="Download"><Download /></Button></Tooltip>`,
  }),
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Hover or tab to the button. Its name is "Download"; the tooltip adds detail as its description. */
export const Default: Story = {};

/**
 * A row of icon buttons: once one tooltip is showing, moving to the next shows
 * it straight away (inside AppShell, which shares one provider for the app).
 */
export const Toolbar: Story = {
  render: () => ({
    components: { Tooltip, Button, Download, Pencil, Trash2 },
    template: `
      <div class="flex gap-1">
        <Tooltip text="Edit"><Button variant="ghost" square aria-label="Edit"><Pencil /></Button></Tooltip>
        <Tooltip text="Download as CSV"><Button variant="ghost" square aria-label="Download"><Download /></Button></Tooltip>
        <Tooltip text="Delete"><Button variant="ghost" square aria-label="Delete"><Trash2 /></Button></Tooltip>
      </div>`,
  }),
};

/** On text: make it focusable (tabindex="0") so keyboard users can open it too. */
export const OnText: Story = {
  render: () => ({
    components: { Tooltip },
    template: `
      <p class="text-sm">
        Fees are due by the
        <Tooltip text="Usually the first school day of each term">
          <span tabindex="0" class="underline decoration-black/40 decoration-dotted underline-offset-2 outline-focus focus-visible:outline-2">start of term</span>
        </Tooltip>.
      </p>`,
  }),
};
