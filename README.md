# LMS Backend

## Overview

This is the backend for the LMS (Learning Management System) application. It handles user authentication, course management, and other functionalities required for the LMS.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Running the Application](#running-the-application)
5. [Development](#development)
6. [Seeding the Database](#seeding-the-database)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18.x or later)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [PostgreSQL](https://www.postgresql.org/) (for the database)

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/your-repo/lms-backend.git
    cd lms-backend
    ```

2. Install the dependencies:

    ```bash
    npm install
    ```

## Configuration

1. Create a `.env` file in the root directory of the project and add the following environment variables:

    ```dotenv
    GOOGLE_CLIENT_ID=your-google-client-id
    GOOGLE_CLIENT_SECRET=your-google-client-secret
    SERVER_URL=http://localhost:5000
    EMAIL=your-email@gmail.com
    GMAIL_APP_PASSWORD=your-email-app-password
    ```

2. Ensure you have PostgreSQL running and create a database for the application.

## Running the Application

1. **Build the application:**

    ```bash
    npm run build
    ```

2. **Start the application:**

    ```bash
    npm start
    ```

   The server will be running at [http://localhost:5000](http://localhost:5000).

## Development

For development purposes, you can use `nodemon` to automatically restart the server on file changes:

1. **Start the development server:**

    ```bash
    npm run dev
    ```

   This command will watch for changes and rebuild the project as needed.

## Seeding the Database

To seed the database with initial data:

1. **Run the seed command:**

    ```bash
    npx prisma db seed
    ```

   This command will execute the `prisma/seed.ts` file to populate the database with initial data.


## Troubleshooting

### Error: Email credentials are not set in environment variables

Ensure that the `.env` file is correctly configured and contains valid credentials. Double-check that `EMAIL` and `GMAIL_APP_PASSWORD` are correctly set.

### Error: Unknown authentication strategy "google"

Make sure that the Google OAuth strategy is properly configured in your `passportSetup.ts` and that the passport middleware is correctly used in your routes.

