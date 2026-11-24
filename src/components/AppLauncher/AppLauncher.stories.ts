import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { userEvent, within } from "storybook/test";
import AppLauncher from "./AppLauncher.vue";

const meta = {
  title: "Components/Navigation/AppLauncher",
  component: AppLauncher,
  tags: ["autodocs"],
  decorators: [() => ({ template: '<div class="flex min-h-96 justify-end p-4"><story /></div>' })],
} satisfies Meta<typeof AppLauncher>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Open, with the app you are in marked. */
export const Open: Story = {
  args: { current: "admin" },
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { name: "Keston apps" }));
  },
};

export const CustomApps: Story = {
  args: {
    apps: [
      { id: "a", label: "Rota", description: "Who is in when", href: "#a" },
      { id: "b", label: "Reports", href: "#b" },
    ],
  },
};
