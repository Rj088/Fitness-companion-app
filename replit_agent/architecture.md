# Architecture Overview

## 1. Overview

This is a full-stack fitness application designed to help users track workouts, meals, weight, and fitness progress. The application is built as a hybrid mobile app (with iOS support) while maintaining a web interface. It follows a client-server architecture with a shared schema between frontend and backend.

The application includes features such as:
- User authentication
- Workout tracking
- Meal/nutrition logging
- Activity monitoring
- Weight logging
- Mobile device features (camera, geolocation, notifications)

## 2. System Architecture

The system follows a modern full-stack architecture with the following layers:

```
┌─────────────────┐
│  Mobile Client  │  iOS app built with Capacitor
└────────┬────────┘
         │
┌────────▼────────┐
│  Web Frontend   │  React-based SPA with Tailwind CSS
└────────┬────────┘
         │
┌────────▼────────┐
│  Express Server │  Node.js backend handling API requests
└────────┬────────┘
         │
┌────────▼────────┐
│    Database     │  PostgreSQL with Drizzle ORM
└─────────────────┘
```

### Client-Server Communication

The application uses a RESTful API for communication between the client and server. The server exposes endpoints for managing users, workouts, meals, activities, and weight logs. The frontend communicates with these endpoints to perform CRUD operations.

## 3. Key Components

### 3.1 Frontend (Client)

**Technologies:**
- React for UI rendering
- Tailwind CSS for styling
- Shadcn UI components (Radix UI under the hood)
- React Hook Form for form management
- Zod for validation
- Capacitor for native mobile functionality

The frontend is organized to support both web and mobile views, with responsive design implemented through Tailwind CSS. The UI components are built using Radix UI primitives via the shadcn/ui approach.

### 3.2 Backend (Server)

**Technologies:**
- Node.js with Express for the web server
- Drizzle ORM for database interactions
- PostgreSQL for data storage
- Zod for validation

The server follows a conventional Express.js structure:
- `server/index.ts`: Entry point for the Express application
- `server/routes.ts`: API route definitions
- `server/storage.ts`: Data access layer using Drizzle ORM
- `server/vite.ts`: Development server configuration

### 3.3 Database Schema

The database schema (defined in `shared/schema.ts`) includes the following main entities:

- **Users**: Store user profiles, authentication info, and fitness goals
- **Workouts**: Pre-defined workout templates
- **UserWorkouts**: Track completed workouts by users
- **Foods**: Nutritional information for food items
- **UserMeals**: Track user's food consumption
- **Activities**: Track user's physical activities
- **WeightLogs**: Record user's weight changes over time

The schema is defined using Drizzle ORM and shared between frontend and backend, ensuring type safety across the stack.

### 3.4 Authentication

The application implements a custom authentication system using:
- Username/password authentication
- Password hashing with scrypt and salt
- Timing-safe comparison for password verification

## 4. Data Flow

### 4.1 API Request Flow

1. Client makes a request to the server API
2. Server validates the request data using Zod schemas
3. Server performs database operations using the storage interface
4. Server returns a response to the client
5. Client updates UI based on the response

### 4.2 Mobile Native Features

The application integrates several mobile-specific features through Capacitor:
- Camera access for workout photos
- Geolocation for tracking outdoor workouts
- Local notifications for workout reminders
- Device motion for activity tracking

## 5. External Dependencies

### 5.1 Frontend Dependencies

- **@capacitor/**: Native mobile functionality
- **@radix-ui/**: UI component primitives
- **@hookform/resolvers**: Form validation
- **zod**: Schema validation

### 5.2 Backend Dependencies

- **Express**: Web server framework
- **Drizzle ORM**: Database ORM
- **@neondatabase/serverless**: PostgreSQL client
- **zod**: Schema validation

## 6. Deployment Strategy

The application is configured for deployment on multiple platforms:

### 6.1 Web Deployment

- The web frontend is built using Vite
- The Express server serves the built frontend assets
- The application is configured for cloud deployment with Replit (via CloudRun)

### 6.2 Mobile Deployment

- iOS app package is configured with appropriate permissions for:
  - Camera
  - Location services
  - Motion/fitness tracking
  - Health data integration
- Capacitor is used to bridge the web application to native iOS functionality

### 6.3 Database

- PostgreSQL database is used for data storage
- Database connection is configured via environment variables
- Drizzle ORM manages database migrations

## 7. Development Workflow

The development workflow includes:
- Local development with hot module reloading
- Schema validation shared between frontend and backend
- Type safety through TypeScript
- Database schema management with Drizzle ORM
- Mobile app testing through Capacitor