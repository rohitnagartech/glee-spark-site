import { type LucideIcon } from "lucide-react";

interface ModuleCardProps {
  number: number;
  title: string;
  description: string;
  items: string[];
  icon: LucideIcon;
}

const ModuleCard = ({ number, title, description, items, icon: Icon }: ModuleCardProps) => {
  return (
    <div className="group relative rounded-lg border border-border bg-card p-6 hover:border-primary/50 hover:border-glow transition-all duration-300">
      <div className="absolute top-4 right-4 text-6xl font-heading font-bold text-muted/30 select-none">
        {String(number).padStart(2, "0")}
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center justify-center h-10 w-10 rounded-md bg-accent text-accent-foreground">
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="font-heading font-bold text-foreground text-lg">{title}</h3>
      </div>

      <p className="text-muted-foreground text-sm mb-4">{description}</p>

      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-card-foreground">
            <span className="text-primary mt-1 font-mono text-xs">▸</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ModuleCard;
