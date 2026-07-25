export async function getFolders(courseId: string) {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/folder/all-folders?courseId=${courseId}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        },
    );

    if (!response.ok) {
        throw new Error('Failed to fetch folders');
    }

    return response.json();
}

export async function addFolder(
    courseId: string,
    folderName: string,
    folderDescription: string,
) {
    console.log('Adding folder with details:', {
        courseId,
        folderName,
        folderDescription,
    });
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/folder/add-folder`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                courseId: courseId,
                name: folderName,
                description: folderDescription,
            }),
        },
    );

    console.log('Response from addFolder:', response);
    if (!response.ok) {
        throw new Error('Failed to add new folder');
    }

    return response.json();
}

export async function updateFolder(
    folderId: string,
    folderName: string,
    folderDescription: string,
) {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/folder/update-folder`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                folderId: folderId,
                folderName: folderName,
                folderDescription: folderDescription,
            }),
        },
    );

    if (!response.ok) {
        throw new Error('Failed to update folder');
    }

    return response.json();
}

export async function deleteFolder(folderId: string) {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/folder/delete-folder`,
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                folderId: folderId,
            }),
        },
    );

    if (!response.ok) {
        throw new Error('Failed to delete folder');
    }

    return response.json();
}
