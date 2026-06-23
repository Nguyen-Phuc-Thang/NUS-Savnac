

export async function getEventsByUserId(userId: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/event/get-events-by-user-id?userId=${userId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch events');
    }

    return response.json();
}

export async function getEventsByCourseId(courseId: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/event/get-events-by-course-id?courseId=${courseId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch events');
    }

    return response.json();
}

export async function addEvent(userId: string, eventType: "CLASS" | "DEADLINE" | "EXAM" | "OTHERS", eventTitle: string, eventWeek: string, eventDay: string, eventStartTime: string, eventEndTime: string, eventVenue?: string, courseId?: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/event/add-event`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userId,
            eventType,
            eventTitle,
            eventWeek,
            eventDay,
            eventStartTime,
            eventEndTime,
            eventVenue,
            courseId
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to create new event');
    }

    return response.json();
}

export async function updateEvent(eventId: string, eventType: "CLASS" | "DEADLINE" | "EXAM" | "OTHERS", eventTitle: string, eventWeek: string, eventDay: string, eventStartTime: string, eventEndTime: string, eventVenue?: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/event/update-event`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            eventId,
            eventType,
            eventTitle,
            eventWeek,
            eventDay,
            eventStartTime,
            eventEndTime,
            eventVenue
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to update event');
    }

    return response.json();
}

export async function deleteEvent(eventId: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/event/delete-event`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ eventId }),
    });

    if (!response.ok) {
        throw new Error('Failed to delete event');
    }

    return response.json();
}