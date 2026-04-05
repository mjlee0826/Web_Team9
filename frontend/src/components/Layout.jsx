// Import routing components: 
// NavLink is used for links that need an "active" state, 
// Outlet is a placeholder for rendering nested child routes.
import { NavLink, Outlet } from 'react-router-dom';
import { ListTodo, Target, BookText, CalendarDays } from 'lucide-react';

export default function Layout() {
    // A function to dynamically evaluate the CSS classes for each navigation item.
    // React Router automatically passes the '{ isActive }' boolean to this function,
    // allowing us to conditionally apply styles when the current URL matches the link's path.
    const navItemClass = ({ isActive }) =>
        `flex flex-col items-center justify-center flex-1 py-3 gap-1 text-xs font-bold transition-colors duration-200 border-b-2 ${
        isActive 
            ? 'text-blue-600 border-blue-600' // Styles applied when this route is active
            : 'text-gray-500 border-transparent hover:text-gray-800 hover:bg-gray-50' // Styles applied when inactive
        }`;

    return (
        <div className="min-h-screen flex flex-col bg-gray-100 font-sans">
            
            {/* Top Navigation Bar */}
            <nav className="sticky top-0 bg-white shadow-sm z-50 flex justify-around w-full">
                
                {/* Each <NavLink> defines a navigation path using the 'to' prop.
                    It will automatically trigger the active styles defined in 'navItemClass' 
                    when the browser's current URL matches this path.
                */}
                <NavLink to="/todo" className={navItemClass}>
                    <ListTodo size={20} strokeWidth={2.5} />
                    <span>待辦</span>
                </NavLink>

                <NavLink to="/habit" className={navItemClass}>
                    <Target size={20} strokeWidth={2.5} />
                    <span>習慣</span>
                </NavLink>

                <NavLink to="/diary" className={navItemClass}>
                    <BookText size={20} strokeWidth={2.5} />
                    <span>日記</span>
                </NavLink>

                <NavLink to="/calendar" className={navItemClass}>
                    <CalendarDays size={20} strokeWidth={2.5} />
                    <span>日曆</span>
                </NavLink>

            </nav>

            {/* Main Content Area */}
            <main className="flex-1 w-full bg-white shadow-md overflow-y-auto">
                {/* <Outlet /> acts as a placeholder or a "hole" in the layout.
                    React Router injects the corresponding child component (e.g., TodoPage, HabitPage)
                    here based on the active route defined in App.jsx.
                */}
                <Outlet />
            </main>
            
        </div>
    );
}