import { Routes, Route, Navigate } from 'react-router-dom';

// Import page and layout components
import LoginPage from './pages/LoginPage';
import TodoPage from './pages/TodoPage';
import HabitPage from './pages/HabitPage';
import DiaryPage from './pages/DiaryPage';
import CalendarPage from './pages/CalendarPage';
import Layout from './components/Layout'; 

export default function App() {
    return (
        <Routes>
            {/* Standalone Route: 
                This route sits outside the Layout component wrapper. 
                When the URL is "/login", only the LoginPage renders, ensuring the 
                top navigation bar (which lives inside Layout) is NOT displayed.
            */}
            <Route path="/login" element={<LoginPage />} />

            {/* Nested Routes (Layout Wrapper):
                The parent <Route> uses the Layout component as its element.
                React Router handles this by rendering the Layout permanently, 
                and then dynamically injecting the matched child route's component 
                (e.g., TodoPage) into the <Outlet /> defined inside the Layout.
            */}
            <Route element={<Layout />}>
                <Route path="/todo" element={<TodoPage />} />
                <Route path="/habit" element={<HabitPage />} />
                <Route path="/diary" element={<DiaryPage />} />
                <Route path="/calendar" element={<CalendarPage />} />
            </Route>

            {/* Redirect Rules:
                The <Navigate> component programmatically changes the URL.
                The 'replace' prop is crucial here: it overwrites the current entry 
                in the browser's history stack instead of adding a new one. 
                This prevents bugs where a user clicks the browser's "Back" button 
                and gets stuck in an infinite redirect loop.
            */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/home" element={<Navigate to="/todo" replace />} />
        </Routes>
    );
}