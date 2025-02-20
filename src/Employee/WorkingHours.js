import React, { useState, useEffect } from 'react';

const formatDate = (date) => {
  const d = new Date(date);
  if (isNaN(d)) return "";

  const hours = String(d.getUTCHours()).padStart(2, '0');
  const minutes = String(d.getUTCMinutes()).padStart(2, '0');
  const seconds = String(d.getUTCSeconds()).padStart(2, '0');

  return ` ${hours}:${minutes}:${seconds}`;
};

function Home() {
  const [empId, setEmpId] = useState("");
  const [employeeData, setEmployeeData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [token, setToken] = useState(null);
  const itemsPerPage = 10;
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const userToken = localStorage.getItem('empId');
    setToken(storedToken);
    setEmpId(userToken);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    window.location.replace('/') // Refresh the page after logout
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!empId) {
      return setError("Please enter an Employee ID.");
    }

    setLoading(true);
    setError("");

    let url = `https://employee-cal.onrender.com/working-hours?empId=${empId}`;

    if (startDate) {
      url += `&startDate=${startDate}`;
    }
    if (endDate) {
      url += `&endDate=${endDate}`;
    }

    // Assuming the token is stored in localStorage
    const token = localStorage.getItem('authToken');

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,  // Add the token here
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setEmployeeData(data);
      } else {
        setError(data.error || "Something went wrong.");
      }
    } catch (error) {
      setError("Failed to fetch employee data.");
    } finally {
      setLoading(false);
    }
  };

  const filteredRecords = employeeData.records ? employeeData.records.filter(record => {
    const recordDate = new Date(record.date);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    if (start && end) {
      return recordDate >= start && recordDate <= end;
    }
    if (start) {
      return recordDate >= start;
    }
    if (end) {
      return recordDate <= end;
    }
    return true;
  }) : [];

  const records = filteredRecords || [];

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = records.slice(indexOfFirstItem, indexOfLastItem) || [];

  const totalPages = records.length ? Math.ceil(records.length / itemsPerPage) : 1;

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
          Employee Detail
        </h2>
      </div>
      {token && (
        <div className="absolute top-5 right-5">
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white font-semibold rounded-md shadow-md hover:bg-red-500"
          >
            Logout
          </button>
        </div>
      )}
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm space-y-6">
        {/* Employee ID Input */}
        <div>
          <label htmlFor="empId" className="block text-sm font-medium text-gray-900">
            Employee ID
          </label>
          <input
            id="empId"
            type="text"
            value={empId}
            className="block w-full mt-1 rounded-md bg-white px-3 py-1.5 text-base text-gray-900"
            disabled
          />
        </div>

        {/* Start Date Input */}
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-900">
            Start Date
          </label>
          <input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="block w-full mt-1 rounded-md bg-white px-3 py-1.5 text-base text-gray-900"
          />
        </div>

        {/* End Date Input */}
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-900">
            End Date
          </label>
          <input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="block w-full mt-1 rounded-md bg-white px-3 py-1.5 text-base text-gray-900"
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="button"
            onClick={handleSubmit}
            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {loading ? "Loading..." : "Find"}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 text-red-500 text-center">
          <p>{error}</p>
        </div>
      )}

      {/* Display Employee Data */}
      {employeeData && !loading && records.length > 0 && (
        <div className="mt-10 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                  Date
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  CheckIn Time
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  CheckOut Time
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Working Hours
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {currentItems.map((record, index) => {
                return (
                  <>
                    {record.checkInCheckOutPairs.map((pair, idx) => {
                      const checkInTime = new Date(pair.checkIn);
                      const checkOutTime = new Date(pair.checkOut);
                      const workingHours = (checkOutTime - checkInTime) / (1000 * 60 * 60);

                      const isSameTime = checkInTime.getTime() === checkOutTime.getTime();
                      const displayWorkingHours = isSameTime ? 0 : workingHours;

                      return (
                        <tr key={idx}>
                          {idx === 0 && (
                            <td rowSpan={record.checkInCheckOutPairs.length} className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{record.date}</td>
                          )}
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{formatDate(pair.checkIn)}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{formatDate(pair.checkOut)}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {displayWorkingHours === 0 ? "0" : displayWorkingHours.toFixed(2)}
                          </td>
                        </tr>
                      );
                    })}
                  </>
                );
              })}
            </tbody>
          </table>

          <div className="mt-4 text-right">
            <p className="text-sm font-semibold text-gray-900">
              Total Working Hours: {isNaN(employeeData.total_working_hours) ? "N/A" : employeeData.total_working_hours}
            </p>
          </div>

          <div className="mt-4 flex justify-between">
            <button
              onClick={handlePreviousPage}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md"
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <button
              onClick={handleNextPage}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md"
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {records.length === 0 && !loading && !error && (
        <div className="mt-4 text-center text-gray-500">
          <p>No data available for the given Employee ID within the selected date range.</p>
        </div>
      )}
    </div>
  );
}

export default Home;
