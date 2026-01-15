import { Star } from "lucide-react";

const mentors = [
  {
    name: "Dr. Sarah Chen",
    role: "AI Research Lead",
    company: "Former Google DeepMind",
    expertise: "Machine Learning & Neural Networks",
    rating: 4.9,
    students: "12K+",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
  },
  {
    name: "Marcus Rodriguez",
    role: "Principal Engineer",
    company: "Ex-Meta, Netflix",
    expertise: "System Design & Scalability",
    rating: 4.8,
    students: "8K+",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
  },
  {
    name: "Emily Watson",
    role: "Design Director",
    company: "Former Apple Design",
    expertise: "Product Design & UX Strategy",
    rating: 4.9,
    students: "15K+",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
  },
  {
    name: "James Park",
    role: "Data Science Lead",
    company: "Ex-Spotify, Airbnb",
    expertise: "Analytics & ML Engineering",
    rating: 4.7,
    students: "10K+",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
  },
];

const MentorsSection = () => {
  return (
    <section id="mentors" className="relative z-10 py-24 px-6 md:px-16">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 rounded-full bg-glass border border-glass-border backdrop-blur-sm mb-4">
            <span className="text-secondary text-sm font-medium">LEARN FROM THE BEST</span>
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            World-Class <span className="text-primary">Mentors</span>
          </h2>
          <p className="text-text-soft text-lg max-w-2xl mx-auto">
            Our AI-curated content is crafted with insights from industry leaders who've built products used by millions
          </p>
        </div>

        {/* Mentors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mentors.map((mentor) => (
            <div
              key={mentor.name}
              className="group relative p-6 rounded-2xl bg-glass border border-glass-border backdrop-blur-sm
                         transition-all duration-350 ease-out text-center
                         hover:-translate-y-2 hover:bg-glass-hover hover:border-accent/40 hover:shadow-glow"
            >
              {/* Avatar */}
              <div className="relative w-20 h-20 mx-auto mb-4">
                <img
                  src={mentor.image}
                  alt={mentor.name}
                  className="w-full h-full rounded-full object-cover border-2 border-primary/30 
                             group-hover:border-primary transition-colors"
                />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary 
                                flex items-center justify-center">
                  <Star className="w-3 h-3 text-primary-foreground fill-current" />
                </div>
              </div>

              {/* Info */}
              <h3 className="text-lg font-semibold mb-1">{mentor.name}</h3>
              <p className="text-primary text-sm font-medium mb-1">{mentor.role}</p>
              <p className="text-text-softer text-xs mb-3">{mentor.company}</p>

              {/* Expertise */}
              <p className="text-text-soft text-sm mb-4">{mentor.expertise}</p>

              {/* Stats */}
              <div className="flex justify-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  <span className="text-muted-foreground">{mentor.rating}</span>
                </div>
                <div className="text-muted-foreground">
                  {mentor.students} students
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MentorsSection;
