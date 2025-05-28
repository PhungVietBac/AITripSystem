'use client';

import { useState, FormEvent } from 'react';
import Loading from '@/components/Loading';
import Link from 'next/link';
import { setCookie } from 'cookies-next';
import { FaEnvelope, FaLock } from 'react-icons/fa';

export default function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!username || !password) {
            setError('Vui lòng điền đầy đủ thông tin.');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('https://aitripsystem-api.onrender.com/api/v1/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({ username, password }).toString(),
            });

            if (!response.ok) {
                throw new Error('Đăng nhập không thành công. Vui lòng kiểm tra thông tin đăng nhập.');
            }

            const data = await response.json();

            if (data.access_token) {
                setCookie('token', data.access_token, { maxAge: 60 * 60 * 24 }); // 1 day
                
                // Reload page to activate middleware
                window.location.href = '/home';
            } else {
                throw new Error('Thông tin đăng nhập không hợp lệ.');
            }

        } catch (err: any) {
            setError(err.message || 'Đã có lỗi xảy ra.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md ">
                <div className="rounded-2xl shadow-xl filter backdrop-blur-md bg-[rgba(0, 0, 0, 0.1)] p-8">
                    {/* Logo */}
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 bg-cyan-100 rounded-lg flex items-center justify-center">
                            <svg className="w-10 h-10 text-cyan-500" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2L2 7v10l10 5 10-5V7L12 2zm0 2.236L20 9l-8 4-8-4 8-4.764zM4 9.618v6L12 20l8-4.382v-6L12 14 4 9.618z" />
                            </svg>
                        </div>
                    </div>

                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-800">Chào mừng bạn đến với EXPLAVUE 👋</h2>
                        <p className="text-gray-500 text-sm mt-1">Vui lòng nhập thông tin của bạn!</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="username" className="block text-xs font-medium text-gray-700 mb-1">
                                Tên đăng nhập
                            </label>
                            <div className="relative">
                                <input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                                    placeholder="Điền tên đăng nhập của bạn"
                                    required
                                    disabled={isLoading}
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                                    <FaEnvelope />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-xs font-medium text-gray-700 mb-1">
                                Mật khẩu
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                                    placeholder="Điền mật khẩu của bạn"
                                    required
                                    disabled={isLoading}
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                                    <FaLock />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-cyan-500 text-white py-3 px-4 rounded-xl hover:bg-cyan-600 transition duration-200 font-medium"
                            disabled={isLoading}
                        >
                            {isLoading ? <Loading message='Đang kiểm tra thông tin đăng nhập!'/> : 'Đăng nhập'}
                        </button>
                    </form>

                    <div className="mt-6">
                        <button
                            type="button"
                            className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition duration-200"
                        >
                            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                                <path d="M20.283 10.356h-8.327v3.451h4.792c-.446 2.193-2.313 3.453-4.792 3.453a5.27 5.27 0 0 1-5.279-5.28 5.27 5.27 0 0 1 5.279-5.279c1.259 0 2.397.447 3.29 1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233a8.908 8.908 0 0 0-8.934 8.934 8.907 8.907 0 0 0 8.934 8.934c4.467 0 8.529-3.249 8.529-8.934 0-.528-.081-1.097-.202-1.625z" 
                                fill="#4285F4"/>
                            </svg>
                            Đăng nhập với Google
                        </button>
                    </div>

                    <div className="mt-6 text-center text-sm">
                        <p className="text-gray-600">
                            Bạn chưa có tài khoản?{' '}
                            <Link href="/register" className="text-cyan-600 font-medium hover:text-cyan-500">
                                Đăng ký
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}