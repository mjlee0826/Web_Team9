import React from 'react';
import { Hexagon } from 'lucide-react';

/**
 * LoadingPage Component
 * A full-screen overlay used to indicate background processing or data fetching.
 * * @param {Object} props
 * @param {string} props.message - The localized or custom string displayed during the loading state.
 */
export default function LoadingPage({ message = 'Loading' }) {
    return (
        <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-[#09090b] overflow-hidden selection:bg-cyan-500/30">
            
            {/* Background Grid Pattern: Enhances the tech/sci-fi aesthetic */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px]"></div>

            {/* Radial Glow Effect: Creates depth and focus in the center of the screen */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="relative z-10 flex flex-col items-center">
                
                {/* Multi-layered Spinner: Uses concurrent CSS animations with different durations and directions */}
                <div className="relative w-24 h-24 flex items-center justify-center mb-8">
                    {/* Primary clockwise outer ring */}
                    <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-transparent border-t-cyan-500/80 animate-[spin_2s_linear_infinite]"></div>
                    {/* Secondary slower clockwise ring */}
                    <div className="absolute inset-0 rounded-full border-b-2 border-l-2 border-transparent border-b-blue-500/80 animate-[spin_3s_linear_infinite]"></div>
                    {/* Counter-clockwise inner ring for a complex mechanical feel */}
                    <div className="absolute inset-2 rounded-full border-l-2 border-r-2 border-transparent border-l-indigo-400/60 border-r-cyan-400/60 animate-[spin_1.5s_linear_infinite_reverse]"></div>
                    
                    {/* Central Icon: Uses the Lucide Hexagon with a pulse animation for status feedback */}
                    <div className="relative flex items-center justify-center animate-pulse">
                        <Hexagon size={28} className="text-cyan-400 absolute blur-[4px] opacity-60" />
                        <Hexagon size={28} className="text-cyan-300 relative z-10" />
                    </div>
                </div>

                <div className="flex flex-col items-center gap-3">
                    {/* Status Indicators: Visual "heartbeat" of the application */}
                    <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping"></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                    </div>

                    {/* Terminal-style Loading Text with an animated block cursor */}
                    <div className="text-cyan-500 font-mono text-sm tracking-[0.3em] uppercase flex items-center">
                        <span>{message}</span>
                        {/* Blinking cursor simulated with CSS steps animation */}
                        <span className="inline-block w-2 h-4 bg-cyan-400 ml-1 animate-[pulse_1s_step-end_infinite]"></span>
                    </div>
                </div>
                
            </div>
        </div>
    );
}