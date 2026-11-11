import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { computed, ref } from "vue";
import Card from "../Card/Card.vue";
import Checkbox from "../Checkbox/Checkbox.vue";
import Checklist from "./Checklist.vue";

const meta = {
  title: "Components/Data/Checklist",
  component: Checklist,
  tags: ["autodocs"],
  args: {
    items: [
      { label: "Academic year", done: true },
      { label: "Term dates", done: true },
      { label: "Year groups", done: false },
      { label: "Copy from last year", done: false },
    ],
  },
} satisfies Meta<typeof Checklist>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [() => ({ template: '<div class="max-w-72"><story /></div>' })],
};

/** Long steps wrap; the icon stays level with the first line. */
export const LongItems: Story = {
  decorators: [() => ({ template: '<div class="max-w-72"><story /></div>' })],
  args: {
    items: [
      { label: "Upload proof of address dated within the last three months", done: true },
      { label: "Upload the student's most recent school report", done: false },
    ],
  },
};

/** Following a form: each step ticks itself off as its part is filled in. */
export const FollowingAForm: Story = {
  render: () => ({
    components: { Card, Checkbox, Checklist },
    setup() {
      const form = ref({ address: false, report: false, medical: false });
      const items = computed(() => [
        { label: "Proof of address", done: form.value.address },
        { label: "School report", done: form.value.report },
        { label: "Medical form", done: form.value.medical },
      ]);
      return { form, items };
    },
    template: `
      <!-- Laid out by the space it has (container query), not the window. -->
      <div class="@container max-w-160">
      <div class="grid grid-cols-1 items-start gap-4 @lg:grid-cols-[minmax(0,1fr)_14rem]">
        <Card title="Documents">
          <Checkbox v-model="form.address" label="Proof of address received" />
          <Checkbox v-model="form.report" label="School report received" />
          <Checkbox v-model="form.medical" label="Medical form received" />
        </Card>
        <Card as="aside" title="Before submitting" padding="sm">
          <Checklist :items="items" />
        </Card>
      </div>
      </div>`,
  }),
};
