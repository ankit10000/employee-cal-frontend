import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const formatDate = (date) => {
  const d = new Date(date);
  if (isNaN(d)) return "";

  const hours = String(d.getUTCHours()).padStart(2, '0');
  const minutes = String(d.getUTCMinutes()).padStart(2, '0');
  const seconds = String(d.getUTCSeconds()).padStart(2, '0');

  return ` ${hours}:${minutes}:${seconds}`;
};

function Home() {
  const [adminRole, setAdminRole] = useState("");
  const [empId, setEmpId] = useState("");
  const [employeeData, setEmployeeData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [token, setToken] = useState(null);
  const navigate = useNavigate();
  const itemsPerPage = 10;

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const userToken = localStorage.getItem('empId');
    const adminCheck = localStorage.getItem('role');

    if (!storedToken || adminCheck !== 'admin') {
      navigate('/login');
      return;
    }

    setToken(storedToken);
    setAdminRole(adminCheck);
    setEmpId(userToken);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!empId) {
      return setError("Please enter an Employee ID.");
    }

    setLoading(true);
    setError("");

    let url = `https://employee-cal.onrender.com/all-working-hours?role=${adminRole}`;

    if (startDate) {
      url += `&startDate=${startDate}`;
    }
    if (endDate) {
      url += `&endDate=${endDate}`;
    }

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
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

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Employee Detail</h2>
        <button onClick={handleLogout} className="px-4 py-2 bg-red-600 text-white rounded-md">
          Logout
        </button>
      </div>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="block">Start Date</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="border p-2 w-full" />
        </div>
        <div>
          <label className="block">End Date</label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="border p-2 w-full" />
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md w-full">
          {loading ? "Loading..." : "Find"}
        </button>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {employeeData.records && (
        <table className="table-auto w-full mt-6 border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Date</th>
              <th className="p-2">Check-In</th>
              <th className="p-2">Check-Out</th>
              <th className="p-2">Working Hours</th>
            </tr>
          </thead>
          <tbody>
            {employeeData.records.map((record, idx) => (
              <tr key={idx} className="border-t">
                <td className="p-2">{record.date}</td>
                <td className="p-2">{formatDate(record.checkIn)}</td>
                <td className="p-2">{formatDate(record.checkOut)}</td>
                <td className="p-2">{record.workingHours} hrs</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Home;
