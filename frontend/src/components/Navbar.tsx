import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface NavbarProps {
	onGetStarted?: () => void;
}

const scrollToSection = (id: string) => {
	const element = document.getElementById(id);
	if (element) {
		element.scrollIntoView({ behavior: "smooth" });
	}
};

const Navbar = ({ onGetStarted }: NavbarProps) => {
	const navigate = useNavigate();

	return (
		<>
			{/* ---------- CSS ---------- */}
			<style>{`
				.navbar {
					position: fixed;
					top: 0;
					left: 0;
					right: 0;
					z-index: 50;
					padding: 20px 24px;
					background: rgba(10, 10, 10, 0.8);
					backdrop-filter: blur(16px);
					border-bottom: 1px solid rgba(255, 255, 255, 0.1);
				}

				@media (min-width: 768px) {
					.navbar {
						padding: 20px 64px;
					}
				}

				.navbar-container {
					display: flex;
					align-items: center;
					justify-content: space-between;
					max-width: 1280px;
					margin: 0 auto;
				}

				.brand {
					display: flex;
					flex-direction: column;
					cursor: pointer;
				}

				.brand-title {
					font-size: 20px;
					font-weight: 700;
					color: var(--primary-color, #ff8d47);
				}

				.brand-subtitle {
					font-size: 11px;
					letter-spacing: 2px;
					text-transform: uppercase;
					color: rgba(255, 255, 255, 0.8);
				}

				.nav-links {
					display: none;
					align-items: center;
					gap: 32px;
				}

				@media (min-width: 768px) {
					.nav-links {
						display: flex;
					}
				}

				.nav-link {
					background: none;
					border: none;
					cursor: pointer;
					font-size: 14px;
					font-weight: 500;
					color: rgba(255, 255, 255, 0.9);
					transition: color 0.2s ease;
				}

				.nav-link:hover {
					color: var(--primary-color, #ff8d47);
				}

				.nav-cta {
					border-radius: 9999px;
				}
			`}</style>

			{/* ---------- NAVBAR ---------- */}
			<nav className="navbar">
				<div className="navbar-container">

					{/* Brand */}
					<div
						className="brand"
						onClick={() =>
							window.scrollTo({ top: 0, behavior: "smooth" })
						}
					>
						<h2 className="brand-title">Vidyayathra</h2>
						<span className="brand-subtitle">AI Learning Journey</span>
					</div>

					{/* Nav Links */}
					<div className="nav-links">
						<button
							className="nav-link"
							onClick={() => scrollToSection("how-it-works")}
						>
							How it works
						</button>
						<button
							className="nav-link"
							onClick={() => scrollToSection("disciplines")}
						>
							Disciplines
						</button>
						<button
							className="nav-link"
							onClick={() => scrollToSection("mentors")}
						>
							Mentors
						</button>
					</div>

					{/* CTA */}
					<Button
						onClick={() => {
							if (onGetStarted) onGetStarted();
							else navigate("/auth/signin");
						}}
						variant="nav"
						className="nav-cta"
					>
						Get Started
					</Button>

				</div>
			</nav>
		</>
	);
};

export default Navbar;

