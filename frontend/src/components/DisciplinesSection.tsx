import { Code, Brain, Palette, TrendingUp, Database, Shield } from "lucide-react";

const disciplines = [
  {
    icon: Code,
    title: "Software Development",
    description: "Master programming languages, frameworks, and best practices for building modern applications.",
    topics: ["React & TypeScript", "Python", "System Design", "DevOps"],
    color: "from-blue-500 to-cyan-400",
  },
  {
    icon: Brain,
    title: "AI & Machine Learning",
    description: "Dive into neural networks, deep learning, and cutting-edge AI research.",
    topics: ["Deep Learning", "NLP", "Computer Vision", "MLOps"],
    color: "from-purple-500 to-pink-400",
  },
  {
    icon: Database,
    title: "Data Science",
    description: "Transform raw data into actionable insights with statistical analysis and visualization.",
    topics: ["Statistics", "SQL", "Visualization", "Big Data"],
    color: "from-green-500 to-emerald-400",
  },
  {
    icon: Palette,
    title: "Design & UX",
    description: "Create beautiful, user-centered designs that delight and engage audiences.",
    topics: ["UI Design", "User Research", "Figma", "Design Systems"],
    color: "from-orange-500 to-yellow-400",
  },
  {
    icon: TrendingUp,
    title: "Business & Strategy",
    description: "Develop leadership skills and strategic thinking for the modern business landscape.",
    topics: ["Product Management", "Marketing", "Analytics", "Leadership"],
    color: "from-red-500 to-rose-400",
  },
  {
    icon: Shield,
    title: "Cybersecurity",
    description: "Protect systems and data with comprehensive security knowledge and practices.",
    topics: ["Ethical Hacking", "Network Security", "Cryptography", "Compliance"],
    color: "from-teal-500 to-cyan-400",
  },
];

const DisciplinesSection = () => {
  return (
    <section id="disciplines" className="relative z-10 py-24 px-6 md:px-16">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-glass border border-glass-border backdrop-blur-sm mb-4">
            <span className="text-secondary text-sm font-medium">EXPLORE PATHS</span>
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Choose Your <span className="text-primary">Discipline</span>
          </h2>
          <p className="text-text-soft text-lg max-w-2xl mx-auto">
            Whether you're starting fresh or leveling up, we have expertly curated paths for every ambition
          </p>
        </div>

        {/* Disciplines Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {disciplines.map((discipline) => (
            <div
              key={discipline.title}
              className="group relative p-6 rounded-2xl bg-glass border border-glass-border backdrop-blur-sm
                         transition-all duration-350 ease-out cursor-pointer
                         hover:-translate-y-2 hover:bg-glass-hover hover:border-accent/40 hover:shadow-glow"
            >
              {/* Gradient Accent */}
              <div 
                className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r ${discipline.color} opacity-60 group-hover:opacity-100 transition-opacity`}
              />

              {/* Icon */}
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${discipline.color} opacity-80
                              flex items-center justify-center mb-4`}>
                <discipline.icon className="w-6 h-6 text-foreground" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold mb-2">{discipline.title}</h3>
              <p className="text-text-softer text-sm leading-relaxed mb-4">{discipline.description}</p>

              {/* Topics */}
              <div className="flex flex-wrap gap-2">
                {discipline.topics.map((topic) => (
                  <span 
                    key={topic}
                    className="px-2 py-1 text-xs rounded-md bg-muted/50 text-muted-foreground"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DisciplinesSection;
