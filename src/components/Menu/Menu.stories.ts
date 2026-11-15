import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { Ban, KeyRound, SquareArrowOutUpRight, Trash2, UsersRound } from "@lucide/vue";
import Menu from "./Menu.vue";

const meta = {
  title: "Components/Overlay/Menu",
  component: Menu,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: {
    label: "Actions for Jo Bloggs",
    items: [
      { label: "Open profile", icon: SquareArrowOutUpRight, href: "#" },
      { label: "Reset password", icon: KeyRound, onSelect: () => {} },
      { label: "Block sign-in", icon: Ban, onSelect: () => {} },
      { label: "Manage group memberships", icon: UsersRound, onSelect: () => {} },
      { label: "Delete user", icon: Trash2, onSelect: () => {} },
    ],
  },
} satisfies Meta<typeof Menu>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A row's actions. Open it with the button, or focus it and press Enter; arrow keys move between items. */
export const Default: Story = {};

/** Compact, for table rows. */
export const Small: Story = { args: { size: "sm" } };

/** Items can be turned off when they don't apply. */
export const WithDisabledItem: Story = {
  args: {
    items: [
      { label: "Open profile", icon: SquareArrowOutUpRight, href: "#" },
      { label: "Reset password", icon: KeyRound, onSelect: () => {} },
      { label: "Delete user", icon: Trash2, disabled: true },
    ],
  },
};
