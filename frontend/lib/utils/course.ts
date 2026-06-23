

export function generateWorkload(nusCourseData: any) {
    return [
        { type: "Lecture", hours: nusCourseData.workload[0], color: "bg-blue-300" },
        { type: "Tutorial", hours: nusCourseData.workload[1], color: "bg-green-300" },
        { type: "Lab", hours: nusCourseData.workload[2], color: "bg-red-300" },
        { type: "Project", hours: nusCourseData.workload[3], color: "bg-purple-300" },
        { type: "Preparation", hours: nusCourseData.workload[4], color: "bg-yellow-300" }
    ]
}