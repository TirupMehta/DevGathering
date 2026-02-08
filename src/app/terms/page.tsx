import { Metadata } from "next";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
    title: "Terms of Service — DevGathering",
    description: "Simple, fair terms for using DevGathering and attending our events.",
};

const termsItems = [
    {
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
        ),
        title: "Respect Others",
        desc: "Treat fellow developers with respect. DevGathering is a space for learning and connection, not harassment or spam.",
    },
    {
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
        ),
        title: "Follow the Code",
        desc: "All event attendees must adhere to our Code of Conduct. We reserve the right to refuse entry to anyone violating these standards.",
    },
    {
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
            </svg>
        ),
        title: "Engineering Focus",
        desc: "We're here for technical content. Keep discussions engineering-focused and leave the sales pitches at home.",
    },
];

export default function TermsPage() {
    return (
        <>
            <Navigation />

            <main>
                <div className="page-header">
                    <div className="container text-center" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <p className="text-xs text-accent mb-3">Legal</p>
                        <h1 className="mb-4">Terms of Service</h1>
                        <p className="text-muted" style={{ maxWidth: 660, fontSize: "1.2rem", lineHeight: "1.6" }}>
                            Simple, fair terms for being part of DevGathering.<br />
                            No lawyers required.
                        </p>
                    </div>
                </div>

                <section className="section" style={{ paddingTop: 0 }}>
                    <div className="container" style={{ maxWidth: 860, margin: "0 auto" }}>

                        {/* The Basics Card */}
                        <div className="mb-20 relative" style={{ padding: "1px", borderRadius: "24px", background: "linear-gradient(135deg, rgba(255,107,53,0.3) 0%, rgba(255,255,255,0.05) 50%, transparent 100%)" }}>
                            <div style={{ background: "#0f0f0f", borderRadius: "23px", padding: "48px 40px", position: "relative", overflow: "hidden" }}>
                                {/* Background Glow */}
                                <div style={{ position: "absolute", top: -100, right: -100, width: "300px", height: "300px", background: "radial-gradient(circle, rgba(255,107,53,0.15) 0%, transparent 70%)", filter: "blur(40px)", pointerEvents: "none" }} />

                                <div className="text-center mb-8 relative z-10">
                                    <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 48, height: 48, borderRadius: "50%", background: "rgba(255,107,53,0.1)", color: "var(--accent)", marginBottom: "16px" }}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                            <polyline points="14 2 14 8 20 8" />
                                            <line x1="16" y1="13" x2="8" y2="13" />
                                            <line x1="16" y1="17" x2="8" y2="17" />
                                            <polyline points="10 9 9 9 8 9" />
                                        </svg>
                                    </div>
                                    <h2 className="h2 mb-2">The Basics</h2>
                                    <p className="text-muted text-sm uppercase tracking-widest">Last updated: February 2026</p>
                                </div>

                                <div style={{ color: "var(--text-muted)", fontSize: "1.125rem", lineHeight: "1.8", display: "flex", flexDirection: "column", gap: "24px", position: "relative", zIndex: 10 }}>
                                    <p>
                                        By using DevGathering, you agree to these terms. They&apos;re designed to be <span style={{ color: "var(--text)" }}>fair, straightforward, and developer-friendly</span>.
                                    </p>
                                    <p>
                                        Our platform exists to connect developers. We expect everyone to contribute positively to the community, whether online or at in-person events.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Terms Principles */}
                        <div className="mb-8">
                            <h2 className="mb-6 text-center">What We Expect</h2>
                            <div className="features">
                                {termsItems.map((item, i) => (
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

                        {/* CTA */}
                        <div className="card text-center mb-8" style={{ padding: "48px 32px", background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)" }}>
                            <h2 className="mb-4">Read Our Code of Conduct</h2>
                            <p className="text-muted mb-6" style={{ maxWidth: 500, margin: "0 auto 24px" }}>
                                Our Code of Conduct provides detailed guidelines on expected behavior at DevGathering events.
                            </p>
                            <Link href="/conduct" className="btn btn-primary">
                                View Code of Conduct
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>

                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
}
