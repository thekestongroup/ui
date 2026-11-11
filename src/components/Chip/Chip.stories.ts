import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { BookOpen, Calculator, FlaskConical, User } from "@lucide/vue";
import { ref } from "vue";
import Chip from "./Chip.vue";

const meta = {
  title: "Components/Chip",
  component: Chip,
  tags: ["autodocs"],
  argTypes: {
    size: { options: ["sm", "md"], control: { type: "inline-radio" } },
  },
  args: { size: "md", removable: false, disabled: false },
  render: (args) => ({
    components: { Chip },
    setup: () => ({ args }),
    template: `<Chip v-bind="args">Ben Blissett</Chip>`,
  }),
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Playground: use the controls below. */
export const Default: Story = {};

/** Both sizes, with and without an icon and a ×. */
export const Sizes: Story = {
  render: () => ({
    components: { Chip, User },
    template: `
      <div class="flex flex-col gap-3">
        <div v-for="size in ['sm', 'md']" :key="size" class="flex flex-wrap items-center gap-1">
          <Chip :size="size">Ben Blissett</Chip>
          <Chip :size="size"><template #leading><User /></template>Ben Blissett</Chip>
          <Chip :size="size" removable remove-label="Remove Ben Blissett">Ben Blissett</Chip>
          <Chip :size="size" removable remove-label="Remove Ben Blissett"><template #leading><User /></template>Ben Blissett</Chip>
        </div>
      </div>`,
  }),
};

/** Chosen items with × to remove them, wrapping onto more lines. */
export const Removable: Story = {
  render: () => ({
    components: { Chip },
    setup() {
      const subjects = ref([
        { label: "English", icon: BookOpen },
        { label: "Maths", icon: Calculator },
        { label: "Science", icon: FlaskConical },
      ]);
      const remove = (label: string) => (subjects.value = subjects.value.filter((s) => s.label !== label));
      return { subjects, remove };
    },
    template: `
      <div class="flex max-w-64 flex-wrap gap-1">
        <Chip
          v-for="subject in subjects"
          :key="subject.label"
          removable
          :remove-label="'Remove ' + subject.label"
          @remove="remove(subject.label)"
        >
          <template #leading><component :is="subject.icon" /></template>
          {{ subject.label }}
        </Chip>
        <span v-if="!subjects.length" class="text-sm text-black/65">All removed</span>
      </div>`,
  }),
};
