# UPass Manager Documentation

Welcome to the UPass Manager documentation. This guide provides comprehensive documentation for Virginia Tech's UPass Manager system.

## Documentation Structure

The documentation is organized into the following main sections:

1. [System Architecture](./Architecture.md) - Overview of system design, components, and data flow
2. [API Documentation](./API.md) - Detailed API endpoint specifications and usage
3. [Components](./Components.md) - Documentation for React components and UI elements
4. [Utilities](./Utilities.md) - Documentation for AWS Lambda functions and utility modules
5. [Installation Guide](./Installation.md) - Instructions for setting up the system
6. [User Guide](./UserGuide.md) - End-user documentation for system functionality
7. [Development Guide](./Development.md) - Guidelines for developers working on the system

## Project Overview

UPass Manager is a comprehensive web application developed for Virginia Tech to manage the distribution and tracking of UPass cards to eligible students. The system provides the following key functionalities:

- Student record management
- UPass card allocation
- Distributor management
- Notification system
- Data visualization and reporting

## Technology Stack

The application is built using the following technologies:

- **Frontend**: Next.js 15.3.1, React 19.0.0, TailwindCSS 4.0.12
- **Backend**: Next.js API Routes, MySQL
- **Authentication**: JWT-based authentication
- **Cloud Services**: AWS Lambda, AWS SES
- **Development**: TypeScript, ESLint

## Codebase Organization

The codebase is organized as follows:

```
upass-manager/
├── backend-api/       # Backend API implementation
├── backend-common/    # Shared utilities and modules
├── pages/             # Next.js pages and API routes
├── public/            # Static assets
├── src/
│   ├── app/           # Frontend application code
│   │   ├── assets/    # Images, fonts, and styling
│   │   ├── components/# Reusable UI components
│   │   ├── controllers/# Business logic
│   │   ├── models/    # Data models
│   │   ├── utils/     # Utility functions
│   │   └── views/     # Page-specific components
│   └── cloud/         # AWS Lambda functions
└── sql-migrations/    # Database schema migrations
```

## Getting Started

To start exploring the documentation:

1. Begin with the [Architecture.md](./Architecture.md) document to understand the system design
2. Review the [API.md](./API.md) document to understand available API endpoints
3. Explore [Components.md](./Components.md) to understand the frontend UI components
4. See [Utilities.md](./Utilities.md) for details on utility functions and AWS Lambda integration

For setup instructions, refer to the [Installation Guide](./Installation.md).

## Code Documentation

In addition to the wiki documentation, the codebase includes inline documentation using JSDoc. To generate the API documentation from these comments, follow these steps:

1. Navigate to the project root directory
2. Run `npm run docs`
3. Open the generated documentation in the `docs` folder

## Contact Information

For questions or clarification about this documentation, please contact:

- Project Lead: [Project Lead Name](mailto:projectlead@vt.edu)
- Development Team: [Team Contact](mailto:team@vt.edu)

## License

This project and its documentation are proprietary to Virginia Tech and should not be shared or distributed without permission.
