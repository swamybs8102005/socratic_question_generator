import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="relative z-10 py-16 px-6 md:px-16 border-t border-glass-border">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="text-xl font-bold text-primary mb-2">Vidyayathra</h3>
            <p className="text-text-softer text-sm mb-4">
              Your AI-powered learning companion for mastering new skills.
            </p>
            <p className="text-muted-foreground text-xs">
              © 2025 Vidyayathra. All rights reserved.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-text-softer">
              <li><a href="#how-it-works" className="hover:text-primary transition-colors">How it works</a></li>
              <li><a href="#disciplines" className="hover:text-primary transition-colors">Disciplines</a></li>
              <li><a href="#mentors" className="hover:text-primary transition-colors">Mentors</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-text-softer">
              <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Community</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-text-softer">
              <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 pt-8 border-t border-glass-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-text-soft">Ready to start your learning journey?</p>
          <Button className="bg-orange-gradient hover:shadow-glow-orange transition-all">
            Get Started Free →
          </Button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
