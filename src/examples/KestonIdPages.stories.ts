import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { ArrowLeftRight, BadgeCheck, BookOpen, Lock, Mail, RefreshCw, ShieldCheck, User } from "@lucide/vue";
import { computed, nextTick, reactive, ref } from "vue";
import Avatar from "../components/Avatar/Avatar.vue";
import Button, { type ButtonStatus } from "../components/Button/Button.vue";
import Card from "../components/Card/Card.vue";
import Checkbox from "../components/Checkbox/Checkbox.vue";
import Divider from "../components/Divider/Divider.vue";
import Input from "../components/Input/Input.vue";
import InputCode, { type InputCodeProps } from "../components/InputCode/InputCode.vue";
import InputPassword from "../components/InputPassword/InputPassword.vue";
import Link from "../components/Link/Link.vue";
import Popover from "../components/Popover/Popover.vue";

/**
 * Keston ID, the identity provider: signing in to an app (which then asks for
 * consent), the two-step code, and the OAuth 2.0 consent prompt an app shows
 * before it gets access to someone's account. Built only from library
 * components; not part of the library itself.
 */
const meta = {
  title: "Examples/Keston ID",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const user = { name: "Ben Smith", email: "ben.smith@keston.school", organisation: "The Keston School" };

// ── The app asking ──────────────────────────────────────────────────────────

interface Scope {
  /** OAuth scope, e.g. "students:read". Shown to developers only. */
  id: string;
  label: string;
  description: string;
  icon: unknown;
  /** The app can't work without it, so it isn't a choice. */
  required?: boolean;
}

const client = {
  name: "Keston Admissions",
  publisher: "The Keston Group",
  /**
   * The mark by its name: "owned" (the organisation's own app), "verified"
   * (checked by the organisation) or "none".
   */
  verification: "owned" as "owned" | "verified" | "none",
  redirectHost: "admissions.keston.school",
};

// What the mark by the app's name says, on hover, click or Enter. Owned apps
// get a Keston blue tick; verified ones the brighter blue.
const verificationMarks = {
  owned: { label: "Verified by The Keston Group." },
  verified: { label: "Verified by The Keston Group." },
};

const scopes: Scope[] = [
  {
    id: "openid profile",
    label: "View your name and profile picture",
    description: "To show who's signed in.",
    icon: User,
    required: true,
  },
  {
    id: "email",
    label: "View your email address",
    description: "ben.smith@keston.school",
    icon: Mail,
    required: true,
  },
  {
    id: "students:read",
    label: "View student records at The Keston School",
    description: "Names, year groups and contact details. It can't change them.",
    icon: BookOpen,
  },
  {
    id: "offline_access",
    label: "Stay connected when you're not using it",
    description: "So it can sync applications overnight. You can disconnect it at any time.",
    icon: RefreshCw,
  },
];

/** What the shared templates below need from setup(). */
const appState = () => ({
  user,
  client,
  app: { name: client.name },
  mark: client.verification === "none" ? undefined : verificationMarks[client.verification],
});

// ── Shared page parts ───────────────────────────────────────────────────────

// Branding above the card. Pages show the organisation's logo (for now always
// The Keston Group) or Keston ID's own. The TKG square stands in for the real
// logo: swap it for the SVG when there is one.
const brands = {
  tkg: `
      <div class="flex items-center justify-center gap-2 text-primary">
        <span class="flex size-8 items-center justify-center rounded bg-primary text-xs font-bold text-white" aria-hidden="true">TKG</span>
        <span class="text-lg font-bold">The Keston Group</span>
      </div>`,
  kestonId: `
      <div class="flex items-center justify-center gap-2 text-primary">
        <ShieldCheck class="size-6" aria-hidden="true" />
        <span class="text-lg font-bold">Keston ID</span>
      </div>`,
};

// Every Keston ID page: a narrow column centred on the grey background, with
// the branding above the card.
const page = (body: string, brand: keyof typeof brands = "kestonId") => `
  <div class="flex min-h-screen flex-col items-center bg-background px-4 py-12 text-black">
    <div class="flex w-full max-w-100 flex-col gap-6">
      ${brands[brand]}
      ${body}
      <nav aria-label="Legal and help" class="flex items-center justify-center gap-2 text-xs text-black/65">
        <Link href="#" new-tab class="py-1">Privacy</Link>
        <span aria-hidden="true">·</span>
        <Link href="#" new-tab class="py-1">Terms</Link>
        <span aria-hidden="true">·</span>
        <Link href="#" new-tab class="py-1">Help</Link>
      </nav>
    </div>
  </div>`;

// The app's name as the page heading, with its verification mark beside it
// (outside the heading, so the mark's "More info" link isn't part of it).
// The mark's panel is rendered in place, so Tab goes from the mark straight
// to "More info" once it's open. Used by sign-in and consent alike.
const appName = (headingId: string) => `
            <div class="flex items-center justify-center gap-1.5">
              <h1 id="${headingId}" tabindex="-1" class="text-xl font-bold outline-none">{{ client.name }}</h1>
              <Popover
                v-if="mark"
                mode="hover"
                :portal="false"
                :open-delay="200"
                :close-delay="150"
                arrow
                :content="{ side: 'top', sideOffset: 6 }"
                :ui="{ content: 'w-max px-3 py-2' }"
              >
                <button
                  type="button"
                  :aria-label="mark.label"
                  :class="client.verification === 'owned' ? 'text-kblue' : 'text-blue'"
                  class="flex cursor-pointer rounded-full outline-2 outline-offset-1 outline-transparent focus-visible:outline-focus"
                >
                  <BadgeCheck class="size-5" aria-hidden="true" />
                </button>
                <template #content>
                  <!-- One line, as narrow as its text. -->
                  <div class="flex items-center gap-2 whitespace-nowrap text-sm">
                    <p class="font-bold">{{ mark.label }}</p>
                    <Link href="#" new-tab>More info<span class="sr-only"> about verification marks</span></Link>
                  </div>
                </template>
              </Popover>
            </div>`;

const appComponents = { Avatar, BadgeCheck, Link, Popover };

// ── OAuth consent card ──────────────────────────────────────────────────────

/** State for the consent card. */
function useConsent() {
  const optional = reactive(Object.fromEntries(scopes.filter((s) => !s.required).map((s) => [s.id, true])));
  const granted = computed(() => scopes.filter((s) => s.required || optional[s.id]).map((s) => s.id).join(" "));
  const allowStatus = ref<ButtonStatus>("idle");
  const result = ref<string>();
  async function allow() {
    allowStatus.value = "loading";
    await new Promise((resolve) => setTimeout(resolve, 700));
    allowStatus.value = "success";
    result.value = `Redirecting to https://${client.redirectHost}/callback?code=…&scope=${encodeURIComponent(granted.value)}`;
  }
  function cancel() {
    result.value = `Redirecting to https://${client.redirectHost}/callback?error=access_denied`;
  }
  return {
    required: scopes.filter((s) => s.required),
    optionalScopes: scopes.filter((s) => !s.required),
    optional,
    allowStatus,
    result,
    allow,
    cancel,
  };
}

const consentComponents = { ...appComponents, Button, Card, Checkbox, Divider, ArrowLeftRight };

const consentCard = `
      <Card :heading-level="1" padding="md">
        <div class="flex flex-col gap-6">
          <div class="flex items-center justify-center gap-3" aria-hidden="true">
            <Avatar :user="app" size="lg" decorative />
            <ArrowLeftRight class="size-5 text-black/55" />
            <Avatar :user="user" size="lg" decorative />
          </div>

          <div class="flex flex-col gap-1 text-center">
            ${appName("consent-heading")}
            <p class="text-base">wants to access your Keston account</p>
            <p class="text-sm text-black/65">An app by {{ client.publisher }}</p>
          </div>

          <!-- Who's signed in, as a small Card in a row. -->
          <Card as="div" padding="sm" :ui="{ body: 'flex-row items-center justify-between gap-3 p-3' }">
            <div class="flex min-w-0 items-center gap-2">
              <Avatar :user="user" size="sm" decorative />
              <div class="flex min-w-0 flex-col">
                <span class="truncate text-sm font-bold">{{ user.name }}</span>
                <span class="truncate text-xs text-black/65">{{ user.email }}</span>
              </div>
            </div>
            <Button size="sm" class="shrink-0">Switch account</Button>
          </Card>

          <div class="flex flex-col gap-3">
            <h2 class="text-sm font-bold">This will let {{ client.name }}:</h2>
            <ul class="flex flex-col gap-3">
              <li v-for="scope in required" :key="scope.id" class="flex items-start gap-3">
                <component :is="scope.icon" class="mt-0.5 size-4 shrink-0 text-black/65" aria-hidden="true" />
                <div class="flex flex-col gap-0.5">
                  <span class="text-sm">{{ scope.label }}</span>
                  <span class="text-xs text-black/65">{{ scope.description }}</span>
                </div>
              </li>
            </ul>
          </div>

          <div class="flex flex-col gap-3">
            <h2 class="text-sm font-bold">You can choose whether it can also:</h2>
            <Checkbox
              v-for="scope in optionalScopes"
              :key="scope.id"
              v-model="optional[scope.id]"
              :label="scope.label"
              :description="scope.description"
            />
          </div>

          <Divider />

          <p class="text-xs text-black/65">
            You'll be sent to <span class="font-bold text-black">{{ client.redirectHost }}</span>.
            Make sure you trust {{ client.name }}: read its
            <Link href="#" new-tab>privacy policy</Link>
            and
            <Link href="#" new-tab>terms</Link>.
            You can remove its access at any time in your Keston account.
          </p>

          <div class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button :disabled="allowStatus !== 'idle'" @click="cancel">Cancel</Button>
            <Button variant="primary" :status="allowStatus" loading-text="Allowing" success-text="Allowed" @click="allow">
              Allow
            </Button>
          </div>

          <p v-if="result" class="break-all rounded bg-surface px-3 py-2 font-mono text-xs" role="status">{{ result }}</p>
        </div>
      </Card>`;

// ── Stories ─────────────────────────────────────────────────────────────────

/**
 * Signing in to an app: its name and verification mark at the top, email and
 * password, and the terms people agree to by signing in. Signing in goes on
 * to the consent prompt, as it would after a real sign-in. Try the password
 * "correct horse".
 */
export const SignIn: Story = {
  render: () => ({
    components: { ...consentComponents, Input, InputPassword, ShieldCheck, Mail, Lock },
    setup() {
      const form = reactive({ email: "", password: "" });
      const error = ref<string>();
      const status = ref<ButtonStatus>("idle");
      const stage = ref<"signIn" | "consent">("signIn");
      async function signIn() {
        error.value = undefined;
        status.value = "loading";
        await new Promise((resolve) => setTimeout(resolve, 800));
        if (form.password !== "correct horse") {
          status.value = "idle";
          error.value = "Incorrect email or password";
          return;
        }
        status.value = "success";
        await new Promise((resolve) => setTimeout(resolve, 600));
        // A new page in a real app. Here, focus its heading so screen readers
        // start reading from the top of the consent prompt.
        stage.value = "consent";
        await nextTick();
        document.getElementById("consent-heading")?.focus();
      }
      return { ...appState(), ...useConsent(), form, error, status, stage, signIn };
    },
    template: page(`
      <Card v-if="stage === 'signIn'" :heading-level="1" padding="md" :ui="{ footer: 'justify-center' }">
        <div class="flex flex-col gap-6">
          <div class="flex justify-center" aria-hidden="true">
            <Avatar :user="app" size="lg" decorative />
          </div>

          <div class="flex flex-col gap-1 text-center">
            ${appName("sign-in-heading")}
            <p class="text-base">Sign in with your Keston account</p>
            <p class="text-sm text-black/65">An app by {{ client.publisher }}</p>
          </div>

          <form class="flex flex-col gap-4" @submit.prevent="signIn">
            <Input v-model="form.email" label="Email" type="email" autocomplete="username">
              <template #leading><Mail /></template>
            </Input>
            <!-- Forgot password? shows by the label but is reached by Tab after
                 the field, so people typing their password aren't sent to it. -->
            <InputPassword v-model="form.password" label="Password" :error-text="error">
              <template #leading><Lock /></template>
              <template #label-trailing>
                <Link href="#" class="text-black/65">Forgot password?</Link>
              </template>
            </InputPassword>
            <Button type="submit" variant="primary" :status="status" loading-text="Signing in" success-text="Signed in">
              Sign in
            </Button>
          </form>
          <Divider label="or" />
          <Button>Sign in with a passkey</Button>
        </div>
        <template #footer>
          <p class="text-center text-xs text-black/65">
            By signing in, you agree to our <Link href="#" new-tab>terms</Link>
            and <Link href="#" new-tab>privacy policy</Link>.
          </p>
        </template>
      </Card>
      <template v-else>${consentCard}</template>`, "tkg"),
  }),
};

/** The second step: a code from an authenticator app. Try 123456. */
export const TwoStepCode: Story = {
  render: () => ({
    components: { Button, Card, InputCode, Link, ShieldCheck },
    setup() {
      const code = ref("");
      const status = ref<InputCodeProps["status"]>();
      const statusText = ref<string>();
      async function check(value = code.value) {
        if (value.length < 6) {
          status.value = "error";
          statusText.value = "Enter all 6 digits";
          return;
        }
        status.value = "loading";
        statusText.value = "Checking code…";
        await new Promise((resolve) => setTimeout(resolve, 900));
        const ok = value === "123456";
        status.value = ok ? "success" : "error";
        statusText.value = ok ? "Code accepted" : "That code didn't work. Check it and try again.";
        if (!ok) code.value = "";
      }
      return { code, status, statusText, check };
    },
    template: page(`
      <Card
        title="Check it's you"
        description="Open your authenticator app and enter the code for The Keston Group."
        :heading-level="1"
        :ui="{ footer: 'justify-evenly' }"
      >
        <form class="flex flex-col gap-4" @submit.prevent="check()">
          <InputCode
            v-model="code"
            label="Code from your authenticator app"
            :status="status"
            :status-text="statusText"
            :disabled="status === 'loading'"
            class="items-center"
            @complete="check"
          />
          <Button type="submit" variant="primary" :disabled="status === 'loading'">Continue</Button>
        </form>
        <template #footer>
          <Link href="#" class="py-1 text-xs text-black/65">Use a backup code</Link>
          <Link href="#" class="py-1 text-xs text-black/65">Email me a code</Link>
        </template>
      </Card>`, "tkg"),
  }),
};

/**
 * The OAuth 2.0 consent prompt: which app is asking, who's signed in, what it
 * will get, and Allow / Cancel. Scopes the app needs are listed; the others
 * can be unticked before allowing. Allow sends the person back to the app's
 * redirect address with a code; Cancel sends them back with
 * `error=access_denied`.
 */
export const OAuthConsent: Story = {
  render: () => ({
    components: { ...consentComponents, ShieldCheck },
    setup: () => ({ ...appState(), ...useConsent() }),
    template: page(consentCard, "tkg"),
  }),
};
