# Architecture

## Application shape
Use a modular monolith. Next.js App Router renders the web application and handles web-specific server actions and route handlers. Tailwind CSS owns design tokens and responsive layout. Supabase provides PostgreSQL, Auth, and Storage. Add separate services only when a measured need calls for them.

Organize code by product capability: identity, curriculum, learning, assessment, teaching, family, school administration, and insights.

## Identity and access
Supabase Auth is the identity provider and JWT issuer. The web app uses cookie-based sessions through the Supabase SSR integration. Keep profiles separate from role assignments. One person may have multiple roles and memberships. Self-registration may request student, teacher, or parent access; teacher and parent requests start pending. Only an admin may grant admin access or approve elevated roles.

Enable row-level security for every exposed table. Keep service-role credentials server-side only.

## Tenancy and learning data
The schema has schools, school memberships, and guardian-to-student links from the beginning. Global curriculum content is separate from school membership data. Keep activity as durable history and derive dashboard summaries from it.

## AI boundary
Route AI calls through server-side functions. Enforce user and school permissions before passing learner context or content to a model. Keep the provider replaceable. Build recommendations and exam predictions only after enough quality data exists to evaluate them.

## Visual system
Use Ghana-inspired red, gold, and green as accents, with forest green for primary actions, warm gold for highlights, and red sparingly. Use warm neutral surfaces and readable dark text. Do not rely on color alone. Support reduced motion; keep sound optional and off by default.
