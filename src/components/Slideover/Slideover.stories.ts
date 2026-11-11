import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { ref } from "vue";
import Button from "../Button/Button.vue";
import Input from "../Input/Input.vue";
import InputDate from "../InputDate/InputDate.vue";
import InputNumber from "../InputNumber/InputNumber.vue";
import Slideover from "./Slideover.vue";

const meta = {
  title: "Components/Slideover",
  component: Slideover,
  tags: ["autodocs"],
  argTypes: {
    side: { options: ["right", "left", "top", "bottom"], control: { type: "inline-radio" } },
    initialFocus: { options: ["auto", "close", "none"], control: { type: "inline-radio" } },
  },
  args: {
    title: "Notifications",
    description: "Updates from the last 7 days.",
    side: "right",
    overlay: true,
    close: true,
    dismissible: true,
    modal: true,
  },
  render: (args) => ({
    components: { Slideover, Button },
    setup: () => ({ args }),
    template: `
      <Slideover v-bind="args">
        <Button>Open slideover</Button>
        <template #body>
          <p class="text-sm text-black/65">Nothing new.</p>
        </template>
      </Slideover>`,
  }),
} satisfies Meta<typeof Slideover>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Playground: use the controls below. Slides in from the right by default. */
export const Default: Story = {};

/** Editing a record without leaving the page, with Cancel / Save in the footer. */
export const EditStudent: Story = {
  args: { title: "Edit student", description: "Changes are saved to the register." },
  render: (args) => ({
    components: { Slideover, Button, Input, InputDate, InputNumber },
    setup() {
      const student = ref({ firstName: "Ben", lastName: "Smith", dateOfBirth: "2012-01-26", yearGroup: 9 });
      return { args, student };
    },
    template: `
      <Slideover v-bind="args">
        <Button variant="primary">Edit student</Button>
        <template #body>
          <div class="flex flex-col gap-5">
            <div class="grid grid-cols-2 items-start gap-3">
              <Input v-model="student.firstName" label="First name" />
              <Input v-model="student.lastName" label="Last name" />
            </div>
            <InputDate v-model="student.dateOfBirth" label="Date of birth" prefer="past" />
            <InputNumber v-model="student.yearGroup" label="Year group" :min="7" :max="13" />
          </div>
        </template>
        <template #footer="{ close }">
          <Button @click="close">Cancel</Button>
          <Button variant="primary" @click="close">Save</Button>
        </template>
      </Slideover>`,
  }),
};

export const Sides: Story = {
  render: (args) => ({
    components: { Slideover, Button },
    setup: () => ({ args }),
    template: `
      <div class="flex gap-2">
        <Slideover v-for="side in ['right', 'left', 'top', 'bottom']" :key="side" v-bind="args" :side="side" :title="'From the ' + side">
          <Button>{{ side }}</Button>
          <template #body><p class="text-sm text-black/65">Slides in from the {{ side }}.</p></template>
        </Slideover>
      </div>`,
  }),
};

/** The body scrolls; the header and footer stay put. */
export const LongContent: Story = {
  args: { title: "Behaviour log", description: "This term." },
  render: (args) => ({
    components: { Slideover, Button },
    setup: () => ({ args }),
    template: `
      <Slideover v-bind="args">
        <Button>Open log</Button>
        <template #body>
          <ul class="flex flex-col gap-3 text-sm">
            <li v-for="n in 40" :key="n" class="rounded border border-black/15 p-3">Entry {{ n }}</li>
          </ul>
        </template>
        <template #footer="{ close }"><Button @click="close">Done</Button></template>
      </Slideover>`,
  }),
};

/** Escape and clicking outside don't close it; only the footer button does. */
export const NotDismissible: Story = {
  args: { title: "Unsaved changes", description: "Save or discard before leaving.", dismissible: false, close: false },
  render: (args) => ({
    components: { Slideover, Button },
    setup() {
      const attempts = ref(0);
      return { args, attempts };
    },
    template: `
      <Slideover v-bind="args" @close:prevent="attempts++">
        <Button>Open</Button>
        <template #body><p class="text-sm text-black/65">Blocked close attempts: {{ attempts }}</p></template>
        <template #footer="{ close }">
          <Button @click="close">Discard</Button>
          <Button variant="primary" @click="close">Save</Button>
        </template>
      </Slideover>`,
  }),
};

/** Opened from code with v-model:open, without a trigger slot. */
export const Controlled: Story = {
  render: (args) => ({
    components: { Slideover, Button },
    setup() {
      const open = ref(false);
      return { args, open };
    },
    template: `
      <div>
        <Button variant="primary" @click="open = true">Open from code</Button>
        <Slideover v-bind="args" v-model:open="open">
          <template #body><p class="text-sm text-black/65">Opened with v-model:open.</p></template>
        </Slideover>
      </div>`,
  }),
};
