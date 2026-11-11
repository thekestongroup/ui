import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { Bell, Building2, ChevronRight } from "@lucide/vue";
import { ref } from "vue";
import Button from "../Button/Button.vue";
import Header, { type HeaderUser } from "./Header.vue";

const user: HeaderUser = {
  name: "Ben Smith",
  email: "ben.smith@keston.school",
  organisation: "The Keston School",
};

const meta = {
  title: "Components/Header",
  component: Header,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    title: "Keston Admissions",
    menu: true,
    sticky: true,
    user,
    signIn: true,
  },
  render: (args) => ({
    components: { Header, Button, Bell },
    setup() {
      const last = ref("");
      return { args, last };
    },
    template: `
      <div>
        <Header
          v-bind="args"
          @account-settings="last = 'account-settings'"
          @switch-account="last = 'switch-account'"
          @log-out="last = 'log-out'"
          @sign-in="last = 'sign-in'"
        >
          <template #trailing>
            <Button variant="ghost" square aria-label="Notifications"><Bell /></Button>
          </template>
        </Header>
        <p class="p-4 text-sm text-black/65">Last event: {{ last || "none" }}</p>
      </div>`,
  }),
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Playground: use the controls below. The avatar on the right opens the
 * account menu; its actions emit account-settings, switch-account and log-out.
 */
export const Default: Story = {};

/** A picture instead of initials. */
export const WithAvatar: Story = {
  args: {
    user: { ...user, avatar: "https://i.pravatar.cc/96?img=12" },
  },
};

/** Signed out: a Sign in button (emits sign-in) in place of the account menu. */
export const SignedOut: Story = {
  args: { user: undefined },
};

/** Only some account actions, e.g. an app where people can't switch account. */
export const FewerActions: Story = {
  args: { userActions: ["account-settings", "log-out"] },
};

/** Extra content in the account menu with the account-menu slot, above the actions. */
export const CustomUserMenu: Story = {
  render: (args) => ({
    components: { Header, Button, Building2 },
    setup: () => ({ args }),
    template: `
      <Header v-bind="args">
        <template #account-menu="{ close }">
          <div class="flex flex-col gap-1 border-t border-black/15 p-2">
            <p class="px-3 pt-1 text-xs font-bold text-black/65 uppercase">Switch school</p>
            <Button variant="ghost" class="w-full justify-start px-3" @click="close">
              <template #leading><Building2 /></template>Keston Prep
            </Button>
            <Button variant="ghost" class="w-full justify-start px-3" @click="close">
              <template #leading><Building2 /></template>Keston Sixth Form
            </Button>
          </div>
        </template>
      </Header>`,
  }),
};

/** The whole account area replaced with the account slot. */
export const CustomUser: Story = {
  render: (args) => ({
    components: { Header, Button },
    setup: () => ({ args }),
    template: `
      <Header v-bind="args">
        <template #account><Button size="sm">Help</Button></template>
      </Header>`,
  }),
};

/** Just the title: no menu button, actions or account menu. */
export const TitleOnly: Story = {
  args: { menu: false, user: undefined, signIn: false },
  render: (args) => ({
    components: { Header },
    setup: () => ({ args }),
    template: `<Header v-bind="args" />`,
  }),
};

/** Content in the middle slot (here, breadcrumbs) fills the space between the title and the actions. */
export const WithMiddle: Story = {
  render: (args) => ({
    components: { Header, Button, Bell, ChevronRight },
    setup: () => ({ args }),
    template: `
      <Header v-bind="args">
        <nav aria-label="Breadcrumb" class="ml-2 hidden items-center gap-1 text-sm text-black/65 sm:flex [&_svg]:size-4">
          <ChevronRight aria-hidden="true" />
          <a href="#" class="hover:underline">Students</a>
          <ChevronRight aria-hidden="true" />
          <span aria-current="page" class="text-black">Ben Smith</span>
        </nav>
        <template #trailing>
          <Button variant="ghost" square aria-label="Notifications"><Bell /></Button>
          <Button size="sm" variant="primary">New student</Button>
        </template>
      </Header>`,
  }),
};

/** A logo in the leading slot, before the title. */
export const WithLogo: Story = {
  args: { menu: false },
  render: (args) => ({
    components: { Header },
    setup: () => ({ args }),
    template: `
      <Header v-bind="args">
        <template #leading>
          <span class="flex size-7 items-center justify-center rounded bg-primary text-xs font-bold text-white" aria-hidden="true">K</span>
        </template>
      </Header>`,
  }),
};

/** Stays at the top while the page scrolls (the default). Scroll the box below. */
export const Sticky: Story = {
  render: (args) => ({
    components: { Header },
    setup: () => ({ args }),
    template: `
      <div class="h-96 overflow-y-auto bg-background">
        <Header v-bind="args" />
        <div class="flex flex-col gap-3 p-4">
          <p v-for="n in 30" :key="n" class="text-sm text-black/65">Row {{ n }}</p>
        </div>
      </div>`,
  }),
};
