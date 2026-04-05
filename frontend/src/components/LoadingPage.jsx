import React from 'react';
import { Hexagon } from 'lucide-react';

/**
 * 科技感載入畫面元件 (純 UI 展示)
 * @param {string} message - 可選參數，自訂載入時要顯示的文字
 */
export default function LoadingPage({ message = 'Loading' }) {
    return (
        // 外層：滿版、極致深色背景、雷達網格底圖
        <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-[#09090b] overflow-hidden selection:bg-cyan-500/30">
            
            {/* 背景科技網格 (與 LoginPage 呼應) */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px]"></div>

            {/* 背景冷光渲染 (極致微弱，增加空間感) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none"></div>

            {/* 載入動畫主體 */}
            <div className="relative z-10 flex flex-col items-center">
                
                {/* 旋轉光環區塊 */}
                <div className="relative w-24 h-24 flex items-center justify-center mb-8">
                    {/* 外圈：順時針旋轉的青色光軌 */}
                    <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-transparent border-t-cyan-500/80 animate-[spin_2s_linear_infinite]"></div>
                    <div className="absolute inset-0 rounded-full border-b-2 border-l-2 border-transparent border-b-blue-500/80 animate-[spin_3s_linear_infinite]"></div>
                    
                    {/* 內圈：逆時針旋轉的藍色光軌 */}
                    <div className="absolute inset-2 rounded-full border-l-2 border-r-2 border-transparent border-l-indigo-400/60 border-r-cyan-400/60 animate-[spin_1.5s_linear_infinite_reverse]"></div>
                    
                    {/* 核心：脈衝發光的六角形 */}
                    <div className="relative flex items-center justify-center animate-pulse">
                        <Hexagon size={28} className="text-cyan-400 absolute blur-[4px] opacity-60" />
                        <Hexagon size={28} className="text-cyan-300 relative z-10" />
                    </div>
                </div>

                {/* 文字區塊：終端機風格 */}
                <div className="flex flex-col items-center gap-3">
                    {/* 狀態指示燈 */}
                    <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping"></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                    </div>

                    {/* 載入文字 + 閃爍游標 */}
                    <div className="text-cyan-500 font-mono text-sm tracking-[0.3em] uppercase flex items-center">
                        <span>{message}</span>
                        <span className="inline-block w-2 h-4 bg-cyan-400 ml-1 animate-[pulse_1s_step-end_infinite]"></span>
                    </div>
                </div>
                
            </div>
        </div>
    );
}