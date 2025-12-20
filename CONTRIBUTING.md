# Contributing to Blob

Thank you for your interest in contributing to Blob! This guide will help you get started, even if you're new to open source or programming.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Environment Setup](#development-environment-setup)
- [Running the Project Locally](#running-the-project-locally)
- [Making Changes](#making-changes)
- [Submitting Your Contribution](#submitting-your-contribution)
- [Code Style Guidelines](#code-style-guidelines)
- [Troubleshooting](#troubleshooting)
- [Getting Help](#getting-help)

## Getting Started

### What You'll Need

Before you start, make sure you have these tools installed:

1. **Git** - For version control
   - Download: https://git-scm.com/downloads
   - Check if installed: `git --version`

2. **Node.js** (version 18 or higher) - JavaScript runtime
   - Download: https://nodejs.org/ (download the LTS version)
   - Check if installed: `node --version`

3. **pnpm** (version 8 or higher) - Package manager
   - Install: `npm install -g pnpm`
   - Check if installed: `pnpm --version`

4. **Expo Go** - Mobile app for testing
   - iOS: https://apps.apple.com/app/expo-go/id982107779
   - Android: https://play.google.com/store/apps/details?id=host.exp.exponent
   - Install this on your phone!

5. **Code Editor** - We recommend Neovim
   - Download: https://neovim.io/

### Optional Tools

- **GitHub Desktop** - If you prefer a GUI for Git: https://desktop.github.com/
- **Wrangler CLI** - For Cloudflare Workers (installed automatically with dependencies)

## Development Environment Setup

### Step 1: Fork and Clone the Repository

1. **Fork the repository**
   - Go to https://github.com/opencodeiiita/blob
   - Click the "Fork" button in the top right
   - This creates a copy of the project in your GitHub account

2. **Clone your fork**
   ```bash
   git clone https://github.com/opencodeiiita/blob.git
   cd blob
   ```

### Step 2: Install Dependencies

```bash
pnpm install
```

This command will install all the necessary packages for the project. It might take a few minutes.

### Step 3: Set Up Environment Variables

#### For the API (Backend)

1. Navigate to the API directory:

   ```bash
   cd apps/api
   ```

2. Create a `.env` file (copy from the example):

   ```bash
   cp .env.example .env
   ```

3. Edit `apps/api/.env` and add your configuration:

   ```env
   # Database connection
   DATABASE_URL="your-neon-postgres-connection-string"

   # Cloudflare Workers (optional for local dev)
   # CLOUDFLARE_ACCOUNT_ID="your-account-id"
   # CLOUDFLARE_API_TOKEN="your-api-token"
   ```

   **Getting a Neon Postgres database:**
   - Sign up at https://neon.tech (free tier available)
   - Create a new project
   - Copy the connection string

#### For the Mobile App

1. Navigate to the mobile directory:

   ```bash
   cd apps/mobile
   ```

2. Create a `.env` file:

   ```bash
   cp .env.example .env
   ```

3. The app will automatically detect your local API server, so you don't need to configure anything for local development!

### Step 4: Configure Your Firewall

**IMPORTANT**: You need to allow these ports through your firewall for the app to work:

- **Port 8081** - Expo development server
- **Port 8787** - API server (Hono/Cloudflare Workers)

#### Windows Firewall

1. Open "Windows Defender Firewall"
2. Click "Advanced settings"
3. Click "Inbound Rules" → "New Rule"
4. Select "Port" → Next
5. Enter "8081, 8787" → Next
6. Select "Allow the connection" → Next
7. Check all network types → Next
8. Name it "Blob Development" → Finish

#### macOS Firewall

macOS typically allows local network connections by default. If you have issues:

1. Go to System Preferences → Security & Privacy → Firewall
2. Click "Firewall Options"
3. Ensure Node and Expo are allowed

#### Linux (ufw)

```bash
sudo ufw allow 8081
sudo ufw allow 8787
```

#### Linux (firewalld)

```bash
sudo firewall-cmd --permanent --add-port=8081/tcp
sudo firewall-cmd --permanent --add-port=8787/tcp
sudo firewall-cmd --reload
```

### Step 5: Database Setup

Run database migrations to set up your local database:

```bash
cd apps/api
pnpm db:push
```

This creates all the necessary tables in your Neon Postgres database.

## Running the Project Locally

You'll need to run both the API server and the mobile app at the same time. turbo handles it for you, say thanks to turbo:

```bash
pnpm dev
```

### Testing on Your Phone

1. Open **Expo Go** app on your phone
2. Make sure your phone is on the **same Wi-Fi network** as your computer
3. Scan the QR code:
   - **iOS**: Use the Camera app
   - **Android**: Use the Expo Go app to scan

The app should load on your phone! Any changes you make to the code will automatically reload.

### Testing on Emulator/Simulator

If you prefer to use an emulator instead of your phone:

**Android Emulator:**

```bash
# In the mobile terminal, press 'a'
```

**iOS Simulator (Mac only):**

```bash
# In the mobile terminal, press 'i'
```

## Making Changes

### Understanding the Project Structure

```
blob/
├── apps/
│   ├── api/                 # Backend API server
│   │   ├── src/
│   │   │   └── index.ts    # Main API entry point
│   │   └── wrangler.jsonc  # Cloudflare Workers config
│   │
│   └── mobile/             # Mobile app
│       ├── app/            # App screens (file-based routing)
│       ├── components/     # Reusable UI components
│       ├── providers/      # React context providers
│       ├── store/          # State management (Zustand)
│       └── utils/          # Helper functions
│
├── packages/
│   └── trpc/              # Shared API types and router
│       ├── src/
│       │   ├── router.ts  # API route definitions
│       │   ├── server.ts  # tRPC server setup
│       │   └── client.ts  # tRPC client setup
│
└── docs/                  # Documentation
```

### Common Development Tasks

#### Adding a New API Endpoint

1. Open `packages/trpc/src/router.ts`
2. Add your new route:

```typescript
export const appRouter = router({
  // Existing routes...

  // Your new route
  createFlashcard: publicProcedure
    .input(
      z.object({
        topic: z.string(),
        content: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      // Your logic here
      return { success: true, id: "123" };
    }),
});
```

3. The route is now available in the mobile app automatically!

#### Using the New API in the Mobile App

```typescript
import { trpc } from '@/providers/trpc';

export default function MyScreen() {
  const createFlashcard = trpc.createFlashcard.useMutation();

  const handleCreate = async () => {
    const result = await createFlashcard.mutateAsync({
      topic: 'Math',
      content: 'What is 2+2?',
    });
    console.log(result);
  };

  return (
    <Button onPress={handleCreate}>
      Create Flashcard
    </Button>
  );
}
```

#### Adding a New Screen

1. Create a new file in `apps/mobile/app/`:

   ```typescript
   // apps/mobile/app/flashcards.tsx
   import { View, Text } from 'react-native';

   export default function FlashcardsScreen() {
     return (
       <View>
         <Text>Flashcards</Text>
       </View>
     );
   }
   ```

2. Navigate to it from another screen:

   ```typescript
   import { router } from 'expo-router';

   <Button onPress={() => router.push('/flashcards')}>
     Go to Flashcards
   </Button>
   ```

#### Adding a New Component

Create components in `apps/mobile/components/`:

```typescript
// apps/mobile/components/FlashCard.tsx
import { View, Text } from 'react-native';

interface FlashCardProps {
  question: string;
  answer: string;
}

export function FlashCard({ question, answer }: FlashCardProps) {
  return (
    <View>
      <Text>{question}</Text>
      <Text>{answer}</Text>
    </View>
  );
}
```

#### Database Changes

1. Edit your schema in `apps/api/src/db/schema.ts` (you'll need to create this)
2. Run migrations:
   ```bash
   cd apps/api
   pnpm db:push
   ```

## Submitting Your Contribution

### Step 1: Create a Branch

Always create a new branch for your changes:

```bash
git checkout -b feature/your-feature-name
```

Branch naming conventions:

- `feature/` - New features (e.g., `feature/add-flashcards`)
- `fix/` - Bug fixes (e.g., `fix/login-error`)
- `docs/` - Documentation changes (e.g., `docs/update-readme`)

### Step 2: Make Your Changes

- Write clean, readable code
- Test your changes thoroughly
- Follow the code style guidelines below

### Step 3: Commit Your Changes

```bash
git add .
git commit -m "Add flashcard generation feature"
```

Commit message guidelines:

- Use present tense ("Add feature" not "Added feature")
- Be descriptive but concise
- Start with a verb (Add, Fix, Update, Remove, etc.)

Good examples:

- "Add flashcard generation with AI"
- "Fix login button not responding"
- "Update README with setup instructions"

### Step 4: Push Your Changes

```bash
git push origin feature/your-feature-name
```

### Step 5: Create a Pull Request

1. Go to your fork on GitHub
2. Click "Compare & pull request"
3. Fill out the PR template:
   - Describe what changes you made
   - Explain why you made them
   - Add screenshots if you changed the UI

4. Make sure to add the issue number by adding `issue: #<issue-number>`, real world doesn't work that way it's just opencode's protocols for points distribution.
5. Create pull request

### Step 6: Code Review

- A maintainer will review your code
- They might suggest changes
- Make any requested changes and push them to your branch
- Once approved, your code will be merged!

## Code Style Guidelines

### General Principles

- **Be consistent** - Follow the existing code style
- **Be clear** - Use descriptive variable and function names
- **Be simple** - Don't over-complicate things
- **Comment when necessary** - Explain "why", not "what"

### TypeScript

```typescript
// Good: Descriptive names, proper types
interface FlashcardData {
  question: string;
  answer: string;
  difficulty: "easy" | "medium" | "hard";
}

async function generateFlashcard(topic: string): Promise<FlashcardData> {
  // Implementation
}

// Bad: Unclear names, missing types
function gen(t: any): any {
  // Implementation
}
```

### React Components

```typescript
// Good: Props interface, functional component
interface ButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
}

export function Button({ title, onPress, disabled = false }: ButtonProps) {
  return (
    <Pressable onPress={onPress} disabled={disabled}>
      <Text>{title}</Text>
    </Pressable>
  );
}

// Bad: No types, unclear purpose
export function Btn(props: any) {
  return <Pressable onPress={props.p}><Text>{props.t}</Text></Pressable>;
}
```

### Naming Conventions

- **Variables & Functions**: `camelCase` (e.g., `generateFlashcard`)
- **Components**: `PascalCase` (e.g., `FlashCard`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `MAX_FLASHCARDS`)
- **Files**: Match the export (e.g., `FlashCard.tsx` for `FlashCard` component)

### File Organization

```typescript
// 1. Imports - external first, then internal
import React from 'react';
import { View, Text } from 'react-native';

import { Button } from '@/components/Button';
import { trpc } from '@/providers/trpc';

// 2. Types/Interfaces
interface MyComponentProps {
  title: string;
}

// 3. Component
export function MyComponent({ title }: MyComponentProps) {
  // 4. Hooks
  const [state, setState] = React.useState('');

  // 5. Event handlers
  const handlePress = () => {
    setState('pressed');
  };

  // 6. Render
  return (
    <View>
      <Text>{title}</Text>
      <Button onPress={handlePress} />
    </View>
  );
}
```

### Formatting

We use Prettier for code formatting. It runs automatically before commits.

To format manually:

```bash
pnpm format
```

To check formatting:

```bash
pnpm format:check
```

## Troubleshooting

### Common Issues

#### "Cannot connect to API"

1. Make sure the API server is running (`cd apps/api && pnpm dev`)
2. Check that ports 8081 and 8787 are open in your firewall
3. Ensure your phone and computer are on the same Wi-Fi network
4. Try restarting both servers

#### "Module not found" Error

```bash
# Clear all caches and reinstall
rm -rf node_modules
rm -rf apps/*/node_modules
rm pnpm-lock.yaml
pnpm install
```

#### Expo Go App Won't Load

1. Make sure you're on the same Wi-Fi network
2. Try scanning the QR code again
3. Check if your firewall is blocking the connection
4. Restart the Expo development server (press `r` in the terminal)
5. Contact `@07calc`

#### Database Connection Error

1. Check your `DATABASE_URL` in `apps/api/.env`
2. Make sure your Neon database is running
3. Try running migrations again: `pnpm db:push`

#### TypeScript Errors

```bash
# Rebuild types
cd packages/trpc
pnpm build
```

#### Port Already in Use

If you see "port 8787 already in use":

```bash
# Find and kill the process (Mac/Linux)
lsof -ti:8787 | xargs kill -9

# Windows
netstat -ano | findstr :8787
taskkill /PID <PID> /F
```

### Getting Debug Information

If you're stuck, gather this information when asking for help:

```bash
# System info
node --version
pnpm --version
git --version

# Error logs
cd apps/api
pnpm dev > api-error.log 2>&1

cd apps/mobile
pnpm start > mobile-error.log 2>&1
```

## Getting Help

- **Questions?** Open a [Discussion](https://github.com/opencodeiiita/blob/discussions)
- **Found a bug?** Open an [Issue](https://github.com/opencodeiiita/blob/issues)
- **Want to chat?** Join [opencodeiiita community](https://discord.gg/jnHGrDQu)

## Code of Conduct

Be kind, respectful, and inclusive. We're all here to learn and build something great together.

## Contributors

Thank you to all our contributors!

## License

By contributing to Blob, you agree that your contributions will be licensed under the MIT License.

---

**Happy coding!** Remember, everyone was a beginner once. Don't be afraid to ask questions or make mistakes - that's how we all learn!
