import { useHandleSignInCallback } from '@logto/react';
import { useNavigate } from 'react-router-dom';

export default function CallbackPage() {
    const navigate = useNavigate();

    // 處理 Logto 回呼，完成後執行內部函式
    const { isLoading } = useHandleSignInCallback(() => {
        // 登入驗證成功，跳轉到待辦事項頁面
        navigate('/home', { replace: true });
    });

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <p className="text-lg text-gray-600 font-bold">正在驗證登入資訊，請稍候...</p>
            </div>
        );
    }

    return null;
}