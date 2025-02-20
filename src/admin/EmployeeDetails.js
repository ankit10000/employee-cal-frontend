import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
const formatDate = (date) => {
    const d = new Date(date);
    if (isNaN(d)) return "";

    const hours = String(d.getUTCHours()).padStart(2, '0');
    const minutes = String(d.getUTCMinutes()).padStart(2, '0');
    const seconds = String(d.getUTCSeconds()).padStart(2, '0');

    return ` ${hours}:${minutes}:${seconds}`;
};
function EmployeeDetails() {
    const { userId } = useParams();
    const [employee, setEmployee] = useState({});
    const navigate = useNavigate();
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
    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const response = await fetch(`https://employee-cal.onrender.com/users/${userId}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) throw new Error("Failed to fetch employee");

                const employeeData = await response.json();
                setEmployee(employeeData);
                console.log("Employee Data:", employeeData);
                setLoading(false);
            } catch (error) {
                console.error(error.message);
                setLoading(false);
            }
        };

        fetchEmployee();
    }, [userId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userId) {
            return setError("Please enter an Employee ID.");
        }

        setLoading(true);
        setError("");

        let url = `https://employee-cal.onrender.com/all-working-hours?empId=${userId}`;

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
        <div className="container mx-auto p-6">

            <button onClick={() => navigate(-1)} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300">
                Back
            </button>
            <div className="flex justify-between items-start space-x-6">
                <div className="mt-6 p-6 bg-white shadow-lg rounded-lg w-full sm:w-1/2">
                    <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Employee Details</h2>
                    <div className="space-y-4">
                        <p className="text-gray-700"><strong>Emp ID:</strong> {employee.userId}</p>
                        <p className="text-gray-700"><strong>Name:</strong> {employee.name}</p>
                        <p className="text-gray-700"><strong>Role:</strong> {employee.role}</p>
                        <p className="text-gray-700"><strong>Email:</strong> {employee.email}</p>
                        <p className="text-gray-700"><strong>Phone:</strong> {employee.contactNumber}</p>
                        <p className="text-gray-700"><strong>Address:</strong> {employee.address}</p>
                        <p className="text-gray-700"><strong>Joining Date:</strong> {employee.joiningDate ? new Date(employee.joiningDate).toISOString().split("T")[0] : "N/A"}</p>
                    </div>
                </div>
                <div className="mt-6 p-6 bg-white shadow-lg rounded-lg w-full sm:w-1/2 space-y-6">


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

                    <div>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={loading}
                            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            {loading ? (
                                <div className="flex items-center">
                                    <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                                    </svg>
                                    Finding...
                                </div>
                            ) : (
                                'Find'
                            )}
                        </button>
                    </div>
                </div>
            </div>

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
        </div>
    );
}

export default EmployeeDetails;
