# Medical Records Management Application

A full-stack medical records management application built with Next.js, MongoDB, and Permit.io for role-based access control.

## Features

- **Role-Based Access Control**: Admin, doctor, and patient roles with different permissions
- **MongoDB Integration**: Persistent data storage with MongoDB
- **File Uploads**: Upload and manage medical documents using Vercel Blob
- **Advanced Search**: Filter records by date, doctor, patient, and more
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Clean interface with gradient styling

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- MongoDB database (local or Atlas)
- Vercel account (for Blob storage)
- Permit.io account

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# Authentication
JWT_SECRET=your_jwt_secret_key

# Permit.io
PERMIT_API_KEY=your_permit_api_key

# Vercel Blob
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
```

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:2500](http://localhost:2500) in your browser

### Testing Different Roles

The application comes with pre-configured test accounts:

- **Admin**: `admin` / `2025DEVChallenge`
- **Doctor**: `drjohnson` / `2025DEVChallenge` or `drwilliams` / `2025DEVChallenge`
- **Patient**: `jsmith` / `2025DEVChallenge` or `newuser` / `2025DEVChallenge`

## Permit.io Integration

This application uses Permit.io for fine-grained role-based access control:

1. **Server-Side Enforcement**: The `checkAccess` function in `lib/permit.ts` uses the Permit.io SDK to verify if a user has permission to perform an action on a resource.

2. **Client-Side UI Adaptation**: The `usePermit` hook provides a simplified client-side permission check to conditionally render UI elements.

3. **Resource-Based Permissions**: Permissions are defined based on:
   - Resource type (`medical_record`)
   - Action (`read`, `create`, `update`, `delete`)
   - Resource attributes (patient name, doctor name)

### Permit.io PDP Docker Setup

This application uses a Permit.io Policy Decision Point (PDP) for enforcement, which can be run locally using Docker:

1. **Set up API Key**:
   - Navigate to the `permit-pdp-docker` directory
   - Create a `.env` file with your Permit API key:
     ```
     PDP_API_KEY=your_permit_api_key_here
     ```

2. **Run the PDP Container**:
   ```bash
   cd permit-pdp-docker
   docker-compose up
   ```
   This will start the PDP container on port 7766.

3. **Verify PDP is Running**:
   Open a browser and navigate to http://localhost:7766

4. **Troubleshooting**:
   - If the PDP fails to start with API key errors, ensure your `.env` file exists and contains a valid `PDP_API_KEY`
   - Make sure the docker-compose command is run from the directory containing both the docker-compose.yml and .env files

5. **Deployment Options**:
   - For local development, use Docker Compose
   - For production, the PDP can be deployed to services like Render using the provided `render.yaml` configuration

For more information about Permit.io's PDP, visit the [official documentation](https://docs.permit.io/).

## Deployment

This application can be deployed to Vercel:

1. Push your code to a GitHub repository
2. Import the repository in Vercel
3. Configure the environment variables
4. Deploy

## License

MIT
