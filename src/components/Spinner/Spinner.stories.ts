import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { onBeforeUnmount, ref } from "vue";
import Spinner from "./Spinner.vue";

const meta = {
  title: "Components/Element/Spinner",
  component: Spinner,
  tags: ["autodocs"],
  argTypes: {
    value: { control: { type: "range", min: 0, max: 100, step: 1 } },
    size: { options: ["sm", "md", "lg"], control: { type: "inline-radio" } },
  },
  args: { size: "md", label: "Loading", showValue: false },
  render: (args) => ({
    components: { Spinner },
    setup: () => ({ args }),
    template: '<Spinner v-bind="args" class="text-primary" />',
  }),
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

/** No value: spins continuously, for waits of unknown length. */
export const Continuous: Story = {};

/** With a value: use the slider in Controls to change it. */
export const WithValue: Story = { args: { value: 40 } };

export const WithPercentage: Story = { args: { value: 65, size: "lg", showValue: true } };

/** Counts from 0 to 100 and starts again, to show the fill animation. */
export const Filling: Story = {
  args: { size: "lg", showValue: true, label: "Uploading report" },
  render: (args) => ({
    components: { Spinner },
    setup() {
      const value = ref(0);
      const timer = setInterval(() => {
        value.value = value.value >= 100 ? 0 : value.value + 5;
      }, 300);
      onBeforeUnmount(() => clearInterval(timer));
      return { args, value };
    },
    template: '<Spinner v-bind="args" :value="value" class="text-primary" />',
  }),
};

export const Sizes: Story = {
  render: () => ({
    components: { Spinner },
    template: `
      <div class="flex items-center gap-6 text-primary">
        <Spinner size="sm" />
        <Spinner size="md" />
        <Spinner size="lg" />
        <Spinner size="sm" :value="60" />
        <Spinner size="md" :value="60" />
        <Spinner size="lg" :value="60" show-value />
      </div>`,
  }),
};

/** It takes the surrounding text colour, like an icon. */
export const Colours: Story = {
  render: () => ({
    components: { Spinner },
    template: `
      <div class="flex items-center gap-6">
        <Spinner class="text-primary" :value="70" />
        <Spinner class="text-green" :value="70" />
        <Spinner class="text-red" :value="70" />
        <Spinner class="text-black" />
        <span class="inline-flex rounded bg-primary p-2 text-white">
          <Spinner />
        </span>
      </div>`,
  }),
};
