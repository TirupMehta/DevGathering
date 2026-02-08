import { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
    title: "Code of Conduct — DevGathering",
    description: "Our commitment to providing a harassment-free experience for everyone.",
};

const positiveExamples = [
    "Using welcoming and inclusive language",
    "Being respectful of differing viewpoints and experiences",
    "Gracefully accepting constructive criticism",
    "Focusing on what is best for the community",
    "Showing empathy towards other community members",
];

const negativeExamples = [
    "Harassment, intimidation, or discrimination in any form",
    "Trolling, insulting/derogatory comments, and personal attacks",
    "Public or private harassment",
    "Publishing others' private information without permission",
    "Other conduct which could reasonably be considered inappropriate",
];

export default function ConductPage() {
    return (
        <>
            <Navigation />

            <main>
                <div className="page-header">
                    <div className="container text-center" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <p className="text-xs text-accent mb-3">Community Standards</p>
                        <h1 className="mb-4">Code of Conduct</h1>
                        <p className="text-muted" style={{ maxWidth: 660, fontSize: "1.2rem", lineHeight: "1.6" }}>
                            DevGathering is dedicated to providing a harassment-free<br />
                            experience for everyone.
                        </p>
                    </div>
                </div>

                <section className="section" style={{ paddingTop: 0 }}>
                    <div className="container" style={{ maxWidth: 860, margin: "0 auto" }}>

                        {/* Our Pledge Card */}
                        <div className="mb-20 relative" style={{ padding: "1px", borderRadius: "24px", background: "linear-gradient(135deg, rgba(255,107,53,0.3) 0%, rgba(255,255,255,0.05) 50%, transparent 100%)" }}>
                            <div style={{ background: "#0f0f0f", borderRadius: "23px", padding: "48px 40px", position: "relative", overflow: "hidden" }}>
                                {/* Background Glow */}
                                <div style={{ position: "absolute", top: -100, right: -100, width: "300px", height: "300px", background: "radial-gradient(circle, rgba(255,107,53,0.15) 0%, transparent 70%)", filter: "blur(40px)", pointerEvents: "none" }} />

                                <div className="text-center mb-8 relative z-10">
                                    <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 48, height: 48, borderRadius: "50%", background: "rgba(255,107,53,0.1)", color: "var(--accent)", marginBottom: "16px" }}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                        </svg>
                                    </div>
                                    <h2 className="h2 mb-2">Our Pledge</h2>
                                    <p className="text-muted text-sm uppercase tracking-widest">Everyone is Welcome</p>
                                </div>

                                <div style={{ color: "var(--text-muted)", fontSize: "1.125rem", lineHeight: "1.8", display: "flex", flexDirection: "column", gap: "24px", position: "relative", zIndex: 10 }}>
                                    <p>
                                        We pledge to make participation in DevGathering a <span style={{ color: "var(--text)" }}>harassment-free experience for everyone</span>, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.
                                    </p>
                                    <p>
                                        We are committed to fostering an environment where all developers can learn, grow, and connect without fear of discrimination or exclusion.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Expected vs Not Tolerated */}
                        <div className="mb-8">
                            <h2 className="mb-6 text-center">Standards of Behavior</h2>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>

                                {/* Positive Behaviors */}
                                <div className="card" style={{ padding: "32px", textAlign: "left" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                                        <div style={{
                                            background: "rgba(34, 197, 94, 0.1)",
                                            color: "#22c55e",
                                            padding: "10px",
                                            borderRadius: "8px",
                                            display: "inline-flex"
                                        }}>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                        </div>
                                        <h3 style={{ fontSize: "1.25rem", margin: 0 }}>Expected</h3>
                                    </div>
                                    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
                                        {positiveExamples.map((item, i) => (
                                            <li key={i} style={{ color: "var(--text-muted)", paddingLeft: "20px", position: "relative" }}>
                                                <span style={{ position: "absolute", left: 0, color: "#22c55e" }}>✓</span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Negative Behaviors */}
                                <div className="card" style={{ padding: "32px", textAlign: "left" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                                        <div style={{
                                            background: "rgba(239, 68, 68, 0.1)",
                                            color: "#ef4444",
                                            padding: "10px",
                                            borderRadius: "8px",
                                            display: "inline-flex"
                                        }}>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <line x1="18" y1="6" x2="6" y2="18" />
                                                <line x1="6" y1="6" x2="18" y2="18" />
                                            </svg>
                                        </div>
                                        <h3 style={{ fontSize: "1.25rem", margin: 0 }}>Not Tolerated</h3>
                                    </div>
                                    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
                                        {negativeExamples.map((item, i) => (
                                            <li key={i} style={{ color: "var(--text-muted)", paddingLeft: "20px", position: "relative" }}>
                                                <span style={{ position: "absolute", left: 0, color: "#ef4444" }}>✕</span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                            </div>
                        </div>

                        {/* Enforcement */}
                        <div className="card text-center mb-8" style={{ padding: "48px 32px", background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)" }}>
                            <h2 className="mb-4">Enforcement</h2>
                            <p className="text-muted mb-4" style={{ maxWidth: 560, margin: "0 auto 16px" }}>
                                Community organizers are responsible for clarifying and enforcing our standards of acceptable behavior and will take appropriate and fair corrective action in response to any behavior that they deem inappropriate.
                            </p>
                            <p className="text-muted" style={{ maxWidth: 560, margin: "0 auto" }}>
                                Participants violating these rules may be sanctioned or expelled from the community at the discretion of the organizers.
                            </p>
                            <div style={{ marginTop: "24px" }}>
                                <p style={{ color: "var(--text)" }}>
                                    Report issues to <a href="mailto:hello@devgathering.in" style={{ color: "var(--accent)", textDecoration: "underline" }}>hello@devgathering.in</a>
                                </p>
                            </div>
                        </div>

                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
}
