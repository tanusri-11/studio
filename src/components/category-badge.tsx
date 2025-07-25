import { cn } from "@/lib/utils";

interface CategoryBadgeProps {
  categoryName: string;
  color: string;
  className?: string;
}

export default function CategoryBadge({ categoryName, color, className }: CategoryBadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-x-1.5 rounded-full px-2 py-1 text-xs font-medium text-white",
        className
      )}
      style={{ backgroundColor: color }}
    >
      {categoryName}
    </div>
  );
}
