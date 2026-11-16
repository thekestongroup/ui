import type { Meta, StoryObj } from "@storybook/vue3-vite";
import LanguageSwitcher from "./LanguageSwitcher.vue";

const meta = {
  title: "Components/Form/LanguageSwitcher",
  component: LanguageSwitcher,
  tags: ["autodocs"],
  args: { hideLabel: false, disabled: false },
  decorators: [() => ({ template: '<div class="max-w-80"><story /></div>' })],
} satisfies Meta<typeof LanguageSwitcher>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Lists the languages the app has. Storybook has English only; an app with
 * more shows each in its own name and changes language as soon as one is chosen.
 */
export const Default: Story = {};

export const HiddenLabel: Story = { args: { hideLabel: true } };
