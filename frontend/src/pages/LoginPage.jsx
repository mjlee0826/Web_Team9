import React, { useEffect } from 'react';
import { useLogto } from '@logto/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingPage from '../components/LoadingPage';
import { Sparkles, ArrowRight, CheckCircle2, Activity, BookHeart, CalendarDays, Hexagon } from 'lucide-react';

export default function LoginPage() {
    const { signIn } = useLogto();
    const navigate = useNavigate();
    const { isAuthenticated, isLoading } = useAuth();

    useEffect(() => {
        if (isLoading) return;
        if (isAuthenticated) {
            navigate('/home', { replace: true });
        }
    }, [isAuthenticated, isLoading, navigate]);

    const handleLogin = () => {
        const redirectUrl = `${window.location.origin}/callback`;
        signIn(redirectUrl);
    };

    if (isAuthenticated){
        return <LoadingPage message='正在驗證登入資訊，請稍候...' />
    }

    const features = [
        {
            icon: <CheckCircle2 size={20} className="text-cyan-400" />,
            title: 'Task Override',
            desc: '模組化待辦清單，精準擊破目標'
        },
        {
            icon: <Activity size={20} className="text-cyan-400" />,
            title: 'Habit Tracking',
            desc: '數據化日常軌跡，建立原子習慣'
        },
        {
            icon: <BookHeart size={20} className="text-cyan-400" />,
            title: 'Encrypted Diary',
            desc: '私密思緒沉澱，保留生活原始碼'
        },
        {
            icon: <CalendarDays size={20} className="text-cyan-400" />,
            title: 'Timeline Sync',
            desc: '全域排程同步，掌控絕對時間'
        }
    ];

    return (
        // 外層：極致深色背景 (幾乎全黑)，帶有冷峻的科技感
        <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#09090b] font-sans text-neutral-300 selection:bg-cyan-500/30">
            
            {/* 左側：系統介紹區 */}
            <div className="relative flex-[1.2] flex flex-col justify-center p-12 lg:p-24 overflow-hidden border-r border-white/5">
                
                {/* 科技感背景：雷達網格底圖 */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px]"></div>
                
                {/* 科技感背景：冷光渲染 (Cyan & Indigo) */}
                <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="relative z-10 max-w-xl">
                    {/* 品牌標誌：帶有 Terminal 風格 */}
                    <div className="flex items-center gap-3 mb-12">
                        <div className="relative flex items-center justify-center w-12 h-12 bg-white/5 border border-white/10 rounded-xl backdrop-blur-md">
                            <Hexagon size={24} className="text-cyan-400 absolute" />
                            <Sparkles size={12} className="text-white absolute animate-pulse" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-mono text-cyan-500 tracking-[0.2em] uppercase">System Online</span>
                            <span className="text-xl font-bold tracking-widest text-white">LIFE OS<span className="text-cyan-500">_</span></span>
                        </div>
                    </div>
                    
                    {/* 主標題：高對比白與漸層冷光 */}
                    <h2 className="text-5xl lg:text-6xl font-black mb-6 tracking-tight text-white leading-[1.1]">
                        Initialize Your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                            Digital Life.
                        </span>
                    </h2>
                    <p className="text-lg text-neutral-400 mb-16 leading-relaxed max-w-md font-light">
                        拒絕無序。在單一終端介面中，高度整合你的任務、習慣、記憶與時間軸。
                    </p>

                    {/* 功能列表：玻璃面板風格 (Glassmorphism) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {features.map((feature, index) => (
                            <div key={index} className="group flex items-start gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300 backdrop-blur-sm">
                                <div className="mt-1 p-2 bg-black/50 rounded-lg border border-white/5 group-hover:border-cyan-500/30 transition-colors">
                                    {feature.icon}
                                </div>
                                <div>
                                    <h3 className="text-white font-medium mb-1 font-mono text-sm uppercase tracking-wider">{feature.title}</h3>
                                    <p className="text-neutral-500 text-sm leading-relaxed">
                                        {feature.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 右側：登入區塊 */}
            <div className="relative flex-1 flex items-center justify-center p-8 bg-[#040405]">
                {/* 登入卡片：極簡深色面板 */}
                <div className="relative w-full max-w-[400px] p-10 rounded-[2rem] bg-[#09090b] border border-white/[0.08] shadow-2xl backdrop-blur-xl">
                    
                    {/* 卡片頂部裝飾線 */}
                    <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>

                    <div className="text-center mb-10">
                        <h2 className="text-2xl font-bold text-white mb-2">Access Portal</h2>
                        <p className="text-neutral-500 text-sm">
                            Verify your identity to proceed
                        </p>
                    </div>
                    
                    {/* 帥氣的高反差按鈕：純白底黑字，這是目前國外極簡設計最流行的作法 */}
                    <button
                        onClick={handleLogin}
                        className="group relative w-full flex items-center justify-center gap-3 p-4 bg-white text-black rounded-xl font-bold text-base transition-all duration-300 hover:bg-neutral-200 hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <span>Authenticate / 登入</span>
                        <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </button>

                    <div className="mt-8 flex items-center gap-4">
                        <div className="flex-1 h-[1px] bg-white/5"></div>
                        <span className="text-xs font-mono text-neutral-600 uppercase tracking-widest">Secure Connection</span>
                        <div className="flex-1 h-[1px] bg-white/5"></div>
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-[11px] text-neutral-600 leading-relaxed">
                            By authenticating, you agree to the <br/>
                            <a href="#" className="text-neutral-400 hover:text-cyan-400 transition-colors underline decoration-white/20 underline-offset-4">Terms of Service</a> & <a href="#" className="text-neutral-400 hover:text-cyan-400 transition-colors underline decoration-white/20 underline-offset-4">Privacy Policy</a>
                        </p>
                    </div>
                </div>
            </div>
            
        </div>
    );
}