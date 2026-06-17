import { ReactNode } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

interface Props {
  title: string;
  children: ReactNode;
}

const CollapsibleSection = ({ title, children }: Props) => {
  return (
    <Collapsible className="group" defaultOpen={true}>
      <div className="flex gap-0.5">
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          {title}
        </h4>
        <CollapsibleTrigger className="flex">
          <ChevronDown className="ml-auto group-data-[state=open]:rotate-180" />
        </CollapsibleTrigger>
      </div>

      <CollapsibleContent>
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default CollapsibleSection;
