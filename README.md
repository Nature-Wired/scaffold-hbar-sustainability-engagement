# Scaffold-HBAR Sustainability Engagement

A reusable Scaffold-HBAR template for discovering verified sustainability projects through the Sustainability Atlas and recording project-selection events on Hedera Consensus Service.

## What this template demonstrates

This template shows how a developer can combine:

- Scaffold-HBAR
- Sustainability Atlas project data
- the Nature Wired Hedera Guardian Agent plugin
- Hedera Consensus Service
- HashScan transaction verification

The example interaction is intentionally simple:

1. Search Sustainability Atlas projects
2. Review project metadata
3. Choose a project
4. Record that selection as an HCS message on Hedera testnet
5. Verify the transaction on HashScan

The project-selection event is non-financial and can be adapted for use cases such as fan engagement, employee programs, community participation, sponsor activations, customer engagement, or other sustainability workflows.

## Architecture

```text
User
  |
  v
Next.js frontend
  |
  +--> /api/sustainability/projects
  |       |
  |       v
  |   Nature Wired Guardian Agent plugin
  |       |
  |       v
  |   Sustainability Atlas API
  |
  +--> /api/sustainability/select
          |
          v
      Hedera SDK
          |
          v
      Hedera Consensus Service
          |
          v
      HashScan verification
```

## Hedera integration
The template uses Hedera Consensus Service to record a structured project-selection event.

Example event:
{
  "eventType": "sustainability_project_selection",
  "project": {
    "sourceTimestamp": "1740488390.511198282",
    "name": "Example Sustainability Project",
    "registryName": "Verra",
    "methodology": "VM0047"
  },
  "selectedAt": "2026-10-01T18:21:22.000Z"
}

The template writes these events to a configured HCS topic on Hedera testnet.

## Example Hedera testnet evidence

Example testnet topic:
0.0.10811399

Example successful testnet transaction:
0.0.5490832@1790878876.784110000

## Sustainability Atlas integration
Project discovery is provided through:
@nature-wired/hedera-guardian-agent-plugin

The plugin searches the Sustainability Atlas API and returns structured project data including:
- project name
- country
- registry
- developer
- methodology
- category
- sector
- lifecycle stage
- SDGs

The Atlas API key is used server-side only and is never exposed to the browser.
Requirements
- Node.js 20.18.3 or later
- Yarn 4
- Hedera testnet account
- Funded testnet HBAR balance
- Sustainability Atlas API key



