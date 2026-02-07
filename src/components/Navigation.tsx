"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
    { href: "/", label: "Home" },
    { href: "/events", label: "Events" },
    { href: "/about", label: "About" },
];

export default function Navigation() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="nav">
            <div className="container nav-inner">
                <Link href="/" className="nav-logo">
                    DevGathering
                </Link>

                {/* Desktop nav links */}
                <div className="nav-links nav-links-desktop">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`nav-link ${pathname === link.href ? "active" : ""}`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                <div className="nav-right">
                    <Link href="/request" className="btn btn-primary btn-sm nav-cta">
                        Request City
                    </Link>

                    {/* Hamburger button - mobile only */}
                    <button
                        className="hamburger"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Toggle menu"
                    >
                        <span className={`hamburger-line ${isOpen ? 'open' : ''}`}></span>
                        <span className={`hamburger-line ${isOpen ? 'open' : ''}`}></span>
                        <span className={`hamburger-line ${isOpen ? 'open' : ''}`}></span>
                    </button>
                </div>
            </div>

            {/* Mobile menu dropdown */}
            <div className={`mobile-menu ${isOpen ? 'open' : ''}`}>
                {links.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`mobile-menu-link ${pathname === link.href ? "active" : ""}`}
                        onClick={() => setIsOpen(false)}
                    >
                        {link.label}
                    </Link>
                ))}
                <Link
                    href="/request"
                    className="btn btn-primary mobile-menu-cta"
                    onClick={() => setIsOpen(false)}
                >
                    Request City
                </Link>
            </div>
        </nav>
    );
}
