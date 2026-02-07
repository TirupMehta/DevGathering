import { Metadata } from "next";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
    title: "Request Your City — DevGathering",
    description: "Bring DevGathering to your city. Request a local developer event.",
};

export default function RequestPage() {
    return (
        <>
            <Navigation />

            <main>
                <div className="page-header">
                    <div className="container text-center" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <p className="text-xs text-accent mb-3">Get Involved</p>
                        <h1 className="mb-4">Request Your City</h1>
                        <p className="text-muted" style={{ maxWidth: 550 }}>
                            Want DevGathering in your area? Tell us where you are and what you&apos;d like to see.
                            We&apos;re expanding city by city, and your request helps us prioritize.
                        </p>
                    </div>
                </div>

                <section className="section" style={{ paddingTop: 0 }}>
                    <div className="container" style={{ maxWidth: 600, margin: "0 auto" }}>
                        <form action="/api/request" method="POST" className="card form-card">
                            <div className="form-grid mb-5">
                                <div className="form-group">
                                    <label className="form-label">Your Name</label>
                                    <input type="text" name="name" className="input" placeholder="John Doe" required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Email Address</label>
                                    <input type="email" name="email" className="input" placeholder="john@example.com" required />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Your City</label>
                                <input type="text" name="city" className="input" placeholder="e.g., San Francisco, Berlin, Tokyo" required />
                            </div>

                            <div className="form-group">
                                <label className="form-label">What topics interest you most?</label>
                                <textarea
                                    name="topics"
                                    className="input"
                                    placeholder="e.g., System design, frontend architecture, DevOps, career growth..."
                                    rows={3}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Why do you want DevGathering in your city? (optional)</label>
                                <textarea
                                    name="reason"
                                    className="input"
                                    placeholder="Tell us about your local dev community, what's missing, and what you'd love to see..."
                                    rows={4}
                                />
                            </div>

                            <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>
                                Submit Request
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </button>
                        </form>

                        {/* Additional Info */}
                        <div className="text-center mt-7">
                            <p className="text-muted mb-4">
                                Already have a community or venue in mind?
                            </p>
                            <Link href="/about" className="btn btn-outline">
                                Learn about partnering with us
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
}
