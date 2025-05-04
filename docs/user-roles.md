# User Role Documentation

## Overview
The UPass Manager application implements a role-based access control system that provides different privileges and capabilities to users based on their assigned roles. This document outlines the responsibilities, permissions, and functionality available to each user role.

## Role Types

The system supports three primary user roles:

1. **Student** - End users who receive U-Pass cards
2. **Distributor** - Staff who issue U-Pass cards and manage student records
3. **Administrator** - Staff with full system access and management capabilities

## Administrator Role

### Description
Administrators have full access to all aspects of the UPass Manager system. They are responsible for managing distributors, configuring system settings, analyzing data, and generating reports for external stakeholders.

### Access Rights
- Complete access to all system features and data
- Ability to add, modify, and remove distributor accounts
- Access to system configuration settings
- Comprehensive reporting and analytics capabilities
- Ability to export data for external use

### Key Responsibilities
- Managing the distributor user base
- Monitoring system usage and performance
- Generating regular reports for transportation authorities
- Maintaining system configuration
- Troubleshooting system issues

### Primary Workflows
1. **Distributor Management**
   - Adding new distributors
   - Assigning permissions
   - Removing access when needed

2. **Reporting and Analytics**
   - Accessing the visualization dashboard
   - Generating custom reports
   - Exporting data for external use

3. **System Configuration**
   - Setting up notification templates
   - Configuring system parameters
   - Managing database connections

### Interface Elements
- All distributor interface elements
- Distributor management page
- Advanced analytics dashboard
- System configuration settings
- Data export capabilities

## Distributor Role

### Description
Distributors are the primary day-to-day operators of the UPass Manager system. They interact directly with students, verify eligibility, issue U-Pass cards, and manage student records.

### Access Rights
- Student search and verification
- U-Pass issuance and management
- Ability to update student records
- Basic reporting and analytics
- Send notifications to students

### Key Responsibilities
- Verifying student eligibility
- Issuing and replacing U-Pass cards
- Recording disclaimer signatures
- Updating student information
- Notifying students about U-Pass pickup

### Primary Workflows
1. **Student Verification**
   - Searching for students by PID
   - Checking eligibility status
   - Verifying identity

2. **U-Pass Issuance**
   - Recording disclaimer signatures
   - Scanning U-Pass cards with NFC reader
   - Allocating cards to students
   - Handling card replacements

3. **Notification Management**
   - Sending pickup notifications
   - Creating and using message templates
   - Managing student communications

### Interface Elements
- Dashboard with quick actions
- Student search functionality
- NFC scanning interface
- Disclaimer confirmation dialog
- Basic statistics and reports
- Notification management interface

## Student Role (External)

### Description
While students don't have direct login access to the UPass Manager application, they are key stakeholders in the system. Students interact with the system primarily through external interfaces like email notifications and in-person pickup procedures.

### Interaction Points
- Receiving email notifications
- Signing disclaimers (may be electronic or paper)
- Picking up U-Pass cards in person
- Requesting replacements for lost/damaged cards

### Common Student Workflows
1. **Receiving Notifications**
   - Eligibility confirmations
   - U-Pass pickup instructions
   - Status change alerts

2. **U-Pass Pickup**
   - Reviewing pickup instructions
   - Visiting distribution center
   - Providing identification
   - Signing disclaimer
   - Receiving U-Pass card

3. **Card Replacement**
   - Reporting lost/damaged cards
   - Requesting replacement
   - Following replacement procedures

## Authentication and Security

### Login Process
1. Users access the login page
2. They enter their email and password
3. The system validates credentials and determines the user role
4. Users are redirected to the appropriate dashboard based on their role

### Password Policies
- Minimum 8 characters
- Must include uppercase, lowercase, and numbers
- Regular password rotation requirement
- Account lockout after multiple failed attempts

### Session Management
- Automatic logout after 30 minutes of inactivity
- Single active session per user
- Secure cookie handling

## Role Assignment and Management

### Adding New Distributors
1. Administrator logs in and navigates to distributor management
2. Clicks "Add Distributor" button
3. Enters distributor email, first name, and last name
4. System sends invitation email with password setup link
5. New distributor sets password and gains access

### Modifying Role Permissions
Currently, permissions are fixed for each role and cannot be individually customized. Future versions may include more granular permission controls.

### Removing Users
1. Administrator navigates to distributor management
2. Locates the distributor to be removed
3. Clicks "Remove" button
4. Confirms the action
5. System immediately revokes access

## Future Role Enhancements

Planned enhancements to the role system include:
- Custom permission sets within roles
- Additional roles for specialized functions
- Self-service portal for students
- Enhanced audit trail for user actions

## Related Components
- `Login.js`: Main authentication component
- `Dashboard.js`: Role-specific dashboard views
- `AddDistributorModal.js`: Interface for adding distributors
- Authentication API endpoints
- Role-based permission middleware