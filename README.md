# Fitness Tracking Application

A comprehensive fitness tracking application designed to provide an immersive and interactive user experience across web and mobile platforms, focusing on workout management, nutrition tracking, and user motivation.

## Features

- **Workout Management**: Browse and select from various workout categories (strength, cardio, flexibility, HIIT)
- **AI-powered Recommendations**: Get personalized workout recommendations based on your fitness level
- **Progress Tracking**: Track your workout history and fitness progress over time
- **Nutrition Monitoring**: Log meals and monitor nutritional intake
- **Cross-Platform**: Works on web and iOS devices using Capacitor

## Tech Stack

- **Frontend**: React with TypeScript
- **Styling**: Tailwind CSS for responsive design
- **Backend**: Express.js
- **Mobile**: Capacitor for cross-platform deployment
- **Database**: PostgreSQL with Drizzle ORM
- **State Management**: React Query for server state

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm (v7 or later)
- Xcode (for iOS development)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/your-username/fitness-tracking-app.git
   cd fitness-tracking-app
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the development server
   ```bash
   npm run dev
   ```

4. Build for iOS
   ```bash
   npm run build
   npx cap sync ios
   ```

5. Open in Xcode
   ```bash
   npx cap open ios
   ```

## Project Structure

- `client/`: Frontend React application
- `server/`: Express.js backend
- `shared/`: Shared types and utilities
- `ios/`: iOS application files

## License

[MIT](LICENSE)