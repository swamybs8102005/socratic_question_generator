import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import SpaceBackground from "@/components/SpaceBackground";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import PreviewCard from "@/components/PreviewCard";
import HorizonGlow from "@/components/HorizonGlow";
import OrbitalParticles from "@/components/OrbitalParticles";
import HowItWorksSection from "@/components/HowItWorksSection";
import DisciplinesSection from "@/components/DisciplinesSection";
import MentorsSection from "@/components/MentorsSection";
import Footer from "@/components/Footer";
import { authClient } from "@/lib/auth";

import {
  AuthView,
} from "@neondatabase/neon-js/auth/react/ui";

const Index: React.FC = () => {
  const [showAuth, setShowAuth] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    // Check if user is signed in
    authClient.getSession().then(session => {
      setIsSignedIn(!!session);
    }).catch(() => {
      setIsSignedIn(false);
    });
  }, []);

  return (
    <>
      <div className="relative min-h-screen">
        {/* Background */}
        <SpaceBackground />

        {/* Navbar */}
        <Navbar onGetStarted={() => setShowAuth(true)} />

        {/* Hero Section */}
        <div className="relative overflow-hidden">
          {/* Hero Content */}
          <HeroSection />

          {/* Orbital Particles around preview */}
          <OrbitalParticles />

          {/* Preview Card */}
          <PreviewCard />

          {/* Horizon Glow */}
          <HorizonGlow />
        </div>

        {/* How It Works Section */}
        <HowItWorksSection />

        {/* Disciplines Section */}
        <DisciplinesSection />

        {/* Mentors Section */}
        <MentorsSection />

        {/* Footer */}
        <Footer />

        {/* Redirect to dashboard if signed in */}
        {isSignedIn && <Navigate to="/dashboard" />}
      </div>

      {/* Auth modal, opened only when clicking Get Started */}
      {showAuth && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center"
          onClick={() => setShowAuth(false)}
        >
          <div className="absolute inset-0 bg-black/60" />

          <div
            className="relative w-[90%] max-w-[480px] p-6 rounded-lg bg-white z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-sm text-gray-600"
              onClick={() => setShowAuth(false)}
            >
              Close
            </button>

            <AuthView pathname="signin" />
          </div>
        </div>
      )}
    </>
  );
};

export default Index;
