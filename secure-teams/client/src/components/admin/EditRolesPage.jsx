import React, { useState, useEffect } from "react";
import axios from "axios";

const EditRolesPage = () => {
	const [users, setUsers] = useState([]);
	const [selectedUser, setSelectedUser] = useState("");
	const [selectedRole, setSelectedRole] = useState("");

	useEffect(() => {
		console.log("Fetching users...");
		try {
			axios.get("http://localhost:3000/api/users").then((response) => {
				console.log("Users:", response.data);
				setUsers(response.data);
			});
		} catch (error) {
			console.log("Error fetching users:", error);
		}
	}, []);

	const editRole = async () => {
		try {
			const response = await axios.put(
				`http://localhost:3000/api/users/${selectedUser}`,
				{
					role: selectedRole,
					email: selectedUser,
				}
			);
			console.log("Role edited successfully:", response.data);
			setUsers(
				users.map((user) =>
					user.email === selectedUser ? { ...user, role: selectedRole } : user
				)
			);
			alert("Role edited successfully to " + selectedRole);
		} catch (error) {
			console.error("Error editing role:", error);
		}
	};

	return (
		<div>
			<h1 className="text-3xl font-bold text-left pl-10 pt-10">Edit Roles</h1>
			<div className="flex justify-left items-center mt-10 pl-10">
				<div className="w-1/2">
					<form>
						<div className="mb-4">
							<label
								className="block text-gray-700 text-sm font-bold mb-2"
								htmlFor="email"
							>
								Email
							</label>
							<select
								className="block appearance-none w-full bg-white border border-gray-400 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:border-gray-500"
								id="email"
								value={selectedUser}
								onChange={(e) => setSelectedUser(e.target.value)}
							>
								<option value="">Select an email</option>
								{users
									.filter((user) => user.role !== "employee")
									.map((user, index) => (
										<option key={index} value={user.email}>
											{user.email} ({user.role})
										</option>
									))}
							</select>
						</div>
						<div className="mb-6">
							<label
								className="block text-gray-700 text-sm font-bold mb-2"
								htmlFor="role"
							>
								Role
							</label>
							<div className="relative">
								<select
									className="block appearance-none w-full bg-white border border-gray-400 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:border-gray-500"
									id="role"
									value={selectedRole}
									onChange={(e) => setSelectedRole(e.target.value)}
								>
									<option value="">Select a role</option>
									<option value="Team Lead">Team Lead</option>
									<option value="Team Member">Team Member</option>
									<option value="Manager">Manager</option>
								</select>
							</div>
						</div>
						<div className="flex items-center justify-between">
							<button
								className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
								type="button"
								onClick={editRole}
							>
								Edit Role
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default EditRolesPage;