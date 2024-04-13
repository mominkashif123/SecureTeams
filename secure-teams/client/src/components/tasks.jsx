
import React, { useState, useEffect } from 'react';
import Navbar from './navbar';
import Sidepanel from './sidepanel';
import axios from 'axios';
import '../styles/tasks.css';

const TasksPage = () => {
    const initialTheme = localStorage.getItem('themeColor') || '#68d391';
    const [theme, setTheme] = useState(initialTheme);
    const [inputTitle, setInputTitle] = useState('');
    const [inputDesc, setInputDesc] = useState('');
    const [selectedUser, setSelectedUser] = useState('');
    const [users, setUsers] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [assignedTasks, setAssignedTasks] = useState([]);

    useEffect(() => {
        fetchUsers();
        fetchTasks();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get("https://secureteams.onrender.com/api/newUsers");
            console.log("Fetched Users:", response.data);
            setUsers(response.data);
        } catch (error) {
            console.log("Error fetching users:", error);
        }
    };

    const fetchTasks = async () => {
        try {
            const response = await axios.get("https://secureteams.onrender.com/api/tasks");
            if (Array.isArray(response.data)) {
                setTasks(response.data);
                fetchAssignedTasks(response.data);
            } else {
                console.error("Expected tasks to be an array but received:", typeof response.data);
                setTasks([]); // Set as empty array or handle accordingly
            }
        } catch (error) {
            console.log("Error fetching tasks:", error);
            setTasks([]); // Ensure it's always an array
        }
    };

	const handleThemeChange = (newTheme) => {
		setTheme(newTheme);
		document.documentElement.style.setProperty(
			"--navbar-theme-color",
			newTheme
		);
	};

    const fetchAssignedTasks = (tasks) => {
        const filteredTasks = tasks.filter(task => task.assignedTo === selectedUser);
        setAssignedTasks(filteredTasks);
    };

    const handleAddTask = async (e) => {
        e.preventDefault();
        if (!inputTitle || !inputDesc || !selectedUser) {
            alert("Please fill in all fields and select a member.");
            return;
        }
        try {
            const newTask = {
                title: inputTitle,
                description: inputDesc,
                assignedTo: selectedUser
            };
            const response = await axios.post("https://secureteams.onrender.com/api/tasks", newTask);
            if (response.status === 201) {
                const updatedTasks = [...tasks, response.data];
                setTasks(updatedTasks);
                fetchAssignedTasks(updatedTasks);
                setInputTitle('');
                setInputDesc('');
                alert("Task added successfully.");
            }
        } catch (error) {
            console.log("Error adding task:", error);
            alert("Error adding task. Please try again.");
        }
    };

    const handleSelectUser = (userId) => {
        setSelectedUser(userId);
    };

    return (
        <div className="flex flex-col h-screen">
            <Sidepanel show={true} onThemeChange={handleThemeChange} />
            <Navbar selectedTheme={theme} onThemeChange={handleThemeChange} />

            <div className="flex-grow flex justify-center items-center">
                <div className="container mx-auto max-w-md ml-8" style={{ backgroundColor: theme, color: 'white', maxHeight: '80vh', marginTop: '30px', overflow: 'auto', borderRadius: '10px', paddingTop: '0' }}> 
                 <h2 className="text-lg font-semibold text-center" style={{ marginTop: '0' }}>WELCOME TO TASKS PAGE!</h2> 
                    <div className="text-center">
                        <h2>Add New Task</h2>
                        <form onSubmit={handleAddTask} className="mx-auto max-w-md">
                            <div className="mb-4">
                                <label htmlFor="title" className="mr-2">Title:</label>
                                <input
                                    type="text"
                                    id="title"
                                    value={inputTitle}
                                    onChange={(e) => setInputTitle(e.target.value)}
                                    className="p-2 rounded border outline-none inputText"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="description" className="mr-2">Description:</label>
                                <input
                                    type="text"
                                    id="description"
                                    value={inputDesc}
                                    onChange={(e) => setInputDesc(e.target.value)}
                                    className="p-2 rounded border outline-none inputText"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="user" className="mr-2">Assign To:</label>
                                <select
                                    className="block appearance-none w-full bg-white border border-gray-400 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:border-gray-500"
                                    id="user"
                                    value={selectedUser}
                                    onChange={(e) => handleSelectUser(e.target.value)}
                                >
                                    <option value="">Select a user</option>
                                    {users.map((user) => (
                                        <option key={user.id} value={user.id}>
                                            {user.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Add Task</button>
                        </form>
                    </div>
                    <div>
                        <ul>
                            {tasks.map((task) => (
                                <li key={task.id}>
                                    <strong>{task.title}</strong>: {task.description}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
            <div className="assigned-tasks-panel">
                <ul>
                    {assignedTasks.map((task) => (
                        <li key={task.id}>
                            <strong>{task.title}</strong>: {task.description} (Assigned to: {task.assignedTo})
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default TasksPage;

