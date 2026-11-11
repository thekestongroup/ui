import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { onBeforeUnmount, ref } from "vue";
import Button from "../Button/Button.vue";
import Progress, { type ProgressProps } from "./Progress.vue";

const meta = {
  title: "Components/Element/Progress",
  component: Progress,
  tags: ["autodocs"],
  argTypes: {
    value: { control: { type: "number", min: 0 } },
    max: { control: { type: "number", min: 1 } },
  },
  args: { label: "Uploading report.pdf", value: 40, max: 100, segments: false },
  decorators: [() => ({ template: '<div class="max-w-80"><story /></div>' })],
} satisfies Meta<ProgressProps>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Playground: a line filled to `value` out of `max`. */
export const Default: Story = {};

/** One segment per step, e.g. step 2 of 4 in a multi-step form. */
export const Segments: Story = {
  args: { label: "Add a student", segments: true, value: 2, max: 4 },
};

/** No `value`: something is happening but there's no telling how long it'll take. */
export const Indeterminate: Story = {
  args: { label: "Loading students", value: null },
};

/** Filling up over time, like an upload. */
export const Filling: Story = {
  render: (args) => ({
    components: { Progress, Button },
    setup() {
      const value = ref(0);
      let timer: ReturnType<typeof setInterval> | undefined;
      function start() {
        clearInterval(timer);
        value.value = 0;
        timer = setInterval(() => {
          value.value = Math.min(100, value.value + Math.random() * 15);
          if (value.value >= 100) clearInterval(timer);
        }, 400);
      }
      onBeforeUnmount(() => clearInterval(timer));
      return { args, value, start };
    },
    template: `
      <div class="flex flex-col gap-3">
        <Progress :label="args.label" :value="value" />
        <Button size="sm" class="self-start" @click="start">Upload</Button>
      </div>`,
  }),
};

/** Moving between steps: segments colour in and out. */
export const Stepping: Story = {
  render: () => ({
    components: { Progress, Button },
    setup: () => ({ step: ref(1) }),
    template: `
      <div class="flex flex-col gap-3">
        <Progress label="Add a student" segments :value="step" :max="4" />
        <div class="flex gap-2">
          <Button size="sm" :disabled="step === 1" @click="step--">Previous</Button>
          <Button size="sm" :disabled="step === 4" @click="step++">Next</Button>
        </div>
      </div>`,
  }),
};
