import { Metadata } from "next";
// Link import removed
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import NotifyForm from "@/components/NotifyForm";

export const metadata: Metadata = {
    title: "About — DevGathering",
    description: "We&apos;re building the anti-conference. No sales pitches, just engineering.",
};

const manifesto = [
    {
        title: "No Sales Pitches",
        desc: "We have a strict policy against vendor pitches disguised as tech talks. If you're on stage, you're teaching, not selling.",
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
                <line x1="12" y1="2" x2="12" y2="12" />
            </svg>
        ),
    },
    {
        title: "Engineering First",
        desc: "Marketing fluff has no place here. We dive deep into code, architecture, and the messy reality of production systems.",
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
            </svg>
        ),
    },
    {
        title: "Community Over Profit",
        desc: "We aren't optimizing for ticket sales. We&apos;re optimizing for connection. We keep events small enough to actually meet people.",
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
        ),
    },
];

export default function AboutPage() {
    return (
        <>
            <Navigation />

            <main>
                <div className="page-header">
                    <div className="container text-center" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <p className="text-xs text-accent mb-3">Our Mission</p>
                        <h1 className="mb-4">Engineering First</h1>
                        <p className="text-muted" style={{ maxWidth: 660, fontSize: "1.2rem", lineHeight: "1.6" }}>
                            A community dedicated to the craft of software development. <br />
                            No sales, no fluff, just code.
                        </p>
                    </div>
                </div>

                <section className="section" style={{ paddingTop: 0 }}>
                    <div className="container" style={{ maxWidth: 860, margin: "0 auto" }}>

                        {/* Origin Story */}
                        <div className="mb-20 relative" style={{ padding: "1px", borderRadius: "24px", background: "linear-gradient(135deg, rgba(255,107,53,0.3) 0%, rgba(255,255,255,0.05) 50%, transparent 100%)" }}>
                            <div style={{ background: "#0f0f0f", borderRadius: "23px", padding: "48px 40px", position: "relative", overflow: "hidden" }}>
                                {/* Background Glow */}
                                <div style={{ position: "absolute", top: -100, right: -100, width: "300px", height: "300px", background: "radial-gradient(circle, rgba(255,107,53,0.15) 0%, transparent 70%)", filter: "blur(40px)", pointerEvents: "none" }} />

                                <div className="text-center mb-8 relative z-10">
                                    <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 48, height: 48, borderRadius: "50%", background: "rgba(255,107,53,0.1)", color: "var(--accent)", marginBottom: "16px" }}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                                        </svg>
                                    </div>
                                    <h2 className="h2 mb-2">The Vision</h2>
                                    <p className="text-muted text-sm uppercase tracking-widest">Built for Builders</p>
                                </div>

                                <div style={{ color: "var(--text-muted)", fontSize: "1.125rem", lineHeight: "1.8", display: "flex", flexDirection: "column", gap: "24px", position: "relative", zIndex: 10 }}>
                                    <p>
                                        In a world of massive tech conferences and vendor-driven summits, we saw a need for something different: <span style={{ color: "var(--text)" }}>a space where engineering takes center stage.</span>
                                    </p>

                                    <p>
                                        We created DevGathering to be the event we always wanted to attend. A place where senior engineers share war stories from production, where architectural decisions are debated openly, and where the focus is strictly on technical excellence.
                                    </p>

                                    <p>
                                        <strong style={{ color: "var(--text)" }}>We prioritize depth over breadth.</strong>
                                    </p>

                                    <p>
                                        Our goal is simple: to facilitate high-bandwidth conversations and help you become a better engineer by connecting you with the best minds in your local community.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Manifesto */}
                        <div className="mb-8">
                            <h2 className="mb-6 text-center">Our Manifesto</h2>
                            <div className="features">
                                {manifesto.map((item, i) => (
                                    <div key={i} className="card" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", textAlign: "left" }}>
                                        <div style={{
                                            marginBottom: "16px",
                                            background: "rgba(255, 107, 53, 0.1)",
                                            color: "var(--accent)",
                                            padding: "10px",
                                            borderRadius: "8px",
                                            display: "inline-flex"
                                        }}>
                                            {item.icon}
                                        </div>
                                        <h3 className="feature-title" style={{ fontSize: "1.25rem" }}>{item.title}</h3>
                                        <p className="feature-desc">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Stats / Numbers */}
                        <div className="card text-center mb-8" style={{ padding: "48px 32px", background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)" }}>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "32px" }}>
                                <div>
                                    <div style={{ fontSize: "3rem", fontWeight: "800", color: "var(--accent)", lineHeight: "1" }}>0%</div>
                                    <div className="text-muted mt-2 text-sm uppercase tracking-wide">Marketing Fluff</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: "3rem", fontWeight: "800", color: "var(--text)", lineHeight: "1" }}>100%</div>
                                    <div className="text-muted mt-2 text-sm uppercase tracking-wide">Developer Led</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: "3rem", fontWeight: "800", color: "var(--text)", lineHeight: "1" }}>∞</div>
                                    <div className="text-muted mt-2 text-sm uppercase tracking-wide">Connections</div>
                                </div>
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="text-center" style={{ maxWidth: 500, margin: "0 auto" }}>
                            <h2 className="mb-4">Join the movement</h2>
                            <p className="text-muted mb-6">
                                We&apos;re just getting started. Be part of the first wave of events in your city.
                            </p>
                            <NotifyForm />
                        </div>

                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
}
