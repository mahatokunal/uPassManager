# React Components Documentation

This document provides detailed documentation for all React components in the UPass Manager system.

## Table of Contents

1. [Header Component](#header-component)
2. [Footer Component](#footer-component)
3. [AddDistributorModal Component](#adddistributormodal-component)
4. [DisclaimerModal Component](#disclaimermodal-component)
5. [MessageTemplateModal Component](#messagetemplatemodal-component)
6. [NFCModal Component](#nfcmodal-component)
7. [UploadModal Component](#uploadmodal-component)
8. [Page Components](#page-components)

## Header Component

**File Path:** `/src/app/components/Header.js`

**Purpose:** Displays the application header with Virginia Tech branding and user authentication controls.

**Props:** None

**State:**
- `isLoggedIn`: Boolean indicating whether a user is currently logged in

**Key Functionality:**
- Displays the Virginia Tech logo and U-Pass Manager title
- Shows logout button when user is logged in
- Handles user logout by clearing localStorage and redirecting to login page

**Usage Example:**
```jsx
import Header from '../components/Header';

function Layout() {
  return (
    <div>
      <Header />
      <main>{/* Page content */}</main>
    </div>
  );
}
```

## Footer Component

**File Path:** `/src/app/components/Footer.js`

**Purpose:** Displays the application footer with copyright information and links.

**Props:** None

**Usage Example:**
```jsx
import Footer from '../components/Footer';

function Layout() {
  return (
    <div>
      <main>{/* Page content */}</main>
      <Footer />
    </div>
  );
}
```

## AddDistributorModal Component

**File Path:** `/src/app/components/AddDistributorModal.js`

**Purpose:** Modal dialog for adding new distributors to the system.

**Props:**
- `isOpen`: Boolean indicating whether the modal is visible
- `onClose`: Function to call when the modal is closed
- `onAddDistributor`: Function to call when a distributor is added

**State:**
- `name`: String for distributor name input
- `email`: String for distributor email input
- `loading`: Boolean indicating if form submission is in progress
- `error`: String for any error messages

**Key Functionality:**
- Validates distributor information
- Submits new distributor data to the backend
- Displays success or error messages

**Usage Example:**
```jsx
import AddDistributorModal from '../components/AddDistributorModal';

function DistributorsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleAddDistributor = (distributorData) => {
    // Handle new distributor data
    console.log(distributorData);
    setIsModalOpen(false);
  };
  
  return (
    <div>
      <button onClick={() => setIsModalOpen(true)}>Add Distributor</button>
      
      <AddDistributorModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddDistributor={handleAddDistributor}
      />
    </div>
  );
}
```

## DisclaimerModal Component

**File Path:** `/src/app/components/DisclaimerModal.js`

**Purpose:** Modal dialog displaying system disclaimer text that users must accept.

**Props:**
- `isOpen`: Boolean indicating whether the modal is visible
- `onClose`: Function to call when the modal is closed
- `onAccept`: Function to call when the disclaimer is accepted
- `disclaimerText`: String containing the disclaimer text to display

**Key Functionality:**
- Displays the current system disclaimer
- Tracks user acceptance of the disclaimer
- Prevents system access until disclaimer is accepted

**Usage Example:**
```jsx
import DisclaimerModal from '../components/DisclaimerModal';

function LoginPage() {
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(true);
  const [isDisclaimerAccepted, setIsDisclaimerAccepted] = useState(false);
  
  const handleAcceptDisclaimer = () => {
    setIsDisclaimerAccepted(true);
    setIsDisclaimerOpen(false);
  };
  
  return (
    <div>
      {/* Login form */}
      
      <DisclaimerModal 
        isOpen={isDisclaimerOpen}
        onClose={() => setIsDisclaimerOpen(false)}
        onAccept={handleAcceptDisclaimer}
        disclaimerText="By using this system, you agree to..."
      />
    </div>
  );
}
```

## MessageTemplateModal Component

**File Path:** `/src/app/components/MessageTemplateModal.js`

**Purpose:** Modal dialog for creating and editing message templates used in notifications.

**Props:**
- `isOpen`: Boolean indicating whether the modal is visible
- `onClose`: Function to call when the modal is closed
- `onSave`: Function to call when a template is saved
- `template`: Optional object containing existing template data to edit

**State:**
- `name`: String for template name
- `subject`: String for email subject line
- `content`: String for email body content
- `loading`: Boolean indicating if save operation is in progress
- `error`: String for any error messages

**Key Functionality:**
- Create new message templates
- Edit existing message templates
- Preview templates with sample data
- Save templates to the database

**Usage Example:**
```jsx
import MessageTemplateModal from '../components/MessageTemplateModal';

function NotificationsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState(null);
  
  const handleSaveTemplate = (templateData) => {
    // Save template data
    console.log(templateData);
    setIsModalOpen(false);
  };
  
  return (
    <div>
      <button onClick={() => {
        setCurrentTemplate(null);
        setIsModalOpen(true);
      }}>Create Template</button>
      
      <MessageTemplateModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTemplate}
        template={currentTemplate}
      />
    </div>
  );
}
```

## NFCModal Component

**File Path:** `/src/app/components/NFCModal.js`

**Purpose:** Modal dialog for NFC card reading and U-Pass allocation.

**Props:**
- `isOpen`: Boolean indicating whether the modal is visible
- `onClose`: Function to call when the modal is closed
- `onAllocate`: Function to call when a U-Pass is allocated
- `studentData`: Object containing the student information

**State:**
- `nfcId`: String containing the detected NFC card ID
- `isReading`: Boolean indicating if NFC reading is in progress
- `isAllocating`: Boolean indicating if allocation is in progress
- `error`: String for any error messages

**Key Functionality:**
- Initiate NFC card reading
- Display card detection status
- Allocate U-Pass to student record
- Handle allocation errors

**Usage Example:**
```jsx
import NFCModal from '../components/NFCModal';

function StudentDetailPage() {
  const [isNfcModalOpen, setIsNfcModalOpen] = useState(false);
  const studentData = { /* student info */ };
  
  const handleAllocate = (allocationData) => {
    // Process U-Pass allocation
    console.log(allocationData);
    setIsNfcModalOpen(false);
  };
  
  return (
    <div>
      <button onClick={() => setIsNfcModalOpen(true)}>Allocate U-Pass</button>
      
      <NFCModal 
        isOpen={isNfcModalOpen}
        onClose={() => setIsNfcModalOpen(false)}
        onAllocate={handleAllocate}
        studentData={studentData}
      />
    </div>
  );
}
```

## UploadModal Component

**File Path:** `/src/app/components/UploadModal.js`

**Purpose:** Modal dialog for uploading student data files.

**Props:**
- `isOpen`: Boolean indicating whether the modal is visible
- `onClose`: Function to call when the modal is closed
- `onUploadComplete`: Function to call when upload is complete

**State:**
- `file`: File object selected for upload
- `isUploading`: Boolean indicating if upload is in progress
- `progress`: Number indicating upload progress (0-100)
- `error`: String for any error messages
- `results`: Object containing upload results

**Key Functionality:**
- File selection and validation
- File upload to server
- Progress tracking
- Result display

**Usage Example:**
```jsx
import UploadModal from '../components/UploadModal';

function AdminDashboard() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  
  const handleUploadComplete = (results) => {
    console.log(`Added: ${results.added}, Updated: ${results.updated}`);
    setIsUploadModalOpen(false);
  };
  
  return (
    <div>
      <button onClick={() => setIsUploadModalOpen(true)}>Upload Data</button>
      
      <UploadModal 
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadComplete={handleUploadComplete}
      />
    </div>
  );
}
```

## Page Components

### Dashboard

**File Path:** `/src/app/views/Dashboard.js`

**Purpose:** Main dashboard view showing system overview and statistics.

**Key Features:**
- System status overview
- Recent activity feed
- Key metrics display
- Quick action buttons

### Distributors

**File Path:** `/src/app/views/Distributors.js`

**Purpose:** View for managing system distributors.

**Key Features:**
- List of all distributors
- Add new distributor functionality
- Remove distributor functionality
- Search and filter capabilities

### Export

**File Path:** `/src/app/views/Export.js`

**Purpose:** View for exporting system data.

**Key Features:**
- Export options configuration
- File format selection
- Date range selection
- Download generated exports

### Login

**File Path:** `/src/app/views/Login.js`

**Purpose:** User authentication view.

**Key Features:**
- Username and password input
- Authentication state management
- Error handling
- Redirect based on user role

### Notifications

**File Path:** `/src/app/views/Notifications.js`

**Purpose:** View for managing and sending notifications.

**Key Features:**
- Create and send notifications
- Message template management
- Notification history
- Recipient selection

### Visualization

**File Path:** `/src/app/views/Visualization.js`

**Purpose:** Data visualization view for system analytics.

**Key Features:**
- Interactive charts and graphs
- Data filtering options
- Export visualization capabilities
- Key metrics display