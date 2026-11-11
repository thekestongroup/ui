import type { Meta, StoryObj } from "@storybook/vue3-vite";
import AvatarGroup from "./AvatarGroup.vue";

const org = "The Keston School";
const staff = [
  { name: "Ben Blissett", role: "Head of Year 9", email: "ben.blissett@keston.school", organisation: org },
  { name: "Zara Khan", role: "English teacher", email: "zara.khan@keston.school", organisation: org },
  { name: "Oscar Hughes", role: "Maths teacher", email: "oscar.hughes@keston.school", organisation: org },
  { name: "Freya Lewis", role: "Science teacher", email: "freya.lewis@keston.school", organisation: org },
  { name: "Ethan Price", role: "Teaching assistant", email: "ethan.price@keston.school", organisation: org },
  { name: "Isla Ahmed", role: "SENCo", email: "isla.ahmed@keston.school", organisation: org },
  { name: "Leo Wright", role: "Head of Science", email: "leo.wright@keston.school", organisation: org },
];

const meta = {
  title: "Components/Element/AvatarGroup",
  component: AvatarGroup,
  tags: ["autodocs"],
  argTypes: {
    size: { options: ["xs", "sm", "md", "lg", "xl"], control: { type: "inline-radio" } },
  },
  args: { users: staff, size: "md", max: 4, profile: true },
} satisfies Meta<typeof AvatarGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Overlapping avatars. Hover (or press) one for its profile; it comes to the
 * front. "+3" lists everyone not shown.
 */
export const Default: Story = {};

/** Few enough to show everyone: no "+N". (One extra is shown rather than "+1".) */
export const Small: Story = { args: { users: staff.slice(0, 5) } };

/** Every size. */
export const Sizes: Story = {
  render: (args) => ({
    components: { AvatarGroup },
    setup: () => ({ args }),
    template: `
      <div class="flex flex-col gap-4">
        <AvatarGroup v-for="size in ['xs', 'sm', 'md', 'lg', 'xl']" :key="size" v-bind="args" :size="size" />
      </div>`,
  }),
};
