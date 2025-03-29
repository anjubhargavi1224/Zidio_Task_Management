const API_URL = "http://localhost:5000/tasks"; // Update if needed
const token = localStorage.getItem("token");
// console.log(token);

export const createTask = async (taskData, token) => {
    const response = await fetch(`${API_URL}/create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(taskData),
    });
    return await response.json();
};

export const createSelfTask = async (taskData, token) => {
    const response = await fetch(`${API_URL}/create/self`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(taskData),
    });
    return await response.json();
};

export const getTasks = async (token) => {
    if (!token) {
        throw new Error("No token found. Please log in.");

    }
    const response = await fetch(API_URL, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return await response.json();
};

export const updateTaskStatus = async (taskId, status, token) => {
    const response = await fetch(`${API_URL}/update/status/${taskId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
    });
    return await response.json();
};

export const deleteTask = async (taskId, token) => {
    const response = await fetch(`${API_URL}/delete/${taskId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return await response.json();
};


export const updateTaskDetails = async (taskId, updatedTask, token) => {
    try {
        const response = await fetch(`${API_URL}/update/${taskId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updatedTask),
        });

        if (!response.ok) {
            throw new Error("Failed to update task");
        }

        return await response.json();
    } catch (error) {
        console.error("Error updating task details:", error);
        throw error;
    }
};