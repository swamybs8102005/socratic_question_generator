interface FeatureCardProps {
  title: string;
  description: string;
  delay?: number;
}

const FeatureCard = ({ title, description, delay = 0 }: FeatureCardProps) => {
  return (
    <div
      className="group p-5 rounded-xl bg-glass border border-glass-border backdrop-blur-sm 
                 transition-all duration-350 ease-out cursor-default
                 hover:-translate-y-2 hover:scale-[1.02] hover:bg-glass-hover
                 hover:border-accent/40 hover:shadow-glow-lg
                 animate-fade-in-up opacity-0"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      <h4 className="text-foreground font-semibold mb-2">{title}</h4>
      <p className="text-text-softer text-sm leading-relaxed">{description}</p>
    </div>
  );
};

export default FeatureCard;
