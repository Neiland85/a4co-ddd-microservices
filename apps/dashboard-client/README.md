# A4CO User Dashboard

Modern, dynamic dashboard for young users (16-30 years) with social features, gamification, and free tools.

## Features

- 🎮 **Gamification**: Daily missions, XP system, and level progression
- 🎟️ **Raffles**: Participate in raffles for music, cinema, and theater events
- 💬 **Forum**: Reddit-style forum with categories and reactions
- 🛠️ **Free Tools**: Video compressor, image compressor, and audio extractor
- 👤 **User Profile**: Customizable profile with social links
- 🎉 **Events**: Personalized event recommendations

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **UI**: React 19, TailwindCSS, Radix UI
- **Animations**: Anime.js, Framer Motion
- **State Management**: Zustand
- **Data Fetching**: TanStack React Query
- **Type Safety**: TypeScript (strict mode)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) to see the dashboard.

### Build for Production

```bash
npm run build
npm run start
```

## Project Structure

```
apps/dashboard-client/
├── app/                    # Next.js App Router
│   └── (dashboard)/       # Dashboard routes
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── home/             # Home module
│   ├── sorteos/          # Raffles module
│   ├── foro/             # Forum module
│   ├── herramientas/     # Tools module
│   └── perfil/           # Profile module
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities and constants
├── store/                 # Zustand stores
└── types/                 # TypeScript type definitions
```

## Documentation

See [USER_DASHBOARD_ARCHITECTURE.md](../../docs/USER_DASHBOARD_ARCHITECTURE.md) for complete architecture and design specifications.

## License

Apache-2.0
