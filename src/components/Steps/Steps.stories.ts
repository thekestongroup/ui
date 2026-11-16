import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { ref } from "vue";
import Steps from "./Steps.vue";
import Button from "../Button/Button.vue";

const meta = {
  title: "Components/Navigation/Steps",
  component: Steps,
  tags: ["autodocs"],
  args: {
    label: "Add a user",
    steps: ["User info", "Licences", "Confirmation"],
    step: 1,
  },
  argTypes: { step: { control: { type: "number", min: 0, max: 2 } } },
  decorators: [() => ({ template: '<div class="max-w-120"><story /></div>' })],
} satisfies Meta<typeof Steps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Drive it from Previous and Next buttons. The words are announced as the step changes. */
export const WithButtons: Story = {
  render: (args) => ({
    components: { Steps, Button },
    setup: () => ({ args, step: ref(0) }),
    template: `
      <div class="flex flex-col gap-6">
        <Steps v-bind="args" :step="step" />
        <div class="flex gap-2">
          <Button :disabled="step === 0" @click="step--">Previous</Button>
          <Button variant="primary" :disabled="step === args.steps.length - 1" @click="step++">Next</Button>
        </div>
      </div>`,
  }),
};
