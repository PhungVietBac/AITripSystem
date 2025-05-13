'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validation
        if (!username || !password) {
            setError('Please fill in all fields.');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            // Replace with your actual login API endpoint
            const response = await fetch('https://aitripsystem-api.onrender.com/api/v1/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({ username, password }).toString(),
            });

            if (!response.ok) {
                throw new Error('Server did not respond. Please try again.');
            }

            const data = await response.json();

            // Store token in localStorage or in a secure cookie
            localStorage.setItem('token', data.token);

            // Redirect user after successful login
            router.push('/home');
        } catch (err: any) {
            setError(err.message || 'An unknown error occurred.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Đăng nhập</h2>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                            Username 
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                            placeholder="Input your username"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-1">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <Link
                                href="/forgot-password"
                                className="text-sm text-cyan-600 hover:text-cyan-800"
                            >
                                Forgot password?
                            </Link>
                        </div>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                            placeholder="Input your password"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <button
                        type="submit"
                        className={`w-full bg-cyan-600 text-white py-2 px-4 rounded-md hover:bg-cyan-700 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''
                            }`}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Processing...' : 'Login'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link href="/register" className="text-cyan-600 hover:text-cyan-800">
                            Sign up now
                        </Link>
                    </p>
                </div>

                <div className="mt-8">
                    <div className="relative">
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Or log in with</span>
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        >
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20.283 10.356h-8.327v3.451h4.792c-.446 2.193-2.313 3.453-4.792 3.453a5.27 5.27 0 0 1-5.279-5.28 5.27 5.27 0 0 1 5.279-5.279c1.259 0 2.397.447 3.29 1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233a8.908 8.908 0 0 0-8.934 8.934 8.907 8.907 0 0 0 8.934 8.934c4.467 0 8.529-3.249 8.529-8.934 0-.528-.081-1.097-.202-1.625z"></path>
                            </svg>
                            <span className="ml-2">Google</span>
                        </button>
                        <button
                            type="button"
                            className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        >
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M13.397 20.997v-8.196h2.765l.411-3.209h-3.176V7.548c0-.926.258-1.56 1.587-1.56h1.684V3.127A22.336 22.336 0 0 0 14.201 3c-2.444 0-4.122 1.492-4.122 4.231v2.355H7.332v3.209h2.753v8.202h3.312z"></path>
                            </svg>
                            <span className="ml-2">Facebook</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}