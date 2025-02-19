// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

// const formatDate = (date) => {
//   const d = new Date(date);
//   if (isNaN(d)) return "";

//   const hours = String(d.getUTCHours()).padStart(2, '0');
//   const minutes = String(d.getUTCMinutes()).padStart(2, '0');
//   const seconds = String(d.getUTCSeconds()).padStart(2, '0');

//   return ` ${hours}:${minutes}:${seconds}`;
// };

// function Home() {
//   const [adminRole, setAdminRole] = useState("");
//   const [empId, setEmpId] = useState("");
//   const [employeeData, setEmployeeData] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [token, setToken] = useState(null);
//   const navigate = useNavigate();
//   const itemsPerPage = 10;

//   useEffect(() => {
//     const storedToken = localStorage.getItem('authToken');
//     const userToken = localStorage.getItem('empId');
//     const adminCheck = localStorage.getItem('role');

//     if (!storedToken || adminCheck !== 'admin') {
//       navigate('/login');
//       return;
//     }

//     setToken(storedToken);
//     setAdminRole(adminCheck);
//     setEmpId(userToken === 'null' ? "" : userToken);
//   }, [navigate]);

//   const handleLogout = () => {
//     localStorage.removeItem('authToken');
//     localStorage.removeItem('role');
//     navigate('/login');
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!empId) {
//       return setError("Please enter an Employee ID.");
//     }

//     setLoading(true);
//     setError("");

//     // Construct the URL for the API call
//     let url = `http://localhost:4000/all-working-hours?role=${adminRole}`;

//     if (empId) {
//       url += `&empId=${empId}`;
//     }
//     if (startDate) {
//       url += `&startDate=${startDate}`;
//     }
//     if (endDate) {
//       url += `&endDate=${endDate}`;
//     }

//     try {
//       const response = await fetch(url, {
//         method: 'GET',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setEmployeeData(data);
//         console.log(data);
//       } else {
//         setError(data.error || "Something went wrong.");
//       }
//     } catch (error) {
//       setError("Failed to fetch employee data.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filteredRecords = employeeData.records ? employeeData.records.filter(record => {
//     const recordDate = new Date(record.date);
//     const start = startDate ? new Date(startDate) : null;
//     const end = endDate ? new Date(endDate) : null;

//     if (start && end) {
//       return recordDate >= start && recordDate <= end;
//     }
//     if (start) {
//       return recordDate >= start;
//     }
//     if (end) {
//       return recordDate <= end;
//     }
//     return true;
//   }) : [];

//   const records = filteredRecords || [];

//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = records.slice(indexOfFirstItem, indexOfLastItem) || [];
//   const totalPages = records.length ? Math.ceil(records.length / itemsPerPage) : 1;

//   const handlePreviousPage = () => {
//     if (currentPage > 1) setCurrentPage(currentPage - 1);
//   };

//   const handleNextPage = () => {
//     if (currentPage < totalPages) setCurrentPage(currentPage + 1);
//   };
//   return (
//     <div className="container mx-auto p-6">
//       <div className="flex justify-between items-center">
//         <h2 className="text-2xl font-bold">Employee Detail</h2>
//         <button onClick={handleLogout} className="px-4 py-2 bg-red-600 text-white rounded-md">
//           Logout
//         </button>
//       </div>
//       <form onSubmit={handleSubmit} className="mt-6 space-y-4">
//         <div>
//           <label className="block">Employee ID</label>
//           <input 
//             type="text" 
//             value={empId} 
//             onChange={(e) => setEmpId(e.target.value)} 
//             className="border p-2 w-full" 
//             placeholder="Enter Employee ID"
//           />
//         </div>
//         <div>
//           <label className="block">Start Date</label>
//           <input 
//             type="date" 
//             value={startDate} 
//             onChange={(e) => setStartDate(e.target.value)} 
//             className="border p-2 w-full" 
//           />
//         </div>
//         <div>
//           <label className="block">End Date</label>
//           <input 
//             type="date" 
//             value={endDate} 
//             onChange={(e) => setEndDate(e.target.value)} 
//             className="border p-2 w-full" 
//           />
//         </div>
//         <button 
//           type="submit" 
//           className="px-4 py-2 bg-blue-600 text-white rounded-md w-full"
//         >
//           {loading ? "Loading..." : "Find"}
//         </button>
//       </form>
//       {error && <p className="text-red-500 mt-4">{error}</p>}
//       {employeeData && !loading && records.length > 0 && (
//         <div className="mt-10 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
//           <table className="min-w-full divide-y divide-gray-300">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
//                   Date
//                 </th>
//                 <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
//                   CheckIn Time
//                 </th>
//                 <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
//                   CheckOut Time
//                 </th>
//                 <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
//                   Working Hours
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200 bg-white">
//               {currentItems.map((record, index) => {
//                 return (
//                   <>
//                     {record.checkInCheckOutPairs.map((pair, idx) => {
//                       const checkInTime = new Date(pair.checkIn);
//                       const checkOutTime = new Date(pair.checkOut);
//                       const workingHours = (checkOutTime - checkInTime) / (1000 * 60 * 60);

//                       const isSameTime = checkInTime.getTime() === checkOutTime.getTime();
//                       const displayWorkingHours = isSameTime ? 0 : workingHours;

//                       return (
//                         <tr key={idx}>
//                           {idx === 0 && (
//                             <td rowSpan={record.checkInCheckOutPairs.length} className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{record.date}</td>
//                           )}
//                           <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{formatDate(pair.checkIn)}</td>
//                           <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{formatDate(pair.checkOut)}</td>
//                           <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
//                             {displayWorkingHours === 0 ? "0" : displayWorkingHours.toFixed(2)}
//                           </td>
//                         </tr>
//                       );
//                     })}
//                   </>
//                 );
//               })}
//             </tbody>
//           </table>

//           <div className="mt-4 text-right">
//             <p className="text-sm font-semibold text-gray-900">
//               Total Working Hours: {isNaN(employeeData.total_working_hours) ? "N/A" : employeeData.total_working_hours}
//             </p>
//           </div>

//           <div className="mt-4 flex justify-between">
//             <button
//               onClick={handlePreviousPage}
//               className="px-4 py-2 bg-indigo-600 text-white rounded-md"
//               disabled={currentPage === 1}
//             >
//               Previous
//             </button>
//             <button
//               onClick={handleNextPage}
//               className="px-4 py-2 bg-indigo-600 text-white rounded-md"
//               disabled={currentPage === totalPages}
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       )}
//       {records.length === 0 && !loading && !error && (
//         <div className="mt-4 text-center text-gray-500">
//           <p>No data available for the given Employee ID within the selected date range.</p>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Home;


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
        const response = await fetch("http://localhost:4000/user", {
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

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Employee Detail</h2>
        <button onClick={handleLogout} className="px-4 py-2 bg-red-600 text-white rounded-md">
          Logout
        </button>
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
