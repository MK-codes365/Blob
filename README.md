> This Document is partially made by AI, if you find any issues, please fit it.

# Blob - AI-Powered Study Tool

> An open-source mobile app that transforms your study materials into interactive flashcards, mind maps, and quizzes using AI.

## What is Blob?

Blob is a study companion app that helps students learn more effectively. Simply provide a syllabus, topic, subject, or course content, and Blob's AI will automatically generate:

- **Flashcards** - For memorization and quick recall
- **Mind Maps** - For visualizing connections between concepts
- **Quizzes** - For testing your knowledge

### Privacy-First: Bring Your Own API Key (BYOK)

Blob uses a "Bring Your Own API Key" model, meaning you use your own AI service API key (like OpenAI, Anthropic, etc.). This ensures:

- You control your data
- You only pay for what you use

## Quick Start

New to coding? No problem! Check out our [CONTRIBUTING.md](./CONTRIBUTING.md) for a step-by-step guide to getting started.

### Prerequisites

Before you begin, make sure you have:

- Node.js 18+ installed ([Download here](https://nodejs.org/))
- pnpm installed (Run: `npm install -g pnpm`)
- Expo Go app on your phone ([iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))

### Installation

1. Clone the repository:

```bash
git clone https://github.com/opencodeiiita/blob.git
cd blob
```

2. Install dependencies:

```bash
pnpm install
```

3. Start developing! See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed setup instructions.

## Project Structure

```
blob/
├── apps/
│   ├── api/          # Hono API server with tRPC (Cloudflare Workers)
│   └── mobile/       # Expo React Native mobile app
├── packages/
│   └── trpc/         # Shared tRPC configuration
├── docs/             # Documentation
└── scripts/          # Utility scripts
```

## Tech Stack

This project uses modern, industry-standard technologies:

- **API Server**: Hono + Cloudflare Workers (serverless backend)
- **Mobile App**: Expo + React Native (cross-platform iOS/Android)
- **RPC Layer**: tRPC v11 (type-safe API calls)
- **Database**: Drizzle ORM + Neon Postgres (serverless SQL database)
- **UI Components**: Tamagui (universal design system)
- **Validation**: Zod (runtime type checking)
- **State Management**: Zustand (simple state management)
- **Monorepo**: Turborepo + pnpm workspaces

## Contributing

We welcome contributions from developers of all skill levels! Whether you're fixing a typo, adding a feature, or improving documentation, your help is appreciated.

Please read our [CONTRIBUTING.md](./CONTRIBUTING.md) for:

- Development environment setup
- How to run the project locally
- Code style guidelines
- How to submit pull requests

## Support

- **Issues**: Found a bug? [Open an issue](https://github.com/opencodeiiita/blob/issues)
- **Discussions**: Have questions? [Start a discussion](https://github.com/opencodeiiita/blob/discussions)
- **Discord**: Join [opencodeiiita community](https://discord.gg/jnHGrDQu)

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## Ownership

This project is owned and maintained by individual contributors.
The hosting GitHub organization claims no ownership,
copyright, or control over this repository.
