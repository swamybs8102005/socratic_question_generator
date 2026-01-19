import FeatureCard from "./FeatureCard";

const features = [
  {
    title: "Personalized Roadmaps",
    description: "Tailored learning paths based on your specific goals and current skill level.",
  },
  {
    title: "AI-Generated Content",
    description: "Comprehensive modules created with cutting-edge AI technology.",
  },
  {
    title: "Flexible Learning",
    description: "Adjust duration and difficulty to match your pace and ambitions.",
  },
  {
    title: "For Self-Starters",
    description: "Built for learners who want to maximize efficiency and take ownership.",
  },
];

const HeroSection = () => {
  return (
    <div className="relative z-10 pt-32 md:pt-40 px-6 md:px-16 pb-20">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-2xl">
          {/* Tagline */}
          <div 
            className="inline-block px-4 py-2 rounded-full bg-glass border border-glass-border backdrop-blur-sm mb-6 animate-fade-in-up opacity-0"
            style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
          >
            <span className="text-secondary text-sm font-medium tracking-wide">
              REVOLUTIONARY AI-POWERED LEARNING
            </span>
          </div>

          {/* Title */}
          <h1 
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 animate-fade-in-up opacity-0"
            style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
          >
            Your{" "}
            <span className="text-primary">personalized</span>
            <br />
            path to mastery
          </h1>

          {/* Subtitle */}
          <p 
            className="text-text-soft text-lg md:text-xl leading-relaxed mb-12 max-w-xl animate-fade-in-up opacity-0"
            style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}
          >
            Vidyayathra revolutionizes self-directed learning with AI-generated roadmaps 
            precisely tailored to your goals, skills, and pace. Crafted for ambitious 
            learners who demand structure, efficiency, and total control over their growth.
          </p>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-xl">
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                title={feature.title}
                description={feature.description}
                delay={400 + index * 100}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
