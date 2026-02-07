import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function PrivacyPage() {
    return (
        <>
            <Navigation />
            <main style={{ paddingTop: "120px", minHeight: "100vh" }}>
                <div className="container">
                    <div className="section-compact" style={{ maxWidth: 800, margin: "0 auto" }}>
                        <h1 className="t-headline mb-lg">Privacy Policy</h1>

                        <div className="t-body" style={{ color: "var(--text-secondary)" }}>
                            <p className="mb-md">Last updated: {new Date().toLocaleDateString()}</p>

                            <h2 className="t-title mt-xl mb-md">Simplicity First</h2>
                            <p className="mb-md">
                                We believe privacy policies should be readable. Here is ours:
                            </p>
                            <ul style={{ paddingLeft: "var(--space-md)", marginBottom: "var(--space-lg)" }}>
                                <li className="mb-sm">We only collect what we need (name, email) to contact you about events.</li>
                                <li className="mb-sm">We do not sell your data. Ever.</li>
                                <li className="mb-sm">We use simple analytics to see how many people visit our site, but it is anonymized.</li>
                            </ul>

                            <h2 className="t-title mt-xl mb-md">Your Data</h2>
                            <p className="mb-md">
                                If you request a city or sign up for updates, we store that info securely.
                                You can ask us to delete it anytime by emailing hello@devgathering.in.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
