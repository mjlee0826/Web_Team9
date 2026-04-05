import { Routes, Route, Navigate } from 'react-router-dom';
import { useLogto } from '@logto/react';

// 引入元件
import LoginPage from './pages/LoginPage';
import CallbackPage from './pages/CallbackPage';
import TodoPage from './pages/TodoPage';
import HabitPage from './pages/HabitPage';
import DiaryPage from './pages/DiaryPage';
import CalendarPage from './pages/CalendarPage';
import Layout from './components/Layout';

// 路由守衛元件：檢查是否登入
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useLogto();
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

export default function App() {
    const { isLoading } = useLogto();

    // 如果 Logto 還在確認登入狀態（例如重整網頁時），先顯示載入中
    if (isLoading) {
        return <div className="text-center mt-20">系統載入中...</div>;
    }

    return (
        <Routes>
            {/* 公開路由 */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/callback" element={<CallbackPage />} />

            {/* 需要保護的巢狀路由：用 ProtectedRoute 包住 Layout */}
            <Route 
                element={
                    <ProtectedRoute>
                        <Layout />
                    </ProtectedRoute>
                }
            >
                <Route path="/todo" element={<TodoPage />} />
                <Route path="/habit" element={<HabitPage />} />
                <Route path="/diary" element={<DiaryPage />} />
                <Route path="/calendar" element={<CalendarPage />} />
            </Route>

            {/* 預設重新導向 */}
            <Route path="/" element={<Navigate to="/todo" replace />} />
            <Route path="*" element={<Navigate to="/todo" replace />} />
        </Routes>
    );
}