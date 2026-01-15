import { Lightbulb, Route, Rocket, Target } from "lucide-react";

const steps = [
  {
    icon: Target,
    title: "Define Your Goal",
    description: "Tell us what skill you want to master. Whether it's machine learning, web development, or creative writing - we've got you covered.",
  },
  {
    icon: Lightbulb,
    title: "AI Analyzes Your Path",
    description: "Our AI evaluates your current skills, learning style, and available time to craft a personalized curriculum just for you.",
  },
  {
    icon: Route,
    title: "Follow Your Roadmap",
    description: "Get a structured learning path with curated resources, milestones, and progress tracking to keep you motivated.",
  },
  {
    icon: Rocket,
    title: "Achieve Mastery",
    description: "Complete projects, earn certifications, and build a portfolio that showcases your new expertise to the world.",
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="relative z-10 py-24 px-6 md:px-16">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-glass border border-glass-border backdrop-blur-sm mb-4">
            <span className="text-secondary text-sm font-medium">THE PROCESS</span>
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How <span className="text-primary">Vidyayathra</span> Works
          </h2>
          <p className="text-text-soft text-lg max-w-2xl mx-auto">
            Four simple steps to transform your learning journey with AI-powered personalization
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="group relative p-6 rounded-2xl bg-glass border border-glass-border backdrop-blur-sm
                         transition-all duration-350 ease-out
                         hover:-translate-y-2 hover:bg-glass-hover hover:border-accent/40 hover:shadow-glow"
            >
              {/* Step Number */}
              <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary text-primary-foreground 
                              flex items-center justify-center text-sm font-bold">
                {index + 1}
              </div>

              {/* Icon */}
              <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 
                              flex items-center justify-center mb-4 
                              group-hover:bg-primary/20 transition-colors">
                <step.icon className="w-7 h-7 text-primary" />
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-text-softer text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
