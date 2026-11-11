import type { Meta, StoryObj } from "@storybook/vue3-vite";
import Avatar from "./Avatar.vue";

const ben = {
  name: "Ben Blissett",
  role: "Head of Year 9",
  email: "ben.blissett@keston.school",
  organisation: "The Keston School",
};

const meta = {
  title: "Components/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  argTypes: {
    size: { options: ["xs", "sm", "md", "lg", "xl"], control: { type: "inline-radio" } },
  },
  args: { user: ben, size: "md", profile: false, decorative: false },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Initials on primary when there's no picture. */
export const Default: Story = {};

/** Hover (or press, or Enter) for a small profile: name, role, email, organisation. */
export const WithProfile: Story = { args: { profile: true } };

/** All five sizes: 20, 28, 36, 48 and 64px. */
export const Sizes: Story = {
  render: (args) => ({
    components: { Avatar },
    setup: () => ({ args }),
    template: `
      <div class="flex items-end gap-3">
        <Avatar v-for="size in ['xs', 'sm', 'md', 'lg', 'xl']" :key="size" v-bind="args" :size="size" />
      </div>`,
  }),
};

/** A picture, and a broken picture that falls back to initials. */
export const Pictures: Story = {
  render: () => ({
    components: { Avatar },
    setup: () => ({
      withPicture: { ...ben, avatar: "https://i.pravatar.cc/128?img=12" },
      broken: { ...ben, name: "Zara Khan", avatar: "https://example.invalid/missing.png" },
    }),
    template: `
      <div class="flex items-center gap-3">
        <Avatar :user="withPicture" size="lg" profile />
        <Avatar :user="broken" size="lg" profile />
      </div>`,
  }),
};
