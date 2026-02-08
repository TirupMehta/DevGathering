"use client";

import { useState, useEffect } from "react";

// Configure social links here - when a link is added, the popup automatically hides
// To add links in the future, just fill in these values and the popup will disappear
const SOCIAL_LINKS = {
    twitter: "",    // e.g., "https://twitter.com/devgathering"
    github: "",     // e.g., "https://github.com/devgathering"
    discord: "",    // e.g., "https://discord.gg/devgathering"
    linkedin: "",   // e.g., "https://linkedin.com/company/devgathering"
};

// Check if any social links are configured
const hasSocialLinks = Object.values(SOCIAL_LINKS).some(link => link.trim() !== "");

export default function SocialMediaPopup() {
    const [isVisible, setIsVisible] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);

    useEffect(() => {
        // Don't show if social links are configured or if dismissed
        if (hasSocialLinks) return;

        // Check if user has dismissed this popup before (session storage)
        const dismissed = sessionStorage.getItem("social-popup-dismissed");
        if (dismissed) {
            setIsDismissed(true);
            return;
        }

        // Show popup after a short delay
        const timer = setTimeout(() => setIsVisible(true), 2000);
        return () => clearTimeout(timer);
    }, []);

    const handleDismiss = () => {
        setIsVisible(false);
        setIsDismissed(true);
        sessionStorage.setItem("social-popup-dismissed", "true");
    };

    // Don't render anything if social links exist or popup was dismissed
    if (hasSocialLinks || isDismissed || !isVisible) return null;

    return (
        <div
            style={{
                position: "fixed",
                bottom: "24px",
                left: "24px",
                zIndex: 1000,
                maxWidth: "280px",
                animation: "slideInLeft 0.4s ease-out",
            }}
        >
            <div
                style={{
                    background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "16px",
                    padding: "16px 20px",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                }}
            >
                <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                    {/* Icon */}
                    <div
                        style={{
                            background: "rgba(255, 107, 53, 0.15)",
                            color: "var(--accent)",
                            padding: "8px",
                            borderRadius: "8px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                        }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                        </svg>
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1 }}>
                        <p
                            style={{
                                color: "var(--text)",
                                fontSize: "0.875rem",
                                fontWeight: 500,
                                lineHeight: 1.4,
                            }}
                        >
                            We&apos;ll be on social media soon!
                        </p>
                    </div>

                    {/* Close button */}
                    <button
                        onClick={handleDismiss}
                        style={{
                            background: "transparent",
                            border: "none",
                            color: "var(--text-muted)",
                            cursor: "pointer",
                            padding: "4px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "4px",
                            transition: "color 0.2s ease",
                            flexShrink: 0,
                        }}
                        aria-label="Dismiss"
                        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>
            </div>

            <style jsx>{`
                @keyframes slideInLeft {
                    from {
                        opacity: 0;
                        transform: translateX(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
            `}</style>
        </div>
    );
}

// Export for future use - when you want to display actual social links
export { SOCIAL_LINKS, hasSocialLinks };
