# ADWrap Backend

This is the backend service for the ADWrap media management system. It's built with Node.js and Express, and uses PostgreSQL for data storage.

## Prerequisites

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Running with Docker

The backend service is containerized and configured to run with Docker Compose alongside a PostgreSQL database.

### Starting the Container

1. From the root directory of the project, run:

   ```bash
   docker-compose up
   ```

   This will start both the backend service and PostgreSQL database.

2. To run in detached mode (background):

   ```bash
   docker-compose up -d
   ```

3. To only start the backend service:

   ```bash
   docker-compose up backend
   ```

### Stopping the Container

1. If running in the foreground, press `Ctrl+C`

2. If running in detached mode:

   ```bash
   docker-compose down
   ```

## Environment Variables

The backend container is configured with the following environment variables:

- `DB_HOST`: Database host (default: db)
- `DB_USER`: Database user (default: adwrap)
- `DB_PASS`: Database password (default: adwrappass)
- `DB_NAME`: Database name (default: adwrapdb)
- `DB_PORT`: Database port (default: 5432)

## API Access

Once the container is running, the API will be available at:

- http://localhost:5000

## Development

For local development outside of Docker:

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

This will run the server with nodemon for auto-reloading on file changes.

## Database

The PostgreSQL database is configured with:

- Port: 5434 (mapped to 5432 inside the container)
- User: adwrap
- Password: adwrappass
- Database name: adwrapdb

Data is persisted using a Docker volume named `db_data`.