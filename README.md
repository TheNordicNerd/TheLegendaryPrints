[![Website](https://img.shields.io/badge/TheNordicNerd-Website-0f172a)](https://thenordicnerd.com/products/the-nordic-base)

✨ What This Starter Includes
Core Stack

Nuxt 4

TypeScript

Vite

Nitro (Server Routes & APIs)

Styling & UI

Tailwind CSS

Nuxt Icon

Nuxt Image

Nuxt Fonts

State & Utilities

Pinia (auto-imports via app/stores)

VueUse composables

SEO & Performance

Nuxt SEO

Robots.txt

OG image ready

Optimized image handling

Security & Quality

Nuxt Security (HTTP headers, CSP)

ESLint (Nuxt-aware)

Nuxt DevTools

📁 Project Structure (Nuxt 4)
app/
components/ # Reusable UI components
composables/ # Shared logic
layouts/ # App layouts
pages/ # Routes
stores/ # Pinia stores (auto-imported)
assets/ # Styles, images, fonts

server/
api/ # Server endpoints
middleware/ # Server middleware
routes/ # Advanced server routing

public/

# Static assets

This structure is intentionally consistent so every Nordic Nerd project feels identical to work in.

🚀 Getting Started

1. Clone the repo
   git clone https://github.com/TheNordicNerd/TheNordicBase.git
   cd TheNordicBase

2. Install dependencies
   npm install

# or

pnpm install

3. Start development
   npm run dev

🔁 Using This as a Client Template

Follow this exact flow for every new project:

1. Clone & rename
   git clone https://github.com/TheNordicNerd/TheNordicBase.git client-project-name
   cd client-project-name

2. Reset git history
   rm -rf .git
   git init
   git add .
   git commit -m "Initial commit from TheNordicBase"

3. Update project metadata

package.json

name

description

nuxt.config.ts

siteUrl

SEO defaults

.env (if applicable)

4. Push to client repo
   git remote add origin https://github.com/client/client-project.git
   git push -u origin main

🧩 Optional Modules (Add Per Project)

Only install these when the project needs them:

Content / Blogs
npx nuxi module add content
npx nuxi module add og-image

Auth / Database
npx nuxi module add supabase

Payments
npx nuxi module add stripe

Accessibility & Performance
npx nuxi module add a11y
npx nuxi module add hints
npx nuxi module add scripts

⚠️ This repo intentionally avoids installing everything by default.
Add only what the project actually needs.

🔐 Environment Variables

This starter is pre-wired for SaaS use cases.

Example .env:

NUXT_PUBLIC_SITE_URL=https://example.com

SUPABASE_URL=
SUPABASE_ANON_KEY=

STRIPE_SECRET_KEY=
STRIPE_PUBLIC_KEY=

🧠 Philosophy

This template is built around these principles:

Consistency over customization

Performance first

SEO is not optional

Security by default

Minimal bloat

Fast onboarding for any developer

Every project should:

Feel familiar on day one

Scale without refactoring

Be production-ready from the start

🛠 Maintained By

The Nordic Nerd
Creative Engineering & Modern Web Systems

This repository evolves as Nuxt evolves.
Updates are intentional, opinionated, and battle-tested.

📌 Internal Notes (Optional – remove for clients)

This repo is the base for:

Client websites

SaaS MVPs

Internal tools

Keep this repo clean

Never add client-specific logic here

Prefer composables over plugins

Prefer modules over custom implementations
