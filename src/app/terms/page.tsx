import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function TermsPage() {
    return (
        <>
            <Navigation />
            <main style={{ paddingTop: "120px", minHeight: "100vh" }}>
                <div className="container">
                    <div className="section-compact" style={{ maxWidth: 800, margin: "0 auto" }}>
                        <h1 className="t-headline mb-lg">Terms of Service</h1>

                        <div className="t-body" style={{ color: "var(--text-secondary)" }}>
                            <p className="mb-md">Last updated: {new Date().toLocaleDateString()}</p>

                            <h2 className="t-title mt-xl mb-md">The Basics</h2>
                            <p className="mb-md">
                                By using DevGathering, you agree to treat others with respect.
                                Our platform is for connecting developers, not for spam or harassment.
                            </p>

                            <h2 className="t-title mt-xl mb-md">Events</h2>
                            <p className="mb-md">
                                Attending our events requires adherence to our Code of Conduct.
                                We reserve the right to refuse entry to anyone violating these standards.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
