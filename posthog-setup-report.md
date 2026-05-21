<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Rise Social frontend (Nuxt 4). The `@posthog/nuxt` module was installed and configured with the EU PostHog host. Ten events are now tracked across seven files covering the core user journey: authentication (sign-up, login, logout with identity management), the academy purchase funnel (view → checkout → payment initiation → completion/failure), job opportunity engagement, and account settings updates. Error tracking is enabled automatically via `capture_exceptions: true` on the client and `enableExceptionAutocapture: true` on the server.

| Event | Description | File |
|---|---|---|
| `user_signed_up` | User successfully creates a new account. Calls `posthog.identify()` with user ID and email. | `app/pages/register.vue` |
| `user_logged_in` | User successfully logs in. Calls `posthog.identify()` with user ID and email. | `app/pages/login.vue` |
| `user_logged_out` | User clicks Logout. Calls `posthog.reset()` to clear identity. | `app/components/AppHeader.vue` |
| `academy_viewed` | User views an academy detail page — top of the purchase funnel. Properties: `academy_id`, `academy_slug`, `academy_title`, `academy_category`. | `app/pages/academy/[slug]/index.vue` |
| `academy_checkout_started` | User lands on the payment page (equivalent to InitiateCheckout). Properties: `academy_id`, `pricing_id`, `pricing_name`, `price`. | `app/pages/academy/[slug]/payment.vue` |
| `academy_payment_initiated` | User submits the customer details form and Midtrans Snap opens. Properties: `academy_id`, `pricing_id`, `price`, `transaction_code`. | `app/pages/academy/[slug]/payment.vue` |
| `academy_payment_completed` | Midtrans reports a successful payment. Properties: `academy_id`, `pricing_id`, `price`, `currency`, `transaction_code`. | `app/pages/academy/[slug]/payment.vue` |
| `academy_payment_failed` | Midtrans reports a failed payment. Properties: `academy_id`, `pricing_id`, `transaction_code`, `error_message`. | `app/pages/academy/[slug]/payment.vue` |
| `job_apply_clicked` | User clicks "Apply Now" on a job detail page. Properties: `job_id`, `job_title`, `company_name`, `employment_type`, `seniority_level`. | `app/pages/opportunities/[company_name]/[job_name].vue` |
| `account_settings_updated` | User successfully saves their account settings. Properties: `avatar_changed`. | `app/pages/dashboard/setting/index.vue` |

## Next steps

We've built a dashboard and five insights for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](https://eu.posthog.com/project/178331/dashboard/697449)
- [User Sign-ups & Logins](https://eu.posthog.com/project/178331/insights/5HnAMhQH) — daily trend of new registrations and logins
- [Academy Checkout Funnel](https://eu.posthog.com/project/178331/insights/O2xOE7QX) — 4-step conversion funnel: viewed → checkout started → payment initiated → payment completed
- [Academy Payment Outcomes](https://eu.posthog.com/project/178331/insights/m0Y85syO) — completed vs failed payments over time
- [Job Apply Clicks](https://eu.posthog.com/project/178331/insights/IaCTfTUC) — how often users engage with job listings
- [User Churn Signal — Logout Rate](https://eu.posthog.com/project/178331/insights/dt4EiZEe) — logouts vs sign-ups; a rising ratio signals churn risk

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nuxt-4/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
