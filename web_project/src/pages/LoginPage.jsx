import React, { useState } from 'react';
// Import useNavigate for programmatic routing (redirecting the user via code)
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
    // Initialize the navigate function to handle page redirects
    const navigate = useNavigate();

    // State management for form inputs and UI behavior
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // Toggles password field between 'text' and 'password'
    const [message, setMessage] = useState({ text: '', type: '' }); // Stores validation feedback
    const [isLoading, setIsLoading] = useState(false); // Prevents multiple submissions

    // Handler for the form submission event
    const handleSubmit = (e) => {
        // Prevent the default browser behavior of refreshing the page on form submit
        e.preventDefault();
        
        // Reset any previous messages
        setMessage({ text: '', type: '' });

        // Clean up inputs by removing leading/trailing whitespace
        const trimmedUsername = username.trim();
        const trimmedPassword = password.trim();

        // --- Client-Side Validation Logic ---
        // Check if username meets the minimum length requirement
        if (trimmedUsername.length < 4) {
            setMessage({ text: '帳號長度至少需要 4 個字元', type: 'error' });
            return; // Exit the function early if validation fails
        }

        // Check if password meets the minimum length requirement
        if (trimmedPassword.length < 6) {
            setMessage({ text: '密碼長度至少需要 6 個字元', type: 'error' });
            return; // Exit the function early if validation fails
        }

        // Placeholder for actual authentication API call
        alert('登入機制待實作');
        
        // Redirect the user to the home page upon successful "login".
        // { replace: true } replaces the current entry in the history stack, 
        // so the user cannot use the browser's "back" button to return to the login screen.
        navigate('/home', { replace: true })
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#f0f2f5] font-sans">
            <div className="bg-white p-10 rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.1)] w-full max-w-[360px]">
                <h2 className="text-center black text-2xl font-semibold mb-6">歡迎登入</h2>
                
                {/* Bind the handleSubmit function to the form's submit event */}
                <form onSubmit={handleSubmit}>
                    
                    <div className="mb-5">
                        <label htmlFor="username" className="block mb-2 text-[#555] text-sm">帳號</label>
                        {/* Controlled Input: Value is tied to React state, and onChange updates that state */}
                        <input
                            type="text"
                            id="username"
                            name="username"
                            placeholder="請輸入帳號"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-3 border border-[#ccc] rounded text-base transition-colors focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        />
                    </div>

                    <div className="mb-5">
                        <label htmlFor="password" className="block mb-2 text-[#555] text-sm">密碼</label>
                        <div className="relative">
                            {/* Dynamically change input type based on the showPassword state */}
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                placeholder="請輸入密碼"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-3 pr-14 border border-[#ccc] rounded text-base transition-colors focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            />
                            {/* Toggle button to flip the boolean value of showPassword */}
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none text-blue-500 cursor-pointer text-sm font-bold"
                            >
                                {showPassword ? '隱藏' : '顯示'}
                            </button>
                        </div>
                    </div>

                    {/* Submit button dynamically disables based on the isLoading state */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full p-3 bg-blue-500 text-white border-none rounded text-base cursor-pointer transition-colors mt-2 hover:bg-blue-600 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? '登入中...' : '登入'}
                    </button>
                    
                    {/* Dynamic message display block. Conditionally applies CSS colors based on message type */}
                    <div 
                        className={`mt-4 text-center text-sm min-h-[20px] ${
                        message.type === 'error' ? 'text-red-500' : 'text-green-600'
                        }`}
                    >
                        {message.text}
                    </div>
                </form>
            </div>
        </div>
    );
}