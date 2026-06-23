
export async function getLinks(folderId: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/link/all-links?folderId=${folderId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch links. Please try again later.");
    }

    return response.json();
}


export async function createLink(folderId: string, title: string, url: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/link/create-link`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            folderId: folderId,
            title: title,
            url: url
        }),
    });

    if (!response.ok) {
        throw new Error("Failed to create link. Please try again later.");
    }

    return response.json();
}

export async function updateLink(linkId: string, newTitle: string, newUrl: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/link/update-link`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            linkId: linkId,
            newTitle: newTitle,
            newUrl: newUrl
        }),
    });

    if (!response.ok) {
        throw new Error("Failed to update link. Please try again later.");
    }

    return response.json();
}

export async function deleteLink(linkId: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/link/delete-link`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            linkId: linkId
        }),
    });

    if (!response.ok) {
        throw new Error("Failed to delete link. Please try again later.");
    }

    return response.json();
}