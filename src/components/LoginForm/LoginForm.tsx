import React, { useState } from 'react';
import { FiUser, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import tecsupImage from '../../assets/tecsup-login.jpg';

interface LoginFormProps {
    username: string;
    password: string;
    onUsernameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
    error?: string;
    loading?: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({
    username,
    password,
    onUsernameChange,
    onPasswordChange,
    onSubmit,
    error,
    loading = false
}) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-sky-100 to-sky-20 flex items-center justify-center p-4 overflow-hidden">
            <div className="w-full max-w-4xl h-[85vh] max-h-[600px] grid md:grid-cols-2 bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="p-6 sm:p-8 bg-gradient-to-br from-white to-sky-50 flex items-center justify-center">
                    <div className="w-full max-w-md space-y-6">
                        <div className="text-center">
                            <h1 className="text-2xl sm:text-3xl font-bold text-sky-900">
                                Bienvenido a ExploraTec
                            </h1>
                            <h2 className="text-sky-600 text-base sm:text-lg mt-2">
                                Ingresa a tu cuenta
                            </h2>
                        </div>

                        <form className="space-y-4" onSubmit={onSubmit}>
                            <div className="space-y-3">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <FiUser className="h-5 w-5 text-sky-400" />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        className="block w-full pl-12 pr-4 py-2.5 border border-sky-200 rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition duration-150 ease-in-out bg-white text-base"
                                        placeholder="Nombre de usuario"
                                        value={username}
                                        onChange={onUsernameChange}
                                        disabled={loading}
                                    />
                                </div>

                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <FiLock className="h-5 w-5 text-sky-400" />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        className="block w-full pl-12 pr-10 py-2.5 border border-sky-200 rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition duration-150 ease-in-out bg-white text-base"
                                        placeholder="Contraseña"
                                        value={password}
                                        onChange={onPasswordChange}
                                        disabled={loading}
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        onClick={() => setShowPassword(!showPassword)}
                                        disabled={loading}
                                    >
                                        {showPassword ? (
                                            <FiEyeOff className="h-5 w-5 text-sky-500" />
                                        ) : (
                                            <FiEye className="h-5 w-5 text-sky-500" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded text-sm">
                                    <p className="text-red-600">{error}</p>
                                </div>
                            )}


                            <button
                                type="submit"
                                disabled={loading || !username || !password}
                                className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-400 transition duration-150 ease-in-out text-base font-semibold shadow-md ${loading || !username || !password
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-sky-500 hover:bg-sky-600"
                                    }`}
                            >
                                {loading ? (
                                    <div className="flex items-center">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Iniciando sesión...
                                    </div>
                                ) : (
                                    "Iniciar Sesión"
                                )}
                            </button>
                            <div className="text-center">
                                <span className="text-gray-600">¿No tienes una cuenta? </span>
                                <a href="/register" className="text-sky-600 hover:text-sky-700 font-medium">
                                    Regístrate
                                </a>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="hidden md:block relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-sky-400/20 to-sky-600/20 z-10"></div>
                    <img
                        src={tecsupImage}
                        alt="Tecnología educativa"
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>
        </div>
    );
};