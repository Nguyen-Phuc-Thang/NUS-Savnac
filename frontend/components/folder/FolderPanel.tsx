import { Button } from "@/components/ui/button";
import { Plus, SquarePen, Trash2 } from "lucide-react";

interface FolderPanelProps {
    open: boolean;
    folder: any;
    onLinkClick?: (link: any) => void;
    onAdd: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

export default function FolderPanel({ open, folder, onLinkClick, onAdd, onEdit, onDelete }: FolderPanelProps) {

    const handleEditLinkClick = (link: any) => {
        onLinkClick?.(link);
        onEdit();
    }

    const handleDeleteLinkClick = (link: any) => {
        onLinkClick?.(link);
        onDelete();
    }


    return (
        <aside className={`shrink-0 border-l overflow-hidden transition-all duration-300 ${open ? "w-[20rem]" : "w-0"}`}>
            {folder && (
                <div className="flex flex-col h-full p-4">
                    <div>
                        <h2 className="font-heading text-xl font-bold mb-4">{folder.name}</h2>
                        <p className="font-sans text-muted-foreground">{folder.description}</p>
                    </div>
                    <div className="mt-6 flex flex-col">
                        <p className="font-sans text-md font-semibold">Links</p>
                        <div className='h-[0.5] mt-2 w-full bg-gray-400'></div>
                        <div className="mt-4 flex flex-row gap-2">
                            <Button onClick={onAdd} className='p-2 rounded-md bg-white text-black border hover:bg-primary hover:text-white shadow-sm transition-colors'>
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>
                        <div className="h-50 overflow-y-auto mt-4 flex flex-col gap-3">
                            {folder.links?.map((link: any) => (
                                <div key={link.linkId} className="group relative flex items-center rounded-md border border-transparent pr-16 transition-colors hover:border-border hover:bg-muted/50">
                                    <a
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex min-w-0 flex-1 items-center rounded-md px-3 py-2 font-sans transition-colors hover:text-primary"
                                    >
                                        <span className="truncate">{link.title}</span>
                                    </a>
                                    <div className="pointer-events-none absolute right-2 flex items-center gap-1 opacity-0 invisible transition-opacity group-hover:pointer-events-auto group-hover:visible group-hover:opacity-100">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon-sm"
                                            onClick={() => handleEditLinkClick(link)}
                                            className="h-8 w-8 border-0 bg-transparent p-0 text-muted-foreground shadow-none hover:bg-transparent hover:text-foreground"
                                        >
                                            <SquarePen className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon-sm"
                                            onClick={() => handleDeleteLinkClick(link)}
                                            className="h-8 w-8 border-0 bg-transparent p-0 text-muted-foreground shadow-none hover:bg-transparent hover:text-destructive"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </aside>
    );
}