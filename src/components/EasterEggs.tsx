"use client";

import { useEffect, useState } from "react";

// Secret code: ↑↓↑↓←→←→
const SECRET_CODE = [
    "ArrowUp", "ArrowDown", "ArrowUp", "ArrowDown",
    "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight"
];

export default function EasterEggs() {
    const [, setInputSequence] = useState<string[]>([]);
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        // Console easter egg
        console.log(
            `%c
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   Hey you 👀                                          ║
║                                                       ║
║   Inspecting our code? Nice!                          ║
║   You're definitely one of us.                        ║
║                                                       ║
║   We're building something special for developers.   ║
║   Want to help? → hello@devgathering.in               ║
║                                                       ║
║   P.S. Try pressing ↑↓↑↓←→←→ 😉                       ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
            `,
            "color: #ff6b35; font-family: monospace; font-size: 12px;"
        );

        const triggerEasterEgg = () => {
            setShowConfetti(true);
            console.log("%c🎉 You found the easter egg! You're officially a DevGathering insider.", "color: #ff6b35; font-size: 16px; font-weight: bold;");

            // Hide confetti after animation
            setTimeout(() => setShowConfetti(false), 4000);
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            // Ignore if user is typing in an input
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                return;
            }

            setInputSequence(prev => {
                const newSequence = [...prev, e.key].slice(-SECRET_CODE.length);

                // Check if sequence matches
                if (newSequence.length === SECRET_CODE.length &&
                    newSequence.every((key, i) => key === SECRET_CODE[i])) {
                    triggerEasterEgg();
                    return [];
                }

                return newSequence;
            });
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    if (!showConfetti) return null;

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                pointerEvents: "none",
                zIndex: 9999,
                overflow: "hidden",
            }}
        >
            {/* Confetti particles */}
            {Array.from({ length: 100 }).map((_, i) => (
                <div
                    key={i}
                    style={{
                        position: "absolute",
                        left: `${Math.random() * 100}%`,
                        top: "-20px",
                        width: `${Math.random() * 10 + 5}px`,
                        height: `${Math.random() * 10 + 5}px`,
                        background: ["#ff6b35", "#ffaa66", "#fff", "#22c55e", "#3b82f6", "#a855f7"][Math.floor(Math.random() * 6)],
                        borderRadius: Math.random() > 0.5 ? "50%" : "2px",
                        animation: `confetti-fall ${Math.random() * 2 + 2}s linear forwards`,
                        animationDelay: `${Math.random() * 0.5}s`,
                        transform: `rotate(${Math.random() * 360}deg)`,
                    }}
                />
            ))}

            {/* Message */}
            <div
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    background: "rgba(0, 0, 0, 0.9)",
                    backdropFilter: "blur(16px)",
                    border: "1px solid rgba(255, 107, 53, 0.5)",
                    borderRadius: "16px",
                    padding: "32px 48px",
                    textAlign: "center",
                    animation: "popup-in 0.4s ease-out",
                    pointerEvents: "auto",
                }}
            >
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>🎉</div>
                <h2 style={{ fontSize: "1.5rem", marginBottom: "8px", color: "#fff" }}>
                    You found the easter egg!
                </h2>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                    You&apos;re officially a DevGathering insider.
                </p>
                <code style={{
                    display: "block",
                    marginTop: "16px",
                    padding: "8px 16px",
                    background: "rgba(255, 107, 53, 0.1)",
                    borderRadius: "6px",
                    color: "#ff6b35",
                    fontSize: "0.8rem"
                }}>
                    achievement_unlocked = True
                </code>
            </div>


        </div>
    );
}
