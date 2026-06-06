"use client";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { JSX, useEffect, useState } from "react";
import { toast } from "sonner";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDownIcon, Folder, FolderClosed, FolderOpen, Plus, Link } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface FolderType {
    folderId: string;
    name: string;
    description: string;
    isOpen?: boolean;
}

interface LinkType {
    linkId: string;
    folderId: string;
    title: string;
    url: string;
}

export default function CoursePage() {
    const params = useParams();
    const { data: session } = useSession();

    // UI states
    const [isNewFolderDialogOpen, setIsNewFolderDialogOpen] = useState(false);
    const [isNewLinkDialogOpen, setIsNewLinkDialogOpen] = useState(false);
    const [folderNameInput, setFolderNameInput] = useState("");
    const [folderDescriptionInput, setFolderDescriptionInput] = useState("");
    const [linkTitleInput, setLinkTitleInput] = useState("");
    const [linkUrlInput, setLinkUrlInput] = useState("");
    const [isPanelOpen, setIsPanelOpen] = useState(false);


    // Data states
    const [courseData, setCourseData] = useState<any>(null);
    const [workloadComponents, setWorkloadComponents] = useState<any>([]);
    const workloadBarLength = 500; // in pixels

    const getCourseData = async () => {
        try {
            const dataFromNUS = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/course/course-data/${params.courseCode}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) => res.json());

            const dataFromDatabase = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/course/user-course?courseCode=${params.courseCode}&userId=${session?.user.id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            }).then((res) => res.json());
            const fullCourseData = { courseId: dataFromDatabase?.courseId, ...dataFromNUS };
            setCourseData(fullCourseData);
            setWorkloadComponents([
                { type: "Lecture", hours: dataFromNUS.workload[0], color: "bg-blue-300" },
                { type: "Tutorial", hours: dataFromNUS.workload[1], color: "bg-green-300" },
                { type: "Lab", hours: dataFromNUS.workload[2], color: "bg-red-300" },
                { type: "Project", hours: dataFromNUS.workload[3], color: "bg-purple-300" },
                { type: "Preparation", hours: dataFromNUS.workload[4], color: "bg-yellow-300" }
            ]);

            return fullCourseData;
        }
        catch (error: any) {
            toast.error(error.message || "Failed to fetch course data. Please try again later.");
        }
    }

    // Folder states and handlers
    const [folders, setFolders] = useState<FolderType[]>([]);
    const [currentFolder, setCurrentFolder] = useState<FolderType | null>(null);

    const getAllFolders = async (courseId: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/folder/all-folders?courseId=${courseId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) => res.json());

            console.log("Fetched folders:", response);
            const foldersWithOpenState = response.map((folder: any) => ({
                ...folder,
                isOpen: false
            }));
            setFolders(foldersWithOpenState);
            return response;
        } catch (error: any) {
            toast.error(error.message || "Failed to fetch folders. Please try again later.");
        }
    }

    const handleCreateFolder = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/folder/create-folder`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    courseId: courseData.courseId,
                    folderName: folderNameInput,
                    folderDescription: folderDescriptionInput
                }),
            }).then((res) => res.json());

            if (response.folderId) {
                toast.success("Folder " + folderNameInput + " created successfully!");
                setIsNewFolderDialogOpen(false);
                setFolderNameInput("");
                setFolderDescriptionInput("");
                fetchData();
            } else {
                throw new Error("Failed to create folder. Please try again later.");
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to create folder. Please try again later.");
        }
    }

    const handleFolderClick = async (folderIndex: number) => {
        const newFolders = [...folders];
        const newState = !newFolders[folderIndex].isOpen;
        setIsPanelOpen(newState);
        newFolders.map((folder) => folder.isOpen = false);
        newFolders[folderIndex].isOpen = newState;

        if (newState) {
            setCurrentFolder(newFolders[folderIndex]);
        } else {
            setCurrentFolder(null);
        }
        setFolders(newFolders);
        console.log(folders);
    }


    // Link handlers
    const [isGeneralDialogOpen, setIsGeneralDialogOpen] = useState(false);
    const [generalLinks, setGeneralLinks] = useState<LinkType[]>([]);
    const [currentFolderLinks, setCurrentFolderLinks] = useState<LinkType[]>([]);
    const handleCreateLink = async (isGeneral: boolean) => {
        const targetFolder = isGeneral ? folders.find(folder => folder.name === '__general__') : currentFolder;
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/link/create-link`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    folderId: targetFolder?.folderId,
                    title: linkTitleInput,
                    url: linkUrlInput,
                })
            }).then((res) => res.json());

            if (response.linkId) {
                toast.success("Link " + linkTitleInput + " created successfully!");
                setIsNewLinkDialogOpen(false);
                setLinkTitleInput("");
                setLinkUrlInput("");
                if (isGeneral) {
                    fetchData();
                } else {
                    await getAllLinks(targetFolder?.folderId || "", false);
                }
            } else {
                throw new Error("Failed to create link. Please try again later.");
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to create link. Please try again later.");
        }
    }

    const getAllLinks = async (folderId: string, isGeneral: boolean) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/link/links-by-folder?folderId=${folderId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) => res.json());

            if (isGeneral) {
                setGeneralLinks(response);
            } else {
                setCurrentFolderLinks(response);
            }

            return response;
        } catch (error: any) {
            toast.error(error.message || "Failed to fetch links. Please try again later.");
        }

    }

    const fetchData = async () => {
        if (params.courseCode) {
            const courseData = await getCourseData();
            const foldersData = await getAllFolders(courseData.courseId);
            await getAllLinks(foldersData.find((f: any) => f.name === '__general__')?.folderId, true);
        }
    }

    useEffect(() => {
        fetchData();
    }, [params.courseCode]);

    return (
        <div className="flex min-h-screen">
            <main className="flex min-w-0 flex-1 flex-col gap-4 ml-6 mt-6">
                <div className="font-heading text-4xl font-bold">{params.courseCode}</div>
                <div className="font-sans text-lg text-muted-foreground">
                    {courseData?.title}
                </div>

                <section className="mt-5">
                    <div className="font-heading text-lg font-bold">Course Details</div>
                    <div className="mt-2 font-sans text-muted-foreground">
                        <p>Credit: {courseData?.credit} units</p>
                    </div>
                    <div className="mt-2 font-sans text-muted-foreground flex flex-col gap-3">
                        <p className="font-sans text-muted-foreground">Workload</p>
                        <div className="flex flex-row items-center gap-1">
                            {
                                workloadComponents.map((component: any) => (
                                    <HoverCard key={component.type} openDelay={0} closeDelay={0}>
                                        <HoverCardTrigger>
                                            <div className={`${component.color}`} style={{ width: `${(component.hours / 14) * workloadBarLength}px`, height: "20px" }}></div>
                                        </HoverCardTrigger>
                                        <HoverCardContent>
                                            <p className="font-bold font-sans">{component.type}</p>
                                            <p className="font-sans">{component.hours} hours / week</p>
                                        </HoverCardContent>
                                    </HoverCard>
                                ))
                            }
                        </div>
                    </div>

                    <div className="mt-3 font-sans text-muted-foreground flex flex-col gap-3">
                        <p className="font-sans text-muted-foreground">Components</p>
                    </div>
                </section>


                <section>
                    <div className='flex flex-row items-center gap-2 font-sans'>
                        <Folder className="w-10 h-10" />
                        <p className='text-2xl font-medium leading-none'>Folders</p>
                    </div>
                    <div className='h-[0.5] mt-2 w-full bg-gray-400'></div>
                    <div className='mt-4 flex flex-col gap-4'>
                        <Button onClick={() => setIsNewFolderDialogOpen(true)} className='w-30 font-sans px-4 py-2 rounded-md bg-white text-black border hover:bg-primary hover:text-white shadow-sm transition-colors'>
                            <Plus className="w-4 h-4" />
                            New Folder
                        </Button>
                    </div>
                    <div className='mt-10 grid grid-cols-[repeat(auto-fill,minmax(10rem,10rem))] justify-start gap-2'>
                        {
                            folders.map((folder, index) => (
                                folder.name == '__general__' ? null : (
                                    <div className='flex flex-col items-center' key={folder.folderId}>
                                        {folder.isOpen ? <FolderOpen onClick={() => handleFolderClick(index)} size={120} /> : <FolderClosed onClick={async () => { await getAllLinks(folder.folderId, false); await handleFolderClick(index) }} size={120} />}
                                        <div className='font-sans text-md text-center text-black mt-2'>
                                            {folder.name}
                                        </div>
                                    </div>
                                )
                            ))
                        }
                    </div>
                </section>

                <section className="mt-10">
                    <div className='flex flex-row items-center gap-2 font-sans'>
                        <Link className="w-10 h-10" />
                        <p className='text-2xl font-medium leading-none'>Links</p>
                    </div>
                    <div className='h-[0.5] mt-2 w-full bg-gray-400'></div>
                    <div className='mt-4 flex flex-col gap-4'>
                        <Button onClick={() => { setIsGeneralDialogOpen(true); setIsNewLinkDialogOpen(true) }} className='w-30 font-sans px-4 py-2 rounded-md bg-white text-black border hover:bg-primary hover:text-white shadow-sm transition-colors'>
                            <Plus className="w-4 h-4" />
                            New Link
                        </Button>
                    </div>
                    <div className='mt-10 grid grid-cols-[repeat(auto-fill,minmax(10rem,10rem))] justify-start gap-2'>
                        {/* Map through links here */}
                        {
                            generalLinks.map((link) => (
                                <a key={link.linkId} href={link.url} target="_blank" rel="noopener noreferrer">
                                    <Button key={link.linkId} variant="outline" className='font-sans text-left px-4 py-2 w-full'>
                                        {link.title}
                                    </Button>
                                </a>
                            ))
                        }
                    </div>
                </section>


                <Dialog open={isNewFolderDialogOpen} onOpenChange={setIsNewFolderDialogOpen}>
                    <DialogContent className="w-[50vw] max-w-none">
                        <DialogHeader>
                            <DialogTitle className="font-heading text-2xl">Create New Folder</DialogTitle>
                        </DialogHeader>
                        <div>
                            <Field className="w-full">
                                <FieldLabel className="font-sans text-md">Folder Name</FieldLabel>
                                <Input
                                    type="text"
                                    placeholder="Enter folder name"
                                    className="w-full font-sans h-12 border border-input focus-visible:ring-2 focus-visible:ring-secondary focus-visible:outline-none focus-visible:border-secondary"
                                    value={folderNameInput}
                                    onChange={(e) => setFolderNameInput(e.target.value)}
                                />
                            </Field>
                            <Field className="w-full mt-4">
                                <FieldLabel className="font-sans text-md">Folder Description</FieldLabel>
                                <Input
                                    type="text"
                                    placeholder="Enter folder description"
                                    className="w-full font-sans h-12 border border-input focus-visible:ring-2 focus-visible:ring-secondary focus-visible:outline-none focus-visible:border-secondary"
                                    value={folderDescriptionInput}
                                    onChange={(e) => setFolderDescriptionInput(e.target.value)}
                                />
                            </Field>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleCreateFolder} className='font-sans px-6 py-5 bg-secondary' type="submit">Create</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>



                <Dialog open={isNewLinkDialogOpen} onOpenChange={setIsNewLinkDialogOpen}>
                    <DialogContent className="w-[50vw] max-w-none">
                        <DialogHeader>
                            <DialogTitle className="font-heading text-2xl">Create New Link</DialogTitle>
                        </DialogHeader>
                        <div>
                            <Field className="w-full">
                                <FieldLabel className="font-sans text-md">Link Title</FieldLabel>
                                <Input
                                    type="text"
                                    placeholder="Enter link title"
                                    className="w-full font-sans h-12 border border-input focus-visible:ring-2 focus-visible:ring-secondary focus-visible:outline-none focus-visible:border-secondary"
                                    value={linkTitleInput}
                                    onChange={(e) => setLinkTitleInput(e.target.value)}
                                />
                            </Field>
                            <Field className="w-full mt-4">
                                <FieldLabel className="font-sans text-md">Link URL</FieldLabel>
                                <Input
                                    type="text"
                                    placeholder="Enter link URL"
                                    className="w-full font-sans h-12 border border-input focus-visible:ring-2 focus-visible:ring-secondary focus-visible:outline-none focus-visible:border-secondary"
                                    value={linkUrlInput}
                                    onChange={(e) => setLinkUrlInput(e.target.value)}
                                />
                            </Field>
                        </div>
                        <DialogFooter>
                            <Button onClick={() => { handleCreateLink(isGeneralDialogOpen) }} className='font-sans px-6 py-5 bg-secondary' type="submit">Create</Button>
                        </DialogFooter>
                    </DialogContent>

                </Dialog>
            </main >

            <aside className={`shrink-0 border-l overflow-hidden transition-all duration-300 ${isPanelOpen ? "w-[20rem]" : "w-0"}`}>
                {currentFolder && (
                    <div className="flex flex-col h-full p-4">
                        <div>
                            <h2 className="font-heading text-xl font-bold mb-4">{currentFolder.name}</h2>
                            <p className="font-sans text-muted-foreground">{currentFolder.description}</p>
                        </div>
                        <div className="mt-6 flex flex-col">
                            <p className="font-sans text-md font-semibold">Links</p>
                            <div className='h-[0.5] mt-2 w-full bg-gray-400'></div>
                            <div className="mt-4 flex flex-row gap-2">
                                <Button onClick={() => { setIsGeneralDialogOpen(false); setIsNewLinkDialogOpen(true) }} className='p-2 rounded-md bg-white text-black border hover:bg-primary hover:text-white shadow-sm transition-colors'>
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </div>
                            <div className="h-50 overflow-y-auto mt-4 flex flex-col gap-3">
                                {
                                    currentFolderLinks.map((link) => (
                                        <a key={link.linkId} href={link.url} target="_blank" className="font-sans hover:underline">
                                            {link.title}
                                        </a>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                )}
            </aside>
        </div>
    );
}