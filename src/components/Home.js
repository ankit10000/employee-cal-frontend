import React, { useState } from 'react';

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
    const itemsPerPage = 10;

    const handleChange = (e) => setEmpId(e.target.value);
    const handleStartDateChange = (e) => setStartDate(e.target.value);
    const handleEndDateChange = (e) => setEndDate(e.target.value);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Find button clicked!");

        // Log the entered employee ID and the selected date range
        console.log("Employee ID:", empId);
        console.log("Start Date:", startDate);
        console.log("End Date:", endDate);

        if (!empId) {
            return setError("Please enter an Employee ID.");
        }

        setLoading(true);
        setError("");

        // Construct the URL with the employee ID and selected date range
        let url = `http://localhost:4000/working-hours-id?empId=${empId}`;

        if (startDate) {
            url += `&startDate=${startDate}`;
        }
        if (endDate) {
            url += `&endDate=${endDate}`;
        }

        try {
            const response = await fetch(url);
            const data = await response.json();
            console.log("Fetched Data:", data);

            if (response.ok) {
                setEmployeeData(data);  // Save the complete data, including total_working_hours
            } else {
                setError(data.error || "Something went wrong.");
            }
        } catch (error) {
            setError("Failed to fetch employee data.");
        } finally {
            setLoading(false);
        }
    };

    // Filter records based on selected date range
    const filteredRecords = employeeData.records ? employeeData.records.filter(record => {
        const recordDate = new Date(record.date); // Convert the record date to Date object
        const start = startDate ? new Date(startDate) : null; // Start date
        const end = endDate ? new Date(endDate) : null; // End date

        // Log the dates for debugging
        console.log('Record Date:', recordDate, 'Start Date:', start, 'End Date:', end);

        // If both startDate and endDate are provided, filter accordingly
        if (start && end) {
            return recordDate >= start && recordDate <= end;
        }
        // If only one of the dates is provided, filter accordingly
        if (start) {
            return recordDate >= start;
        }
        if (end) {
            return recordDate <= end;
        }
        return true; // If no date range is provided, return all records
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

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm space-y-6">
                <div>
                    <label htmlFor="empId" className="block text-sm font-medium text-gray-900">
                        Employee Id
                    </label>
                    <div className="mt-2">
                        <input
                            id="empId"
                            name="empId"
                            type="text"
                            value={empId}
                            onChange={handleChange}
                            required
                            autoComplete="empId"
                            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                        />
                    </div>
                </div>

                {/* Date Range Picker */}
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
                        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        {loading ? "Loading..." : "Find"}
                    </button>

                </div>
            </div>

            {error && (
                <div className="mt-4 text-red-500 text-center">
                    <p>{error}</p>
                </div>
            )}

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
                                            const workingHours = (checkOutTime - checkInTime) / (1000 * 60 * 60); // Convert milliseconds to hours

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
