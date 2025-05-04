# Export Functionality Documentation

## Overview
The Export feature in the U-Pass Manager application enables administrators to export student data and U-Pass information for external reporting, analysis, or record-keeping. This functionality provides a flexible interface for filtering data and selecting specific records or fields before export.

## Key Capabilities

- **Filtered Data Export**: Export data based on various filter criteria
- **Selective Field Export**: Choose which fields to include in the export
- **Multiple Export Formats**: Export data in formats like CSV and Excel
- **Batch Operations**: Export multiple records at once
- **User Access Control**: Limited to administrator users only

## User Interface Components

- **Export Page**: Main interface for configuring and performing exports
- **Filter Controls**: Interface for specifying filter criteria
- **Field Selection**: Checkboxes for selecting which columns to include
- **Record Selection**: Interface for selecting specific records
- **Export Button**: Triggers the export process

## Data Fields Available for Export

- **Student_ID**: Virginia Tech student ID (PID)
- **First_Name**: Student's first name
- **Last_Name**: Student's last name
- **Email**: Student's email address
- **Active_U_Pass_Card**: Currently active U-Pass card number
- **Replaced_U_Pass_Card**: Previous U-Pass card number (if replaced)
- **Disclaimer_Signed**: Whether the student has signed the disclaimer
- **Metro_Acct**: Metro account information
- **Distribution_Date**: Date when the U-Pass was distributed
- **Picked_Up_By**: Person who picked up the U-Pass
- **Notes**: Additional notes about the student or U-Pass
- **U_Pass_ID**: Unique identifier for the U-Pass

## Filtering Capabilities

Users can filter the export based on:
- Student name (first or last)
- Email address
- Active U-Pass card status
- Disclaimer signed status
- Metro account status
- Distribution date range
- Pick-up person

## Implementation Details

### Technology Stack
- **Frontend**: React with Next.js
- **State Management**: React hooks for local state
- **API Integration**: Fetch API for retrieving filtered data
- **Export Library**: Custom export utilities

### Data Flow
1. User sets filter criteria and selects fields for export
2. System fetches matching records from the database
3. User selects specific records or chooses "Select All"
4. User clicks "Export" and chooses the desired format
5. System generates the export file and initiates download

### Security Considerations
- Only authenticated administrators can access the export functionality
- Sensitive data is properly masked in exports when required
- All export operations are logged for audit purposes
- Large exports are rate-limited to prevent system overload

## Export Formats

### CSV Export
- Comma-separated values format
- Compatible with Excel, Google Sheets, and other spreadsheet applications
- Includes headers with field names

### Excel Export
- Native Excel (.xlsx) format
- Includes formatting and multiple sheets when appropriate
- Better handling of special characters and formatting

## Usage Examples

### Exporting All Active U-Pass Records
1. Navigate to the Export page
2. Set filter for "Active_U_Pass_Card" to "not empty"
3. Click "Select All" to select all matching records
4. Click "Export" and choose "CSV"
5. Save the file to your computer

### Exporting Students Who Haven't Signed the Disclaimer
1. Navigate to the Export page
2. Set filter for "Disclaimer_Signed" to "No"
3. Select desired fields (e.g., Student_ID, First_Name, Last_Name, Email)
4. Click "Export" and choose the desired format
5. Use the exported list for follow-up communications

## Pagination and Performance

- Results are paginated to handle large datasets efficiently
- Default page size is 10 records, but can be adjusted
- Performance optimizations ensure exports complete quickly
- Large exports are processed in batches to prevent timeouts

## Related Components and APIs

- `Export.js`: Main component for the export functionality
- `get-all-records` API: Endpoint for retrieving filtered data
- Export utility functions for generating different file formats