# Development Guide

## Overview

This guide provides information for developers working on the UPass Manager application. It covers project structure, coding standards, development workflow, and other important technical details.

## Project Structure

The UPass Manager is built using Next.js with a modern project structure:

```
upass-manager/
├── backend-api/        # Backend API handlers
│   ├── db.js           # Database connection
│   └── pages/
│       └── api/        # API endpoint implementations
├── backend-common/     # Shared backend utilities
├── pages/              # Next.js page routes
│   └── api/            # API route handlers (forwards to backend-api)
├── public/             # Static assets
├── src/
│   ├── app/            # Application code (Next.js App Router)
│   │   ├── assets/     # Frontend assets 
│   │   ├── components/ # React components
│   │   ├── views/      # Page view components
│   │   └── utils/      # Utility functions
│   ├── cloud/          # AWS Lambda functions
│   └── nfc-bridge/     # NFC bridge server
├── sql-migrations/     # Database migration scripts
└── setup-nfc.js        # NFC setup script
```

## Development Environment Setup

### Prerequisites

1. Node.js (v14 or higher)
2. npm (v6 or higher)
3. MySQL (v8 or higher)
4. Git

### Setting Up Local Development

1. **Clone the Repository**
   ```bash
   git clone https://github.com/vt-upass/upass-manager.git
   cd upass-manager
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**
   Create a `.env` file in the root directory with the following variables:
   ```
   # Database Configuration
   DB_HOST=localhost
   DB_USER=your_mysql_username
   DB_PASSWORD=your_mysql_password
   DB_DATABASE=upass_manager
   DB_PORT=3306
   
   # AWS Configuration (if using notification features)
   AWS_REGION=us-east-2
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   LAMBDA_FUNCTION_NAME=CS5934_G6_SES
   
   # NFC Bridge Configuration
   NEXT_PUBLIC_NFC_SERVER_URL=http://localhost:3001
   ```

4. **Set Up the Database**
   Create a MySQL database and run the migration scripts:
   ```bash
   mysql -u your_mysql_username -p
   ```
   ```sql
   CREATE DATABASE upass_manager;
   ```
   ```bash
   mysql -u your_mysql_username -p upass_manager < sql-migrations/create_message_templates_table.sql
   # Run additional migration scripts as needed
   ```

5. **Start the Development Server**
   ```bash
   npm run dev
   ```
   This will start the Next.js development server at http://localhost:3000

6. **Set Up NFC Integration (Optional)**
   If you need to test the NFC integration:
   ```bash
   npm run setup-nfc
   ```
   Then in a separate terminal:
   ```bash
   cd src/nfc-bridge
   npm start
   ```

## Coding Standards

### JavaScript/TypeScript

- Use ES6+ features and modern JavaScript practices
- Follow the Airbnb JavaScript Style Guide
- Use meaningful variable and function names
- Add JSDoc comments to functions and complex code blocks
- Use async/await for asynchronous operations

### React Components

- Create functional components with React Hooks
- Keep components small and focused on a single responsibility
- Use PropTypes for component props validation
- Follow the presentational and container component pattern
- Use descriptive component names that reflect their purpose

### CSS/Styling

- Use Tailwind CSS for styling components
- Follow a consistent naming convention for custom CSS classes
- Keep styling minimal and rely on Tailwind's utility classes
- Use responsive design principles

### API Endpoints

- Follow RESTful API design principles
- Use consistent naming conventions for endpoints
- Implement proper error handling and validation
- Return appropriate HTTP status codes
- Document all API endpoints thoroughly

## Development Workflow

### Branching Strategy

We use a feature-branch workflow:

1. **Main Branch** (`main`): The production-ready branch
2. **Development Branch** (`dev`): The primary development branch
3. **Feature Branches** (`feature/feature-name`): For new features
4. **Bugfix Branches** (`bugfix/issue-name`): For bug fixes

### Pull Request Process

1. Create a new branch from `dev` for your feature or fix
2. Make your changes in small, focused commits
3. Write tests for your changes if applicable
4. Update documentation if necessary
5. Submit a pull request to the `dev` branch
6. Request a code review from a team member
7. Address any feedback from the review
8. Once approved, the PR can be merged

### Commit Message Guidelines

Follow the conventional commits specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

Types include:
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code changes that neither fix bugs nor add features
- `test`: Adding or correcting tests
- `chore`: Changes to the build process or auxiliary tools

## Testing

### Unit Testing

- Write unit tests for utility functions and isolated components
- Use Jest for testing JavaScript/TypeScript code
- Aim for high test coverage of critical code paths

### Component Testing

- Test React components using React Testing Library
- Focus on testing user interactions and component behavior
- Test both success and error states

### API Testing

- Test API endpoints using Jest and Supertest
- Verify correct responses for valid and invalid inputs
- Test error handling and edge cases

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Generate coverage report
npm test -- --coverage
```

## Debugging

### Frontend Debugging

- Use React Developer Tools browser extension
- Use console.log() strategically for debugging
- Leverage Next.js error overlay for error information
- Use the browser's DevTools for network and performance issues

### Backend Debugging

- Add detailed logging for API endpoints
- Use error tracking for production issues
- Test API endpoints with tools like Postman or Insomnia

### NFC Bridge Debugging

- Run the check-reader.js script to verify NFC reader connection
- Enable verbose logging in the NFC bridge server
- Use WebSocket testing tools to verify communication

## Deployment

### Development Deployment

- Automated deployments to development environment from the `dev` branch
- Review apps for pull requests to test changes in isolation

### Production Deployment

- Manual approval required for production deployments
- Deploy from the `main` branch after thorough testing
- Follow the deployment checklist in the operations manual

## Performance Considerations

- Optimize database queries for large datasets
- Implement pagination for list views
- Use React.memo and useMemo for expensive computations
- Optimize image and asset loading
- Follow Next.js best practices for optimized page loading

## Security Best Practices

- Validate and sanitize all user inputs
- Use parameterized queries for database operations
- Implement proper authentication and authorization
- Keep dependencies updated to avoid security vulnerabilities
- Follow the principle of least privilege for API access
- Store sensitive information in environment variables

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://reactjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Socket.IO Documentation](https://socket.io/docs)
- [MySQL Documentation](https://dev.mysql.com/doc/)
