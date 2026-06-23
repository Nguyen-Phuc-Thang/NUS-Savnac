

export function generateDefaultFolders(courseCode: string) {
    return [
        {
            folderName: "Lecture",
            folderDescription: `${courseCode} lecture folder`,
        },
        {
            folderName: "Tutorial",
            folderDescription: `${courseCode} tutorial folder`,
        },
        {
            folderName: "Lab",
            folderDescription: `${courseCode} lab folder`,
        }, {
            folderName: "__general__",
            folderDescription: `${courseCode} general folder`,
        }
    ];
}

export function closeAllFolders(folders: any[]) {
    return folders.map((folder) => ({ ...folder, isOpen: false }));
}