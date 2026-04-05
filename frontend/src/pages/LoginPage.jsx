import React from 'react';
import { useLogto } from '@logto/react';
// 引入適合的裝飾圖示
import { Sparkles, ArrowRight } from 'lucide-react'; 

export default function LoginPage() {
    const { signIn } = useLogto();

    const handleLogin = () => {
        // 動態抓取當前網址，並加上 /callback
        // 這樣無論是在 localhost 還是工作站，都能正確導向
        const redirectUrl = `${window.location.origin}/callback`;
        signIn(redirectUrl);
    };

    return (
        // 背景：改用柔和的藍紫色漸層，取代原本單調的灰底，讓畫面更有質感
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 font-sans p-4">
            
            {/* 登入卡片：加大圓角 (rounded-2xl) 與加深柔和陰影 (shadow-xl) */}
            <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-[400px] text-center transform transition-all">
                
                {/* 頂部品牌/裝飾 Icon 區塊 */}
                <div className="mx-auto w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6">
                    <Sparkles size={32} strokeWidth={2} />
                </div>

                <h2 className="text-3xl font-extrabold text-gray-800 mb-2">歡迎回來</h2>
                <p className="text-gray-500 mb-8 text-sm leading-relaxed">
                    一站式管理你的待辦事項、習慣養成、日記與專屬日曆。
                </p>
                
                {/* Logto 登入按鈕 
                使用 group 來控制 hover 時內部的箭頭動畫
                */}
                <button
                    onClick={handleLogin}
                    className="group relative w-full flex items-center justify-center gap-2 p-4 bg-blue-600 text-white rounded-xl font-bold text-lg transition-all duration-200 hover:bg-blue-700 hover:shadow-lg active:scale-[0.98]"
                >
                    <span>開始使用 / 登入</span>
                    {/* 滑鼠移入按鈕時，箭頭會產生微微向右推的動畫效果 */}
                    <ArrowRight size={20} className="transition-transform duration-200 group-hover:translate-x-1" />
                </button>

                {/* 底部小提示 */}
                <div className="mt-8 text-xs text-gray-400">
                    點擊登入即表示您同意我們的服務條款與隱私權政策
                </div>
            </div>
        </div>
    );
}