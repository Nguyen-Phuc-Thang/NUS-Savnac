

export async function getAllNUSCourses() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/course/all-nus-courses`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch NUS courses");
    }

    return response.json();
}

export async function getNUSCourseData(courseCode: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/course/nus-course-data/${courseCode}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch ${courseCode} details`);
    }

    return response.json();
}

export async function getAllCourses(userId: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/course/all-courses?userId=${userId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch courses");
    }

    return response.json();
}

export async function getCourseInfo(courseCode: string, userId: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/course/course-info?courseCode=${courseCode}&userId=${userId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch ${courseCode} details`);
    }

    return response.json();
}

export async function addCourse(userId: string, courseCode: string, courseTitle: string, courseType: "NUS" | "CUSTOM") {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/course/add-course`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            userId: userId,
            courseCode: courseCode,
            courseTitle: courseTitle,
            courseType: courseType
        }),
    });

    if (!response.ok) {
        throw new Error("Failed to add new course");
    }

    return response.json();
}


export async function deleteCourse(courseId: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/course/delete-course`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            courseId: courseId,
        }),
    });

    if (!response.ok) {
        throw new Error("Failed to delete course");
    }

    return response.json();
}
