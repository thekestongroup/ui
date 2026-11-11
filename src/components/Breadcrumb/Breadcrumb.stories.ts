import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { House, School } from "@lucide/vue";
import Breadcrumb from "./Breadcrumb.vue";

const meta = {
  title: "Components/Breadcrumb",
  component: Breadcrumb,
  tags: ["autodocs"],
  args: {
    items: [
      { label: "School", href: "#" },
      { label: "School Structure", href: "#" },
      { label: "New School Year Setup" },
    ],
  },
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Earlier steps link back; the last is the current page. */
export const Default: Story = {};

/** Steps that aren't pages themselves (here "School", a group in the sidebar) are plain text. */
export const WithGroups: Story = {
  args: {
    items: [
      { label: "School", icon: School },
      { label: "School Structure", href: "#" },
      { label: "New School Year Setup" },
    ],
  },
};

/** An icon on the first step, e.g. home. */
export const WithIcon: Story = {
  args: {
    items: [
      { label: "Home", icon: House, href: "#" },
      { label: "Students", href: "#" },
      { label: "Year 9", href: "#" },
      { label: "Ben Blissett" },
    ],
  },
};

/** Long steps are cut off with … at 240px (full text on hover), and the trail wraps on narrow screens. */
export const LongNames: Story = {
  decorators: [() => ({ template: '<div class="max-w-80"><story /></div>' })],
  args: {
    items: [
      { label: "School", href: "#" },
      { label: "School Structure and Organisation Settings", href: "#" },
      { label: "Academic Years", href: "#" },
      { label: "New School Year Setup for September 2027" },
    ],
  },
};
