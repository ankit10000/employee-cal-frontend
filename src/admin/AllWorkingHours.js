

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AllWorkingHours() {
  // const [adminRole, setAdminRole] = useState("");
  // const [empId, setEmpId] = useState("");
  const [employeeData, setEmployeeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    // const userToken = localStorage.getItem("empId");
    const adminCheck = localStorage.getItem("role");

    if (!storedToken || adminCheck?.toLowerCase() !== "admin") {
      navigate("/");
      return;
    }

    setToken(storedToken);
    // setAdminRole(adminCheck);
    // setEmpId(userToken !== "null" ? userToken : "");

  }, [navigate]);

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch("https://employee-cal.onrender.com/user", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        // ✅ Filter out admins, keeping only employees
        const employees = data.users.filter(user => user.role !== "admin");

        setEmployeeData(employees);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to load employee data");
        setLoading(false);
      }
    };


    fetchData();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("role");
    navigate("/");
  };
  const handkeRegister = () => {
    navigate("/register");
  }

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Employee Detail</h2>
          <button onClick={handkeRegister} className="px-4 py-2 bg-blue-600 text-white rounded-md">
            Add Employee
          </button>
        </div>
        <div className="flex justify-between items-center">
          <button onClick={handleLogout} className="px-4 py-2 bg-red-600 text-white rounded-md">
            Logout
          </button>
        </div>
      </div>


      {error && <p className="text-red-500 mt-4">{error}</p>}

      {loading ? (
        <p className="mt-4">Loading...</p>
      ) : (
        <div className="mt-10 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Emp_Id</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Emp_Name</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Yesterday_Working_Hour</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Joining_Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {employeeData.length > 0 ? (
                employeeData.map((employee) => (
                  <tr
                    key={employee._id}
                    className="cursor-pointer hover:bg-gray-100" // Add hover effect
                    onClick={() => navigate(`/employee_details/${employee.userId}`)} // Redirect on click
                  >
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{employee.userId}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{employee.name}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">N/A</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {employee.joiningDate ? new Date(employee.joiningDate).toISOString().split("T")[0] : "N/A"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-sm text-gray-500">
                    No employees found
                  </td>
                </tr>
              )}
            </tbody>


          </table>
        </div>
      )}
    </div>
  );
}

export default AllWorkingHours;
