import { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
    title: "Privacy Policy — DevGathering",
    description: "Your privacy matters. Here's how we handle your data at DevGathering.",
};

const privacyItems = [
    {
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
        ),
        title: "Minimal Data Collection",
        desc: "We only collect what's essential—your name and email—to keep you updated about events. Nothing more.",
    },
    {
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
            </svg>
        ),
        title: "No Data Sales",
        desc: "Your data stays with us. We never sell, rent, or trade your information to third parties. Ever.",
    },
    {
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
        ),
        title: "Secure Storage",
        desc: "Your information is stored securely with industry-standard encryption and protection measures.",
    },
];

export default function PrivacyPage() {
    return (
        <>
            <Navigation />

            <main>
                <div className="page-header">
                    <div className="container text-center" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <p className="text-xs text-accent mb-3">Transparency</p>
                        <h1 className="mb-4">Privacy Policy</h1>
                        <p className="text-muted" style={{ maxWidth: 660, fontSize: "1.2rem", lineHeight: "1.6" }}>
                            We believe privacy policies should be readable.<br />
                            Here&apos;s ours, in plain English.
                        </p>
                    </div>
                </div>

                <section className="section" style={{ paddingTop: 0 }}>
                    <div className="container" style={{ maxWidth: 860, margin: "0 auto" }}>

                        {/* Our Approach Card */}
                        <div className="mb-20 relative" style={{ padding: "1px", borderRadius: "24px", background: "linear-gradient(135deg, rgba(255,107,53,0.3) 0%, rgba(255,255,255,0.05) 50%, transparent 100%)" }}>
                            <div style={{ background: "#0f0f0f", borderRadius: "23px", padding: "48px 40px", position: "relative", overflow: "hidden" }}>
                                {/* Background Glow */}
                                <div style={{ position: "absolute", top: -100, right: -100, width: "300px", height: "300px", background: "radial-gradient(circle, rgba(255,107,53,0.15) 0%, transparent 70%)", filter: "blur(40px)", pointerEvents: "none" }} />

                                <div className="text-center mb-8 relative z-10">
                                    <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 48, height: 48, borderRadius: "50%", background: "rgba(255,107,53,0.1)", color: "var(--accent)", marginBottom: "16px" }}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                        </svg>
                                    </div>
                                    <h2 className="h2 mb-2">Simplicity First</h2>
                                    <p className="text-muted text-sm uppercase tracking-widest">Last updated: February 2026</p>
                                </div>

                                <div style={{ color: "var(--text-muted)", fontSize: "1.125rem", lineHeight: "1.8", display: "flex", flexDirection: "column", gap: "24px", position: "relative", zIndex: 10 }}>
                                    <p>
                                        At DevGathering, we believe that <span style={{ color: "var(--text)" }}>privacy is a fundamental right</span>, not a marketing checkbox.
                                    </p>
                                    <p>
                                        We use simple, anonymized analytics to understand how people use our site—but we don&apos;t track individuals or build profiles. Our analytics tell us things like &quot;100 people visited today&quot; without knowing who they were.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Privacy Principles */}
                        <div className="mb-8">
                            <h2 className="mb-6 text-center">Our Privacy Principles</h2>
                            <div className="features">
                                {privacyItems.map((item, i) => (
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

                        {/* Your Rights */}
                        <div className="card text-center mb-8" style={{ padding: "48px 32px", background: "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)" }}>
                            <h2 className="mb-4">Your Data, Your Control</h2>
                            <p className="text-muted mb-6" style={{ maxWidth: 500, margin: "0 auto 24px" }}>
                                If you&apos;ve signed up for updates or requested a city, your information is stored securely. You have the right to access, modify, or delete your data at any time.
                            </p>
                            <p style={{ color: "var(--text)" }}>
                                Simply email us at <a href="mailto:hello@devgathering.in" style={{ color: "var(--accent)", textDecoration: "underline" }}>hello@devgathering.in</a> and we&apos;ll take care of it.
                            </p>
                        </div>

                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
}
