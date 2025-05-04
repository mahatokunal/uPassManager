# Data Visualization Feature Documentation

## Overview
The Data Visualization feature of the U-Pass Manager provides administrators with graphical representations of U-Pass distribution statistics, helping them track and analyze U-Pass usage trends. This feature allows filtering by semester and displays multiple visualization types to present different aspects of the data.

## Key Components
- **Visualization Dashboard**: Main interface displaying all charts and statistics
- **Filtering System**: Controls for filtering data by semester (Current, Fall 2024, Spring 2024)
- **Pie Charts**: Visualizations showing distribution percentages
- **Summary Statistics**: Numerical breakdowns of key metrics

## Data Sources
The visualization system connects to the following database tables:
- `u_pass_manager_current` - Current semester data
- `u_pass_manager_fall_2024` - Fall 2024 semester data
- `u_pass_manager_spring_2024` - Spring 2024 semester data

## User Access
- **Administrators**: Full access to all visualization features
- **Distributors**: Read-only access to basic visualization features

## Visualization Types

### 1. U-Pass Collection Status
Displays the percentage of students who have collected their U-Pass cards.
- **Collected**: Students who have an Active U-Pass Card assigned
- **Not Collected**: Students without an Active U-Pass Card

### 2. Disclaimer Status
Shows the percentage of students who have signed the U-Pass disclaimer.
- **Signed**: Students who have signed the disclaimer
- **Not Signed**: Students who have not signed the disclaimer

### 3. Replacement Status
Indicates the percentage of students with active U-Pass cards who have received replacements.
- **Replaced**: Students who have a value in the Replaced U-Pass Card field
- **Not Replaced**: Students who don't have a replacement card recorded

## Implementation Details

### Technology Stack
- **Chart Library**: Recharts (React-based charting library)
- **State Management**: React hooks (useState, useEffect)
- **Data Fetching**: Next.js API routes
- **Styling**: Tailwind CSS

### Data Flow
1. User selects a semester filter
2. System fetches data from the corresponding database table
3. Data is processed to generate visualization statistics
4. Charts and summaries are updated with the processed data

### Key Functions

- `fetchData()`: Retrieves data for all semesters from the API
- `applyFilters()`: Filters the dataset based on selected semester
- `generateUPassCollectionData()`: Creates dataset for U-Pass collection chart
- `generateDisclaimerSignedData()`: Creates dataset for disclaimer status chart
- `generateReplacementData()`: Creates dataset for replacement status chart

## Responsive Design
The visualization system is fully responsive and adapts to different screen sizes:
- **Desktop**: Three-column layout for charts
- **Tablet**: Two-column layout for charts
- **Mobile**: Single-column layout with scrollable content

## Future Enhancements
- Adding time-series visualizations for tracking changes over time
- Implementing export functionality for visualization data
- Adding more granular filtering options (by date range, student type, etc.)
- Adding drill-down capabilities for more detailed analysis

## Related Components
- `UPassCollectionStats.js`: Main component for the visualization feature
- `VisualizationOptionsModal.js`: Modal for configuring visualization options
- `/api/get-all-records`: API endpoint for retrieving visualization data