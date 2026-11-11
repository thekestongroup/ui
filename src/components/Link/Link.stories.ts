import type { Meta, StoryObj } from "@storybook/vue3-vite";
import Link, { type LinkProps } from "./Link.vue";

type LinkStoryArgs = LinkProps & { text: string };

const meta = {
  title: "Components/Navigation/Link",
  component: Link,
  tags: ["autodocs"],
  argTypes: {
    text: { control: "text", table: { category: "Content" } },
  },
  args: { href: "#", text: "Privacy policy", newTab: false, icon: true },
  render: (args) => ({
    components: { Link },
    setup: () => ({ args }),
    template: `<p class="text-sm text-black"><Link :href="args.href" :new-tab="args.newTab" :icon="args.icon">{{ args.text }}</Link></p>`,
  }),
} satisfies Meta<LinkStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Playground: use the controls below. */
export const Default: Story = {};

/** Opens in a new tab: the small external-page icon shows it, and screen readers hear "(opens in a new tab)". */
export const NewTab: Story = { args: { newTab: true } };

/** Opens in a new tab without the icon (`:icon="false"`). Screen readers still hear "(opens in a new tab)". */
export const NewTabWithoutIcon: Story = { args: { newTab: true, icon: false } };

/** In a sentence it takes the text's size and colour. */
export const InASentence: Story = {
  render: () => ({
    components: { Link },
    template: `
      <p class="max-w-100 text-xs text-black/65">
        Make sure you trust Keston Admissions: read its
        <Link href="#" new-tab>privacy policy</Link> and <Link href="#" new-tab>terms</Link>.
        You can remove its access at any time in your <Link href="#">Keston account</Link>.
      </p>`,
  }),
};

/** A row of footer links, muted until hovered. */
export const Footer: Story = {
  render: () => ({
    components: { Link },
    template: `
      <nav aria-label="Legal and help" class="flex items-center gap-2 text-xs text-black/65">
        <Link href="#" new-tab>Privacy</Link>
        <span aria-hidden="true">·</span>
        <Link href="#" new-tab>Terms</Link>
        <span aria-hidden="true">·</span>
        <Link href="#" new-tab>Help</Link>
      </nav>`,
  }),
};

/** Larger text: the icon grows with it. */
export const Sizes: Story = {
  render: () => ({
    components: { Link },
    template: `
      <div class="flex flex-col gap-2 text-black">
        <p class="text-xs"><Link href="#" new-tab>Extra small</Link></p>
        <p class="text-sm"><Link href="#" new-tab>Small</Link></p>
        <p class="text-base"><Link href="#" new-tab>Base</Link></p>
        <p class="text-xl"><Link href="#" new-tab>Extra large</Link></p>
      </div>`,
  }),
};
