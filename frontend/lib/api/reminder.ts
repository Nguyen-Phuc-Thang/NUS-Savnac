export async function createReminder(eventId: string, remindAt: Date) {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/reminder/create`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ eventId, remindAt }),
        },
    );

    if (!response.ok) {
        throw new Error('Failed to create reminder');
    }

    return response.json();
}

export async function getReminderById(reminderId: string) {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/reminder/get-reminder`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ reminderId }),
        },
    );

    if (!response.ok) {
        throw new Error('Failed to get reminder');
    }

    return response.json();
}
