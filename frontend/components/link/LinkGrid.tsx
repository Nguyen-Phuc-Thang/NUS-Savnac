
import { Button } from "@/components/ui/button";

interface LinkGridProps {
    mode: "NORMAL" | "EDIT" | "DELETE";
    folder: any;
    onLinkClick: (link: any) => void;
    onEditModeLinkClick: () => void;
    onDeleteModeLinkClick: () => void;
}

export default function LinkGrid({ mode, folder, onLinkClick, onEditModeLinkClick, onDeleteModeLinkClick }: LinkGridProps) {

    const handleLinkClick = (link: any) => {
        onLinkClick(link);
        if (mode === "EDIT") onEditModeLinkClick();
        else if (mode === "DELETE") onDeleteModeLinkClick();
        else window.open(link.url, "_blank");
    }

    return (
        <div>
            <p className='text-sm text-muted-foreground italic mt-5'>
                {mode === "EDIT" && "You are in Edit mode. Click on a link to edit its details."}
                {mode === "DELETE" && "You are in Delete mode. Click on a link to delete it."}
            </p>
            <div className='mt-5 grid grid-cols-[repeat(auto-fill,minmax(10rem,10rem))] justify-start gap-2'>
                {
                    folder?.links.map((link: any) => (
                        <Button onClick={() => handleLinkClick(link)} key={link.linkId} variant="outline" className='font-sans text-left px-4 py-2 w-full'>
                            {link.title}
                        </Button>
                    ))
                }
            </div>
        </div>
    );
}