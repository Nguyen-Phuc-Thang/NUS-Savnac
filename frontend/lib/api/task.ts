
export async function getTasksByCourseId(courseId: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/task/get-all-tasks-by-course?courseId=${courseId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch tasks');
    }

    return response.json();
}

export async function getTasksByUserId(userId: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/task/get-all-tasks-by-user?userId=${userId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch tasks');
    }

    return response.json();
}

export async function createTask(userId: string, name: string, taskType: "WEEKLY" | "TODAY", courseId?: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/task/create-task`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userId: userId,
            name: name,
            taskType: taskType,
            courseId: courseId
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to create task');
    }

    return response.json();
}

export async function toggleTaskCompletion(taskId: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/task/toggle-task`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            taskId: taskId,
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to toggle task completion');
    }

    return response.json();
}

export async function updateTaskName(taskId: string, name: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/task/update-task-name`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            taskId: taskId,
            name: name,
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to update task name');
    }

    return response.json();
}

export async function deleteTask(taskId: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/task/delete-task?taskId=${taskId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to delete task');
    }

    return response.json();
}