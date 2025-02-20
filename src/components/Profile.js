import React,{useEffect, useState} from 'react'
import { useParams, useNavigate } from "react-router-dom";

function Profile() {
    const { userId } = useParams();
    const navigate = useNavigate();
        const [loading, setLoading] = useState(false);
    
        const [employee, setEmployee] = useState({});
    
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
return (
    <div className="flex justify-center items-center min-h-screen">
            <div className="mt-6 p-6 bg-white shadow-lg rounded-lg w-full sm:w-1/2">
    <button onClick={() => navigate('/working-hours')} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300">
                Back
            </button>
                    <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">My Profile</h2>
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
    </div>
)
}

export default Profile