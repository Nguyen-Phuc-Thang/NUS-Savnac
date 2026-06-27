


export function taskCompletionProgress(tasks: any[]) {
    let completedCount = tasks.reduce((count, task) => count + (task.completed ? 1 : 0), 0);
    let totalCount = tasks.length;
    let ratio = totalCount === 0 ? 0 : completedCount / totalCount;
    if (tasks.length === 0) return {
        ratio: 0,
        text: "No tasks",
    }
    return {
        ratio: ratio,
        text: `${completedCount} / ${totalCount}`,
    }
}