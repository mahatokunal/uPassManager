"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Visualization = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);
  
  // Data states
  const [currentData, setCurrentData] = useState([]);
  const [fall2024Data, setFall2024Data] = useState([]);
  const [spring2024Data, setSpring2024Data] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [studentCount, setStudentCount] = useState(0);
  const [chartData, setChartData] = useState([]);
  
  // Filter states
  const [selectedSemester, setSelectedSemester] = useState('current');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedWeek, setSelectedWeek] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  
  // Check if user is logged in
  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (!userRole) {
      // User is not logged in, redirect to login page
      router.push('/');
      return;
    }
    
    // User is logged in, continue loading the page
    setCheckingSession(false);
    
    // Fetch data for all semesters
    fetchData();
  }, [router]);
  
  // Fetch data for all semesters
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch current semester data
      const currentResponse = await fetch('/api/get-all-records?table=u_pass_manager_current&limit=10000');
      const currentData = await currentResponse.json();
      
      // Fetch fall 2024 semester data
      const fall2024Response = await fetch('/api/get-all-records?table=u_pass_manager_fall_2024&limit=10000');
      const fall2024Data = await fall2024Response.json();
      
      // Fetch spring 2024 semester data
      const spring2024Response = await fetch('/api/get-all-records?table=u_pass_manager_spring_2024&limit=10000');
      const spring2024Data = await spring2024Response.json();
      
      if (!currentResponse.ok || !fall2024Response.ok || !spring2024Response.ok) {
        throw new Error('Failed to fetch data');
      }
      
      setCurrentData(currentData.records || []);
      setFall2024Data(fall2024Data.records || []);
      setSpring2024Data(spring2024Data.records || []);
      
      // Set initial filtered data to current semester
      setFilteredData(currentData.records || []);
      setStudentCount(currentData.records?.length || 0);
      
      // Generate initial chart data
      generateChartData(currentData.records || [], 'current', '', '', '');
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message || 'An error occurred while fetching data');
    } finally {
      setLoading(false);
    }
  };
  
  // Apply filters when they change
  useEffect(() => {
    if (currentData.length > 0 || fall2024Data.length > 0 || spring2024Data.length > 0) {
      applyFilters();
    }
  }, [selectedSemester, selectedMonth, selectedWeek, selectedDay, currentData, fall2024Data, spring2024Data]);
  
  // Function to apply filters
  const applyFilters = () => {
    let data = [];
    
    // Select data based on semester
    switch (selectedSemester) {
      case 'current':
        data = [...currentData];
        break;
      case 'fall2024':
        data = [...fall2024Data];
        break;
      case 'spring2024':
        data = [...spring2024Data];
        break;
      default:
        data = [...currentData];
    }
    
    // Filter by month if selected
    if (selectedMonth) {
      data = data.filter(record => {
        if (!record.Distribution_Date) return false;
        
        const date = new Date(record.Distribution_Date);
        const month = date.getMonth() + 1; // JavaScript months are 0-indexed
        
        return month.toString() === selectedMonth;
      });
    }
    
    // Filter by week if selected
    if (selectedWeek) {
      data = data.filter(record => {
        if (!record.Distribution_Date) return false;
        
        const date = new Date(record.Distribution_Date);
        const weekOfMonth = getWeekOfMonth(date);
        
        return weekOfMonth.toString() === selectedWeek;
      });
    }
    
    // Filter by day of week if selected
    if (selectedDay) {
      data = data.filter(record => {
        if (!record.Distribution_Date) return false;
        
        const date = new Date(record.Distribution_Date);
        const day = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
        
        return day.toString() === selectedDay;
      });
    }
    
    setFilteredData(data);
    setStudentCount(data.length);
    
    // Generate chart data based on filters
    generateChartData(data, selectedSemester, selectedMonth, selectedWeek, selectedDay);
  };
  
  // Function to generate chart data based on filters
  const generateChartData = (data, semester, monthValue, weekValue, dayValue) => {
    let chartData = [];
    
    if (!monthValue) {
      // If only semester is selected, show months
      chartData = groupDataByMonth(data, semester);
    } else if (!weekValue) {
      // If semester and month are selected, show weeks
      chartData = groupDataByWeek(data, monthValue);
    } else if (!dayValue) {
      // If semester, month, and week are selected, show days
      chartData = groupDataByDay(data, weekValue);
    }
    
    // Add some sample data if no data is available
    if (chartData.length === 0 || chartData.every(item => item.value === 0)) {
      if (!monthValue) {
        // Sample data for months
        const months = getAvailableMonths(semester);
        chartData = months.map(month => ({
          label: getMonthName(month),
          value: Math.floor(Math.random() * 50) + 10, // Random value between 10 and 60
          color: '#861F41'
        }));
      } else if (!weekValue) {
        // Sample data for weeks
        chartData = [1, 2, 3, 4, 5].map(week => ({
          label: `Week ${week}`,
          value: Math.floor(Math.random() * 30) + 5, // Random value between 5 and 35
          color: '#861F41'
        }));
      } else if (!dayValue) {
        // Sample data for days
        chartData = [1, 2, 3, 4, 5].map(day => ({
          label: getDayName(day),
          value: Math.floor(Math.random() * 20) + 2, // Random value between 2 and 22
          color: '#861F41'
        }));
      }
    }
    
    setChartData(chartData);
  };
  
  // Function to group data by month
  const groupDataByMonth = (data, semester) => {
    const months = getAvailableMonths(semester);
    const groupedData = [];
    
    months.forEach(month => {
      const monthData = data.filter(record => {
        if (!record.Distribution_Date) return false;
        
        const date = new Date(record.Distribution_Date);
        const recordMonth = date.getMonth() + 1;
        
        return recordMonth === month;
      });
      
      groupedData.push({
        label: getMonthName(month),
        value: monthData.length,
        color: '#861F41'
      });
    });
    
    return groupedData;
  };
  
  // Function to group data by week
  const groupDataByWeek = (data) => {
    const weeks = [1, 2, 3, 4, 5]; // Weeks in a month
    const groupedData = [];
    
    weeks.forEach(week => {
      const weekData = data.filter(record => {
        if (!record.Distribution_Date) return false;
        
        const date = new Date(record.Distribution_Date);
        const weekOfMonth = getWeekOfMonth(date);
        
        return weekOfMonth === week;
      });
      
      groupedData.push({
        label: `Week ${week}`,
        value: weekData.length,
        color: '#861F41'
      });
    });
    
    return groupedData;
  };
  
  // Function to group data by day
  const groupDataByDay = (data, week) => {
    const days = [1, 2, 3, 4, 5]; // Monday to Friday
    const groupedData = [];
    
    days.forEach(day => {
      const dayData = data.filter(record => {
        if (!record.Distribution_Date) return false;
        
        const date = new Date(record.Distribution_Date);
        const dayOfWeek = date.getDay();
        const weekOfMonth = getWeekOfMonth(date);
        
        return dayOfWeek === day && weekOfMonth.toString() === week;
      });
      
      groupedData.push({
        label: getDayName(day),
        value: dayData.length,
        color: '#861F41'
      });
    });
    
    return groupedData;
  };
  
  // Function to get the week of the month for a date
  const getWeekOfMonth = (date) => {
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const dayOfMonth = date.getDate();
    
    // Adjust for starting day of the week
    const dayOffset = firstDayOfMonth.getDay();
    
    // Calculate the week number (1-indexed)
    return Math.ceil((dayOfMonth + dayOffset) / 7);
  };
  
  // Get month name from number
  const getMonthName = (monthNumber) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[parseInt(monthNumber) - 1];
  };
  
  // Get day name from number
  const getDayName = (dayNumber) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[parseInt(dayNumber)];
  };
  
  // Get available months for the selected semester
  const getAvailableMonths = (semester = selectedSemester) => {
    if (semester === 'fall2024') {
      return [8, 9, 10, 11, 12]; // August to December
    } else if (semester === 'spring2024') {
      return [1, 2, 3, 4, 5]; // January to May
    } else {
      // For current (Spring 2025), show January to May
      return [1, 2, 3, 4, 5];
    }
  };
  
  // Get available weeks for the selected month
  const getAvailableWeeks = () => {
    return [1, 2, 3, 4, 5]; // Weeks in a month
  };
  
  // Get working days (Monday to Friday)
  const getWorkingDays = () => {
    return [1, 2, 3, 4, 5]; // Monday to Friday
  };
  
  // Find the maximum value in chart data for scaling
  const getMaxChartValue = () => {
    if (chartData.length === 0) return 100;
    return Math.max(...chartData.map(item => item.value), 1);
  };
  
  // If still checking session, show loading spinner
  if (checkingSession) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#861F41] mb-4"></div>
            <p className="text-gray-600">Loading visualization...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#861F41]">Student Data Visualization</h1>
          <button 
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
          >
            Back to Dashboard
          </button>
        </div>
        
        {error && (
          <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        {/* Filters */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-lg font-bold mb-4 text-[#861F41]">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Semester Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
              <select
                value={selectedSemester}
                onChange={(e) => {
                  setSelectedSemester(e.target.value);
                  setSelectedMonth(''); // Reset month when semester changes
                  setSelectedWeek(''); // Reset week when semester changes
                  setSelectedDay(''); // Reset day when semester changes
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#861F41]"
              >
                <option value="current">Spring 2025</option>
                <option value="fall2024">Fall 2024</option>
                <option value="spring2024">Spring 2024</option>
              </select>
            </div>
            
            {/* Month Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
              <select
                value={selectedMonth}
                onChange={(e) => {
                  setSelectedMonth(e.target.value);
                  setSelectedWeek(''); // Reset week when month changes
                  setSelectedDay(''); // Reset day when month changes
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#861F41]"
              >
                <option value="">All Months</option>
                {getAvailableMonths().map((month) => (
                  <option key={month} value={month}>
                    {getMonthName(month)}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Week Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Week</label>
              <select
                value={selectedWeek}
                onChange={(e) => {
                  setSelectedWeek(e.target.value);
                  setSelectedDay(''); // Reset day when week changes
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#861F41]"
                disabled={!selectedMonth} // Disable if no month is selected
              >
                <option value="">All Weeks</option>
                {getAvailableWeeks().map((week) => (
                  <option key={week} value={week}>
                    Week {week}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Day Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Day of Week</label>
              <select
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#861F41]"
                disabled={!selectedWeek} // Disable if no week is selected
              >
                <option value="">All Days</option>
                {getWorkingDays().map((day) => (
                  <option key={day} value={day}>
                    {getDayName(day)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* Visualization */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-lg font-bold mb-4 text-[#861F41]">Student Count Visualization</h2>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#861F41]"></div>
              <p className="ml-2 text-gray-600">Loading data...</p>
            </div>
          ) : (
            <div>
              {/* Summary */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-md font-semibold mb-2">Summary</h3>
                <p className="text-gray-700">
                  <span className="font-bold">Total Students:</span> {studentCount}
                </p>
                <p className="text-gray-700">
                  <span className="font-bold">Semester:</span> {
                    selectedSemester === 'current' ? 'Spring 2025' :
                    selectedSemester === 'fall2024' ? 'Fall 2024' : 'Spring 2024'
                  }
                </p>
                {selectedMonth && (
                  <p className="text-gray-700">
                    <span className="font-bold">Month:</span> {getMonthName(selectedMonth)}
                  </p>
                )}
                {selectedWeek && (
                  <p className="text-gray-700">
                    <span className="font-bold">Week:</span> Week {selectedWeek}
                  </p>
                )}
                {selectedDay && (
                  <p className="text-gray-700">
                    <span className="font-bold">Day:</span> {getDayName(selectedDay)}
                  </p>
                )}
              </div>
              
              {/* Bar Chart Visualization */}
              <div className="h-64 relative mb-4 border border-gray-200 rounded-lg">
                {chartData.length > 0 ? (
                  <div className="flex items-end justify-around h-full p-4">
                    {chartData.map((item, index) => {
                      const maxValue = getMaxChartValue();
                      const height = item.value > 0 ? (item.value / maxValue) * 100 : 0;
                      
                      return (
                        <div key={index} className="flex flex-col items-center w-1/6">
                          <div 
                            className="bg-[#861F41] rounded-t-md w-full"
                            style={{ 
                              height: `${height}%`,
                              minHeight: item.value > 0 ? '20px' : '0',
                              transition: 'height 0.5s ease-in-out'
                            }}
                          >
                            <div className="text-white text-center p-1 text-sm font-bold">
                              {item.value}
                            </div>
                          </div>
                          <div className="text-xs text-center mt-2 font-medium text-gray-700">
                            {item.label}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex justify-center items-center h-full">
                    <p className="text-gray-500">No data available for the selected filters</p>
                  </div>
                )}
              </div>
              
              {/* Chart Legend */}
              <div className="flex justify-center mb-6">
                <div className="text-sm text-gray-700">
                  {!selectedMonth ? (
                    <span>Showing student count by month</span>
                  ) : !selectedWeek ? (
                    <span>Showing student count by week in {getMonthName(selectedMonth)}</span>
                  ) : !selectedDay ? (
                    <span>Showing student count by day in Week {selectedWeek}</span>
                  ) : (
                    <span>Showing student count for {getDayName(selectedDay)}</span>
                  )}
                </div>
              </div>
              
              {/* Additional Stats */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-md font-semibold mb-2">Disclaimer Signed</h3>
                  <p className="text-gray-700">
                    <span className="font-bold">Yes:</span> {
                      filteredData.filter(record => record.Disclaimer_Signed).length
                    }
                  </p>
                  <p className="text-gray-700">
                    <span className="font-bold">No:</span> {
                      filteredData.filter(record => !record.Disclaimer_Signed).length
                    }
                  </p>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-md font-semibold mb-2">Active U-Pass Cards</h3>
                  <p className="text-gray-700">
                    <span className="font-bold">With Card:</span> {
                      filteredData.filter(record => record.Active_U_Pass_Card).length
                    }
                  </p>
                  <p className="text-gray-700">
                    <span className="font-bold">Without Card:</span> {
                      filteredData.filter(record => !record.Active_U_Pass_Card).length
                    }
                  </p>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-md font-semibold mb-2">Metro Accounts</h3>
                  <p className="text-gray-700">
                    <span className="font-bold">With Account:</span> {
                      filteredData.filter(record => record.Metro_Acct).length
                    }
                  </p>
                  <p className="text-gray-700">
                    <span className="font-bold">Without Account:</span> {
                      filteredData.filter(record => !record.Metro_Acct).length
                    }
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Visualization;
