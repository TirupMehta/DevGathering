"use client";

import { useEffect, useState } from "react";

const commands = [
    { text: "$ git clone https://github.com/devgathering/events.git", delay: 0 },
    { text: "Cloning into 'events'...", delay: 800 },
    { text: "remote: Enumerating objects: 1,247", delay: 1200 },
    { text: "remote: Counting objects: 100%", delay: 1600 },
    { text: "Receiving objects: 100% (1247/1247), done.", delay: 2200 },
    { text: "", delay: 2600 },
    { text: "$ cd events && npm install", delay: 2800 },
    { text: "Installing dependencies...", delay: 3200 },
    { text: "added 847 packages in 4.2s", delay: 4000 },
    { text: "", delay: 4200 },
    { text: "$ npm run dev", delay: 4400 },
    { text: "", delay: 4600 },
    { text: "▲ Ready in 1.2s", delay: 4800 },
    { text: "➜ Local: http://localhost:3000", delay: 5000 },
];

export default function Terminal() {
    const [visibleLines, setVisibleLines] = useState<number>(0);

    useEffect(() => {
        const timers: NodeJS.Timeout[] = [];

        commands.forEach((cmd, index) => {
            const timer = setTimeout(() => {
                setVisibleLines(index + 1);
            }, cmd.delay);
            timers.push(timer);
        });

        // Loop the animation
        const loopTimer = setTimeout(() => {
            setVisibleLines(0);
            // Restart animation
            setTimeout(() => {
                commands.forEach((cmd, index) => {
                    setTimeout(() => setVisibleLines(index + 1), cmd.delay);
                });
            }, 500);
        }, 7000);
        timers.push(loopTimer);

        return () => timers.forEach(t => clearTimeout(t));
    }, [visibleLines === 0]);

    return (
        <div className="terminal">
            <div className="terminal-header">
                <div className="terminal-buttons">
                    <span className="terminal-btn terminal-btn-red"></span>
                    <span className="terminal-btn terminal-btn-yellow"></span>
                    <span className="terminal-btn terminal-btn-green"></span>
                </div>
                <span className="terminal-title">terminal</span>
            </div>
            <div className="terminal-body">
                {commands.slice(0, visibleLines).map((cmd, i) => (
                    <div key={i} className="terminal-line">
                        {cmd.text.startsWith("$") ? (
                            <>
                                <span className="terminal-prompt">$</span>
                                <span className="terminal-command">{cmd.text.slice(2)}</span>
                            </>
                        ) : cmd.text.startsWith("▲") || cmd.text.startsWith("➜") ? (
                            <span className="terminal-success">{cmd.text}</span>
                        ) : (
                            <span className="terminal-output">{cmd.text}</span>
                        )}
                    </div>
                ))}
                <div className="terminal-cursor">▋</div>
            </div>
        </div>
    );
}
