import { type LucideIcon } from "lucide-react";

interface StepCardProps {
  step: number;
  title: string;
  subsections: { heading: string; items: string[] }[];
  icon: LucideIcon;
}

const StepCard = ({ step, title, subsections, icon: Icon }: StepCardProps) => {
  return (
    <div className="relative border-l-2 border-primary/30 pl-8 pb-12 last:pb-0">
      <div className="absolute -left-[13px] top-0 h-6 w-6 rounded-full bg-primary flex items-center justify-center">
        <span className="text-xs font-mono font-bold text-primary-foreground">{step}</span>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <Icon className="h-5 w-5 text-primary" />
        <h3 className="font-heading font-bold text-foreground text-xl">{title}</h3>
      </div>

      <div className="space-y-4">
        {subsections.map((sub) => (
          <div key={sub.heading}>
            <h4 className="text-sm font-mono text-accent-foreground mb-2">{sub.heading}</h4>
            <ul className="space-y-1.5">
              {sub.items.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-primary font-mono text-xs mt-0.5">→</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepCard;
