import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function NotFound() {
    return (
        <>
            <Navigation />
            <main style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "120px 24px 60px"
            }}>
                <div className="container" style={{ maxWidth: "600px", textAlign: "center" }}>
                    {/* Terminal Window */}
                    <div style={{
                        background: "rgba(17, 17, 17, 0.9)",
                        backdropFilter: "blur(12px)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: "12px",
                        overflow: "hidden",
                        textAlign: "left",
                    }}>
                        {/* Terminal Header */}
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "12px 16px",
                            background: "rgba(255, 255, 255, 0.03)",
                            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                        }}>
                            <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#ff5f56" }} />
                            <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#ffbd2e" }} />
                            <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#27ca3f" }} />
                            <span style={{ marginLeft: "12px", color: "var(--text-muted)", fontSize: "13px", fontFamily: "monospace" }}>
                                bash — 404
                            </span>
                        </div>

                        {/* Terminal Content */}
                        <div style={{ padding: "24px", fontFamily: "monospace", fontSize: "14px", lineHeight: "1.8" }}>
                            <p style={{ color: "var(--text-muted)" }}>
                                <span style={{ color: "#22c55e" }}>developer@devgathering</span>
                                <span style={{ color: "var(--text-muted)" }}>:</span>
                                <span style={{ color: "#3b82f6" }}>~</span>
                                <span style={{ color: "var(--text-muted)" }}>$</span>
                                {" "}cat /this/page
                            </p>
                            <p style={{ color: "#ef4444", marginTop: "8px" }}>
                                Error: Page not found (exit code 404)
                            </p>
                            <p style={{ color: "var(--text-muted)", marginTop: "16px" }}>
                                <span style={{ color: "#22c55e" }}>developer@devgathering</span>
                                <span style={{ color: "var(--text-muted)" }}>:</span>
                                <span style={{ color: "#3b82f6" }}>~</span>
                                <span style={{ color: "var(--text-muted)" }}>$</span>
                                {" "}# Hmm, this page went to a conference and never came back
                            </p>
                            <p style={{ color: "var(--text-muted)", marginTop: "16px" }}>
                                <span style={{ color: "#22c55e" }}>developer@devgathering</span>
                                <span style={{ color: "var(--text-muted)" }}>:</span>
                                <span style={{ color: "#3b82f6" }}>~</span>
                                <span style={{ color: "var(--text-muted)" }}>$</span>
                                {" "}sudo find / -name &quot;lost_page&quot;
                            </p>
                            <p style={{ color: "var(--text-muted)", marginTop: "8px" }}>
                                Searching<span className="blink-cursor">...</span>
                            </p>
                            <p style={{ color: "#ffaa66", marginTop: "8px" }}>
                                ¯\_(ツ)_/¯ Not found. Maybe try the homepage?
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ marginTop: "32px", display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
                        <Link href="/" className="btn btn-primary">
                            cd ~
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                <polyline points="9 22 9 12 15 12 15 22" />
                            </svg>
                        </Link>
                        <Link href="/events" className="btn btn-outline">
                            ls /events
                        </Link>
                    </div>

                    {/* Fun message */}
                    <p style={{ marginTop: "48px", color: "var(--text-muted)", fontSize: "14px" }}>
                        💡 Pro tip: Press <kbd style={{
                            padding: "2px 8px",
                            background: "rgba(255,255,255,0.1)",
                            borderRadius: "4px",
                            fontFamily: "monospace",
                            fontSize: "12px"
                        }}>↑↓↑↓←→←→</kbd> for a surprise
                    </p>
                </div>
            </main>
            <Footer />
        </>
    );
}

