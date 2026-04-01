interface SectionHeaderProps {
  tag: string;
  title: string;
  description?: string;
}

const SectionHeader = ({ tag, title, description }: SectionHeaderProps) => {
  return (
    <div className="text-center mb-12 space-y-4">
      <span className="inline-block px-3 py-1 rounded-full border border-border bg-muted/50 text-primary font-mono text-xs uppercase tracking-widest">
        {tag}
      </span>
      <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground">{title}</h2>
      {description && (
        <p className="max-w-2xl mx-auto text-muted-foreground">{description}</p>
      )}
    </div>
  );
};

export default SectionHeader;
