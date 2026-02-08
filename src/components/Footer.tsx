import Link from "next/link";
import SocialMediaPopup from "./SocialMediaPopup";

export default function Footer() {
    return (
        <>
            <footer className="footer">
                <div className="container">
                    <div className="footer-grid">
                        <div>
                            <div className="nav-logo mb-4">DevGathering</div>
                            <p className="footer-brand">
                                Where developers connect, learn, and build together.
                            </p>
                        </div>

                        <div>
                            <div className="footer-heading">Navigate</div>
                            <div className="footer-links">
                                <Link href="/" className="footer-link">Home</Link>
                                <Link href="/events" className="footer-link">Events</Link>
                                <Link href="/about" className="footer-link">About</Link>
                                <Link href="/request" className="footer-link">Request City</Link>
                            </div>
                        </div>

                        <div>
                            <div className="footer-heading">Contact</div>
                            <div className="footer-links">
                                <a href="mailto:hello@devgathering.in" className="footer-link">hello@devgathering.in</a>
                            </div>
                        </div>

                        <div>
                            <div className="footer-heading">Legal</div>
                            <div className="footer-links">
                                <Link href="/privacy" className="footer-link">Privacy</Link>
                                <Link href="/terms" className="footer-link">Terms</Link>
                                <Link href="/conduct" className="footer-link">Conduct</Link>
                            </div>
                        </div>
                    </div>

                    <div className="footer-bottom">
                        <span>© {new Date().getFullYear()} DevGathering</span>
                    </div>
                </div>
            </footer>

            {/* Social media coming soon popup - will auto-hide when links are configured in SocialMediaPopup.tsx */}
            <SocialMediaPopup />
        </>
    );
}
