# UPass Manager Code Documentation Guide

This document describes the documentation standards and approach used in the UPass Manager project. The project uses JSDoc annotations to provide comprehensive documentation within the codebase.

## Documentation Approach

The UPass Manager codebase follows a comprehensive documentation approach using JSDoc, which helps improve code maintainability, onboarding of new developers, and makes the codebase more understandable.

### Principles

- **Comprehensive**: All important files, classes, functions, and components should be documented
- **Clear and Concise**: Documentation should be clear without unnecessary verbosity
- **Accurate**: Documentation must accurately reflect the code's behavior and purpose
- **Example-Driven**: Include examples for complex or frequently used functions
- **Discoverable**: Documentation is organized to be easily discoverable

## JSDoc Standards

### File Headers

Each file begins with a JSDoc header containing:

```javascript
/**
 * @file Brief description of file purpose
 * @description More detailed explanation of file's functionality
 * @module module/path
 */
```

### Functions and Methods

Functions and methods are documented with:

```javascript
/**
 * Concise description of what the function does
 *
 * @async (if applicable)
 * @function functionName (if name is not obvious)
 * @param {type} paramName - Description of parameter
 * @returns {type} Description of return value
 * @throws {ErrorType} Description of what might cause an error
 *
 * @example
 * // Example usage of the function
 * const result = myFunction('example');
 */
```

### React Components

React components are documented with:

```javascript
/**
 * Description of component purpose and functionality
 *
 * @component
 * @param {Object} props - Component props
 * @param {type} props.specificProp - Description of specific prop
 * @returns {React.ReactElement} Description of rendered component
 *
 * @example
 * // Example usage of the component
 * <MyComponent prop1="value" />
 */
```

### Classes

Classes are documented with:

```javascript
/**
 * Description of class purpose and functionality
 *
 * @class
 * @example
 * // Example usage of the class
 * const instance = new MyClass();
 */
```

### Context Providers

React Context Providers are documented with:

```javascript
/**
 * Description of the context's purpose
 *
 * @typedef {Object} ContextType - Specify the context value type
 * @property {type} propertyName - Description of the context property
 */

/**
 * Context Provider component
 *
 * @component
 * @param {Object} props - Props
 * @param {React.ReactNode} props.children - Child components
 * @returns {React.ReactElement} Provider component
 */
```

### API Endpoints

API endpoint handlers are documented with:

```javascript
/**
 * Description of API endpoint purpose
 *
 * @async
 * @function handler
 * @param {Object} req - The HTTP request object
 * @param {Object} req.body - The request body (if applicable)
 * @param {Object} res - The HTTP response object
 * @returns {Object} JSON response
 *
 * @example
 * // Request body
 * { "key": "value" }
 *
 * // Success response
 * { "message": "Success" }
 */
```

## Documentation Tools

To generate documentation from JSDoc comments, we recommend using documentation.js or JSDoc with an appropriate template.

### Installation

```bash
# Install documentation.js
npm install -g documentation

# OR install JSDoc
npm install -g jsdoc
```

### Generating Documentation

```bash
# Using documentation.js
documentation build src/**/*.js -f html -o docs

# Using JSDoc
jsdoc -c jsdoc.conf.json -r src -d docs
```

## Directory-Specific Documentation

### Backend API (backend-api/)

The backend API directory contains server-side code for processing requests. Documentation here focuses on:

- Database interactions
- Request validation 
- Data processing logic
- Error handling

### Frontend Components (src/app/components/)

Component documentation focuses on:

- Props and their types
- Component state
- Side effects
- User interactions
- Rendering conditions

### NFC Bridge (src/nfc-bridge/)

NFC Bridge documentation covers:

- Card reader interactions
- WebSocket communications
- Card data processing
- Error handling

## Examples from the Codebase

### API Handler Example

```javascript
/**
 * API handler for updating a student's disclaimer status
 * 
 * @async
 * @function handler
 * @param {Object} req - The HTTP request object
 * @param {Object} req.body - The request body
 * @param {string} req.body.pid - The 9-digit student PID
 * @param {Object} res - The HTTP response object
 * @returns {Object} JSON response indicating success or failure
 * 
 * @example
 * // Request body
 * {
 *   "pid": "123456789"
 * }
 * 
 * // Success response (200 OK)
 * {
 *   "message": "Disclaimer status updated successfully",
 *   "success": true
 * }
 */
export default async function handler(req, res) {
  // Function implementation
}
```

### React Component Example

```javascript
/**
 * Modal component that handles NFC card reading for UPass allocation
 * 
 * @component
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Function to call when the modal is closed
 * @param {Function} props.onConfirm - Function to call when the UPass is confirmed
 * @param {Object} props.studentInfo - Information about the student
 * @returns {React.ReactElement|null} The NFCModal component or null if not open
 */
const NFCModal = ({ isOpen, onClose, onConfirm, studentInfo }) => {
  // Component implementation
}
```

## Documentation Maintenance

This documentation approach should be maintained as follows:

1. **New Code**: All new code should include appropriate JSDoc comments
2. **Refactoring**: When refactoring, update documentation to match changes
3. **Reviews**: Code reviews should check for proper documentation
4. **Documentation Testing**: Periodically generate and review documentation output

## Extending Documentation

To extend the documentation:

1. Add additional JSDoc tags as needed (@see, @since, @deprecated, etc.)
2. Create additional markdown files for complex topics 
3. Update this guide when documentation standards evolve

## Contact

For questions about documentation standards, contact the UPass Manager development team.