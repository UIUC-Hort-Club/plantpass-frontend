# PlantPass Frontend

<img src="/public/plantpass_logo_transp.png" alt="PlantPass Banner" />

A comprehensive point-of-sale React application for plant sales with real-time inventory management, transaction tracking, and sales analytics.

## Features

- 🛒 Order entry and management
- 📊 Sales analytics and reporting
- 💳 Multiple payment methods
- 🎫 Discount and voucher support
- 📧 Email receipt collection
- 🔒 Role-based access control (Admin/Staff)
- 🔄 Real-time updates via WebSocket
- 📱 Responsive design

## Tech Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **UI Library**: Material-UI (MUI)
- **Routing**: React Router
- **Charts**: Chart.js
- **Testing**: Vitest + React Testing Library
- **Code Quality**: ESLint + Prettier

## Prerequisites

- Node.js 20+
- npm or yarn

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The development server will start at `http://localhost:5173`.

### Build

```bash
npm run build
```

Builds the app for production to the `dist/` directory.

### Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

### Linting

```bash
npm run lint
```

### Everything at once

```bash
npm run check    # lint, tests with coverage, typecheck, production build
```

Working with an AI agent, or new to the codebase: start with `AGENTS.md`.
Product docs, the roadmap and the agent skills live in the
[plantpass-backend](https://github.com/UIUC-Hort-Club/plantpass-backend) repo.

## Environment Configuration

The app reads `window.APP_CONFIG` from `public/config.js` at load. The deploy
workflow overwrites that file with the production URLs.

**The committed `public/config.js` points at the production API.** Running
`npm run dev` and submitting a form writes to the real sale data. There is no
local or staging backend yet.

## Project Structure

```
plantpass-frontend/
├── src/
│   ├── api/              # API client and endpoints
│   ├── components/       # React components
│   │   ├── Home/         # Home screen
│   │   ├── PlantPass/    # Staff checkout interface
│   │   ├── CustomerOrderLookup/  # Customer order lookup
│   │   ├── AdminConsole/ # Admin management
│   │   ├── core/         # Core order components
│   │   ├── Navigation/   # Navigation components
│   │   └── common/       # Shared components
│   ├── contexts/         # React contexts
│   ├── hooks/            # Custom hooks
│   ├── types/            # TypeScript definitions
│   ├── utils/            # Utility functions
│   ├── App.tsx           # Main app component
│   └── main.tsx          # Entry point
├── public/               # Static assets
├── tests/                # Test files
└── package.json
```

## Application Routes

- `/` - Home screen with role selection
- `/plantpass` - Staff checkout interface (passphrase protected)
- `/orders` - Customer order lookup
- `/admin-console` - Admin management console (password protected)

## Backend Repository

This frontend connects to the PlantPass backend API. See the [plantpass-backend](https://github.com/UIUC-Hort-Club/plantpass-backend) repository for:
- Lambda functions
- Infrastructure (Terraform)
- API documentation

## Deployment

Deployment is automated via GitHub Actions. The workflow:
1. Runs tests and linting
2. Builds the production bundle
3. Deploys to AWS S3
4. Invalidates CloudFront cache

See `.github/workflows/deploy-frontend.yaml` for details.

## Contributing

1. Create a feature branch
2. Write tests for new functionality
3. Ensure all tests pass: `npm test`
4. Ensure linting passes: `npm run lint`
5. Submit a pull request

## License

Proprietary - All rights reserved

## Contact

Joseph (Joe) Ku  
Email: josephku825@gmail.com
