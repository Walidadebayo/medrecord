# Medical Records Project

This project is a medical records management system that utilizes the Permit SDK for access control. It provides functionality to check user permissions based on their roles and the resources they are trying to access.

## Project Structure

The project consists of the following files and directories:

- **lib/**: Contains the core logic of the application.
  - **permit.ts**: Initializes the Permit SDK and exports the `checkAccess` function for permission checks.
  - **types.ts**: Contains TypeScript type definitions, including the `User` interface.

- **Dockerfile**: Instructions for building a Docker image for the application.

- **docker-compose.yml**: Defines services, networks, and volumes for Docker Compose, including configurations for the Permit PDP service.

- **render.yaml**: Configuration settings for deploying the application on Render, specifying services, environment variables, and build commands.

- **.env**: Stores environment variables used in the application, such as API keys and configuration settings.

- **package.json**: Configuration file for npm, listing dependencies, scripts, and metadata for the project.

- **tsconfig.json**: Configuration file for TypeScript, specifying compiler options and files to include in the compilation.

## Setup Instructions

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd medical-records
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:
   Create a `.env` file in the root directory and add your environment variables, including `PDP_API_KEY`.

4. **Build the Docker Image**:
   ```bash
   docker build -t medical-records .
   ```

5. **Run the Application**:
   You can run the application using Docker Compose:
   ```bash
   docker-compose up
   ```

## Usage

The application provides an API for managing medical records. You can check user permissions using the `checkAccess` function defined in `lib/permit.ts`. This function will determine if a user has the necessary permissions based on their role and the requested resource.

## Deployment

To deploy the application on Render, ensure that your `render.yaml` file is correctly configured with the necessary services and environment variables. Follow the Render documentation for deployment instructions.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.

# Permit.io PDP Docker Setup

## Configuration

1. Create a `.env` file in this directory with your Permit.io API key:

```
PERMIT_API_KEY=your_permit_api_key_here
```

2. Make sure to replace `your_permit_api_key_here` with your actual Permit.io API key.

## Running locally

```bash
docker-compose up
```

The PDP will be accessible at http://localhost:7766

## Troubleshooting

If you see errors like:
```
CRITICAL | No API key specified. Please specify one with the PDP_API_KEY environment variable.
```

Make sure:
1. Your `.env` file exists in the same directory as your docker-compose.yml
2. The `.env` file contains the PERMIT_API_KEY variable with a valid API key
3. The docker-compose command is being run from the same directory as the .env file