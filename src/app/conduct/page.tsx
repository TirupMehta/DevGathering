import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function ConductPage() {
    return (
        <>
            <Navigation />
            <main style={{ paddingTop: "120px", minHeight: "100vh" }}>
                <div className="container">
                    <div className="section-compact" style={{ maxWidth: 800, margin: "0 auto" }}>
                        <h1 className="t-headline mb-lg">Code of Conduct</h1>

                        <div className="t-body" style={{ color: "var(--text-secondary)" }}>
                            <h2 className="t-title mt-xl mb-md">Our Pledge</h2>
                            <p className="mb-md">
                                We are dedicated to providing a harassment-free experience for everyone,
                                regardless of gender, sexual orientation, disability, physical appearance,
                                body size, race, or religion.
                            </p>

                            <h2 className="t-title mt-xl mb-md">Standards</h2>
                            <p className="mb-md">
                                Examples of behavior that contributes to a positive environment include:
                            </p>
                            <ul style={{ paddingLeft: "var(--space-md)", marginBottom: "var(--space-lg)" }}>
                                <li className="mb-sm">Using welcoming and inclusive language</li>
                                <li className="mb-sm">Being respectful of differing viewpoints and experiences</li>
                                <li className="mb-sm">Gracefully accepting constructive criticism</li>
                                <li className="mb-sm">Focusing on what is best for the community</li>
                            </ul>

                            <p className="mb-md">
                                We do not tolerate harassment in any form. Participants violating these rules
                                may be sanctioned or expelled from the community at the discretion of the organizers.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
