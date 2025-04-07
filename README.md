# ThemeChest Frontend

<p align="center">
  <img src="src/assets/images/logo.png" alt="ThemeChest Logo" width="200">
</p>

## Overview

ThemeChest is a platform for discovering, creating, and sharing knowledge guides on various topics. The frontend is built with React and provides a user-friendly interface for browsing guides, creating content (both manually and with AI assistance), and managing user profiles.

## Features

- **Guide Discovery**: Browse and search for guides on various topics
- **AI-Powered Creation**: Create comprehensive guides with AI assistance
- **Manual Guide Creation**: Build guides step by step with a user-friendly editor
- **User Authentication**: Secure login and registration system
- **User Profiles**: Manage your profile and view your created guides
- **Responsive Design**: Optimized for both desktop and mobile devices
- **Admin Panel**: Manage guides and users (admin access only)

## Tech Stack

- **React**: Frontend library for building user interfaces
- **React Router**: For navigation and routing
- **Redux**: State management
- **Axios**: HTTP client for API requests
- **React Hook Form & Formik**: Form handling
- **React Quill**: Rich text editor for guide content
- **React Toastify**: Notifications
- **CSS Modules**: Styling components

## Prerequisites

- Node.js (>=16.0.0)
- npm or yarn
- Backend API running (see ThemeChestBack README)

## Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory with the following variables (adjust as needed):

```
REACT_APP_API_URL=http://localhost:3002/api/v1
```

## Running the Application

### Development Mode

```bash
npm start
# or
yarn start
```

This will start the development server at `http://localhost:3000`.

### Production Build

```bash
npm run build
# or
yarn build
```

## Docker

You can run the entire application stack (frontend, backend, AI service, databases) using Docker:

```bash
# Navigate to the root directory of the project (where docker-compose.yml is located)

# Build and start all containers
docker-compose up -d

# Build and start only the frontend
docker-compose up -d frontend

# View logs
docker-compose logs -f
```

This will start:
- Frontend on http://localhost:3000
- Backend API on http://localhost:3002/api/v1
- AI Service on http://localhost:5000
- MySQL database on port 3306
- MongoDB on port 27017
- phpMyAdmin on http://localhost:8080
- Mongo Express on http://localhost:8081

## Project Structure

```
src/
├── api/            # API service functions
├── assets/         # Static assets (images, fonts)
├── components/     # Reusable UI components
├── config/         # Configuration files
├── pages/          # Page components
├── store/          # Redux store configuration
├── styles/         # Global styles
├── utils/          # Utility functions
└── index.js        # Application entry point
```

## Main Pages

- **Main**: Landing page with featured guides
- **Guides**: Browse and search for guides
- **Guide Details**: View a specific guide
- **Creator**: Manual guide creation interface
- **AiCreator**: AI-assisted guide creation
- **Profile**: User profile management
- **Admin List**: Admin panel for guide and user management

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
