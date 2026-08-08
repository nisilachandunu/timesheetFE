# Graph Report - .  (2026-08-05)

## Corpus Check
- Corpus is ~9,175 words - fits in a single context window. You may not need a graph.

## Summary
- 102 nodes · 15 edges · 88 communities (3 shown, 85 thin omitted)
- Extraction: 93% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.65)
- Token cost: 246,651 input · 0 output

## Community Hubs (Navigation)
- Next.js Scaffold Docs (README)
- Non-Standard Next.js Rules (AGENTS/CLAUDE)
- User Profile Props
- Forgot Password Flow
- Sign-In Flow
- Change Password Flow
- Password Policy
- File Icon Asset
- Globe Icon Asset
- Next.js Logo Asset
- Vercel Logo Asset
- Window Icon Asset
- Holiday Calendar Page
- Dashboard Layout
- Dashboard Page
- Settings Page
- Timesheet Page
- Forgot Password Page
- Root Layout
- Home Page
- Sign-In Page
- Avatar Component
- Avatar Props
- Badge Component
- Badge Props
- Badge Variant Type
- Button Component
- Button Props
- Button Variant Type
- Card Component
- Card Props
- Checkbox Props
- DetailField Props
- Divider Component
- Divider Props
- Icon Component
- Icon Props
- InteractiveGlow Component
- InteractiveGlow Props
- Logo Component
- Logo Props
- MicrosoftLogo Component
- MicrosoftLogo Props
- NavItem Component
- NavItem Props
- OtpInput Props
- PasswordInput Props
- Spinner Component
- Spinner Props
- TextInput Props
- TextLink Props
- AuthLayout Component
- AuthLayout Props
- BrandingPanel Component
- ForgotPasswordForm Component
- OtpForm Props
- OtpFormContainer Component
- SsoButton Component
- SsoButton Props
- TrustBadges Component
- ValuePropList Component
- useForgotPasswordForm Hook
- useOtpVerification Hook
- useOtpVerification Options Type
- useSignInForm Hook
- TrustBadge Type
- ValueProp Type
- validateEmail Function
- validateOtp Function
- validatePassword Function
- DashboardShell Component
- DashboardShell Props
- PageHeader Component
- PageHeader Props
- Sidebar Component
- Sidebar Props
- useSidebarCollapse Hook
- NavLink Type
- AccountCard Component
- ProfileHero Component
- useChangePasswordForm Hook
- meetsPolicy Function
- PasswordRule Type
- scorePassword Function
- StrengthLevel Type
- useCountdown Hook
- useCountdownResult Type
- useDismissable Hook

## God Nodes (most connected - your core abstractions)
1. `Next.js Project (create-next-app)` - 5 edges
2. `Non-Standard Next.js Version Warning` - 4 edges
3. `UserProfile` - 3 edges
4. `ForgotPasswordFormProps` - 1 edges
5. `SignInFormProps` - 1 edges
6. `SignInCredentials` - 1 edges
7. `ForgotPasswordRequest` - 1 edges
8. `ProfileMenuProps` - 1 edges
9. `AccountCardProps` - 1 edges
10. `ChangePasswordCardProps` - 1 edges

## Surprising Connections (you probably didn't know these)
- `Non-Standard Next.js Version Warning` --semantically_similar_to--> `Next.js Project (create-next-app)`  [INFERRED] [semantically similar]
  AGENTS.md → README.md
- `CLAUDE.md @AGENTS.md Import` --references--> `Non-Standard Next.js Version Warning`  [EXTRACTED]
  CLAUDE.md → AGENTS.md
- `ForgotPasswordFormProps` --references--> `ForgotPasswordRequest`  [EXTRACTED]
  src/features/auth/components/ForgotPasswordForm/ForgotPasswordForm.tsx → src/features/auth/types/index.ts
- `SignInFormProps` --references--> `SignInCredentials`  [EXTRACTED]
  src/features/auth/components/SignInForm/SignInForm.tsx → src/features/auth/types/index.ts
- `ProfileMenuProps` --references--> `UserProfile`  [EXTRACTED]
  src/features/dashboard/components/ProfileMenu/ProfileMenu.tsx → src/features/dashboard/types.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Repo Root Documentation Set** — claude_agentsmdreference, agents_nextjsversion, readme_nextjs [INFERRED 0.75]

## Communities (88 total, 85 thin omitted)

### Community 0 - "Next.js Scaffold Docs (README)"
Cohesion: 0.40
Nodes (5): app/page.tsx, create-next-app, Geist Font via next/font, Next.js Project (create-next-app), Vercel Deployment Platform

### Community 1 - "Non-Standard Next.js Rules (AGENTS/CLAUDE)"
Cohesion: 0.50
Nodes (4): generate-agent-files.js, node_modules/next/dist/docs/, Non-Standard Next.js Version Warning, CLAUDE.md @AGENTS.md Import

### Community 2 - "User Profile Props"
Cohesion: 0.50
Nodes (4): ProfileMenuProps, UserProfile, AccountCardProps, ProfileHeroProps

## Knowledge Gaps
- **99 isolated node(s):** `HolidayCalendarPage`, `DashboardLayout`, `DashboardPage`, `SettingsPage`, `TimesheetPage` (+94 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **85 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Next.js Project (create-next-app)` connect `Next.js Scaffold Docs (README)` to `Non-Standard Next.js Rules (AGENTS/CLAUDE)`?**
  _High betweenness centrality (0.004) - this node is a cross-community bridge._
- **Why does `Non-Standard Next.js Version Warning` connect `Non-Standard Next.js Rules (AGENTS/CLAUDE)` to `Next.js Scaffold Docs (README)`?**
  _High betweenness centrality (0.004) - this node is a cross-community bridge._
- **What connects `HolidayCalendarPage`, `DashboardLayout`, `DashboardPage` to the rest of the system?**
  _99 weakly-connected nodes found - possible documentation gaps or missing edges._