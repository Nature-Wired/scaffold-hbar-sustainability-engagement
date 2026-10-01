# Agent instructions

Guidance for coding agents working on the Scaffold-HBAR Sustainability Engagement template.

This repository is a Scaffold-HBAR application that combines:

- Next.js App Router
- Hardhat
- Yarn workspaces
- Sustainability Atlas project discovery
- `@nature-wired/hedera-guardian-agent-plugin`
- Hedera Consensus Service
- HashScan testnet verification

## Core user flow

The template demonstrates a simple non-financial sustainability engagement workflow:

1. Search Sustainability Atlas projects.
2. Review structured project metadata.
3. Choose a project.
4. Record the project selection as a Hedera Consensus Service message.
5. Return a HashScan link for transaction verification.

Keep this flow simple and reusable. Do not turn the template into a full marketplace, funding application, token system, or campaign-management platform.

## Project layout

Frontend:

    packages/nextjs

Sustainability Atlas search API:

    packages/nextjs/app/api/sustainability/projects/route.ts

Hedera project-selection API:

    packages/nextjs/app/api/sustainability/select/route.ts

Main user interface:

    packages/nextjs/app/page.tsx

Hardhat package:

    packages/hardhat

Template manifest:

    template.json

Environment example:

    packages/nextjs/.env.example

## Sustainability Atlas integration

Project discovery uses:

    @nature-wired/hedera-guardian-agent-plugin

The plugin connects to the Sustainability Atlas API and returns project metadata such as:

- project name
- country
- registry
- developer
- methodology
- category
- sector
- lifecycle stage
- SDGs

Atlas credentials must remain server-side.

Never expose `ATLAS_API_KEY` to browser code.

## Hedera integration

Project selections are recorded through Hedera Consensus Service.

The selection API submits a structured event with the event type:

    sustainability_project_selection

The configured HCS topic ID is read from:

    HCS_TOPIC_ID

The Hedera operator account and private key are used server-side only.

Never expose or commit:

    HEDERA_PRIVATE_KEY

The current template targets Hedera testnet.

## Environment variables

Local configuration is stored in:

    packages/nextjs/.env.local

Use:

    packages/nextjs/.env.example

as the variable-name reference.

Expected variables:

    ATLAS_API_KEY
    ATLAS_API_URL
    HEDERA_ACCOUNT_ID
    HEDERA_PRIVATE_KEY
    HEDERA_NETWORK
    HCS_TOPIC_ID

Never commit `.env.local` or real credential values.

## Package manager

Use Yarn.

Do not introduce npm lockfiles.

Install dependencies with:

    yarn install

## Development commands

Frontend development:

    yarn next:dev

Lint:

    yarn lint

Format:

    yarn next:format

Next.js production build:

    yarn next:build

Hardhat compile:

    yarn hardhat:compile

## Validation expectations

Before completing changes, run:

    yarn lint
    yarn next:build
    yarn hardhat:compile

For changes to Sustainability Atlas search, verify that a query returns structured project data.

For changes to project selection, verify that:

1. the HCS submission succeeds on testnet,
2. a transaction ID is returned,
3. the HashScan testnet link resolves to a successful `SUBMIT MESSAGE` transaction.

## Frontend conventions

Use the existing Scaffold-HBAR and DaisyUI conventions.

Prefer DaisyUI classes where appropriate.

App Router pages live under:

    packages/nextjs/app

Use `"use client"` only when React hooks or browser behavior require it.

Prefer TypeScript `type` declarations over `interface` unless there is a specific reason otherwise.

## Scope boundaries

Keep the template generic and developer-oriented.

Appropriate extensions include:

- richer Sustainability Atlas search
- project detail views
- additional structured HCS metadata
- campaign IDs
- venue or engagement context
- better HashScan verification UX

Avoid adding unnecessary complexity such as:

- financial transfers
- token economics
- NFT rewards
- project purchasing
- carbon-credit procurement
- wallet requirements for end users
- full sponsor dashboards

The template should remain a clear reusable example of verified project discovery plus auditable project selection on Hedera.
