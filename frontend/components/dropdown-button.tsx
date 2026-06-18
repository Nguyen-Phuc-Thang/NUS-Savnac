import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type DropdownItem = {
  label: string;
  id: string;
};

interface DropdownButtonProps {
  label: string;
  items: DropdownItem[];
  onSelect: (item: string) => void;
}

export default function DropdownButton({
  label,
  items,
  onSelect,
}: DropdownButtonProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{label}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40" align="end">
        {items.map((item) => (
          <DropdownMenuItem key={item.id} onClick={() => onSelect(item.id)}>
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
