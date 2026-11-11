import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { CircleHelp, Settings } from "@lucide/vue";
import { ref } from "vue";
import Button from "../Button/Button.vue";
import Input from "../Input/Input.vue";
import Popover from "./Popover.vue";

const meta = {
  title: "Components/Overlay/Popover",
  component: Popover,
  tags: ["autodocs"],
  argTypes: {
    mode: { options: ["click", "hover"], control: { type: "inline-radio" } },
  },
  args: { mode: "click", arrow: false, dismissible: true, modal: false },
  decorators: [() => ({ template: '<div class="flex min-h-80 items-start justify-center pt-24"><story /></div>' })],
  render: (args) => ({
    components: { Popover, Button },
    setup: () => ({ args }),
    template: `
      <Popover v-bind="args">
        <Button>Open popover</Button>
        <template #content>
          <div class="max-w-64 p-3 text-sm">
            A floating panel. Click outside or press Escape to close it.
          </div>
        </template>
      </Popover>`,
  }),
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Playground: use the controls below. */
export const Default: Story = {};

/** Click mode moves focus into the panel, so it suits interactive content. */
export const WithForm: Story = {
  render: (args) => ({
    components: { Popover, Button, Input, Settings },
    setup() {
      const name = ref("Year 9 Maths");
      return { args, name };
    },
    template: `
      <Popover v-bind="args">
        <Button><template #leading><Settings /></template>Class settings</Button>
        <template #content="{ close }">
          <div class="flex w-72 flex-col gap-3 p-4">
            <Input v-model="name" label="Class name" />
            <div class="flex justify-end gap-2">
              <Button size="sm" @click="close">Cancel</Button>
              <Button size="sm" variant="primary" @click="close">Save</Button>
            </div>
          </div>
        </template>
      </Popover>`,
  }),
};

/** Hover mode: opens on hover; click or tap keeps it open (works on touch). Focus isn't moved. */
export const Hover: Story = {
  args: { mode: "hover" },
  render: (args) => ({
    components: { Popover, CircleHelp },
    setup: () => ({ args }),
    template: `
      <Popover v-bind="args">
        <button type="button" aria-label="About attendance codes" class="inline-flex rounded-full p-1 transition hover:bg-black/10 [&_svg]:size-4">
          <CircleHelp />
        </button>
        <template #content>
          <p class="max-w-64 px-3 py-2 text-xs">/ and \\ mean present, N means no reason yet, L means late.</p>
        </template>
      </Popover>`,
  }),
};

export const WithArrow: Story = { args: { arrow: true } };

export const Sides: Story = {
  render: () => ({
    components: { Popover, Button },
    template: `
      <div class="grid grid-cols-2 gap-4">
        <Popover v-for="side in ['top', 'right', 'bottom', 'left']" :key="side" :content="{ side }" arrow>
          <Button>{{ side }}</Button>
          <template #content><div class="p-3 text-sm">Opens {{ side }}</div></template>
        </Popover>
      </div>`,
  }),
};

/** Escape and clicking outside don't close it; it emits close:prevent instead. */
export const NotDismissible: Story = {
  args: { dismissible: false },
  render: (args) => ({
    components: { Popover, Button },
    setup() {
      const attempts = ref(0);
      return { args, attempts };
    },
    template: `
      <Popover v-bind="args" @close:prevent="attempts++">
        <Button>Open</Button>
        <template #content="{ close }">
          <div class="flex w-64 flex-col gap-3 p-3 text-sm">
            <p>Only the button below closes this.</p>
            <p class="text-black/60">Blocked close attempts: {{ attempts }}</p>
            <Button size="sm" @click="close">Close</Button>
          </div>
        </template>
      </Popover>`,
  }),
};

/** Opened and closed from outside with v-model:open. */
export const Controlled: Story = {
  render: (args) => ({
    components: { Popover, Button },
    setup() {
      const open = ref(false);
      return { args, open };
    },
    template: `
      <div class="flex items-center gap-3">
        <Popover v-bind="args" v-model:open="open">
          <Button>Trigger</Button>
          <template #content><div class="p-3 text-sm">Controlled popover</div></template>
        </Popover>
        <Button variant="primary" @click="open = !open">{{ open ? 'Close' : 'Open' }} from outside</Button>
      </div>`,
  }),
};
