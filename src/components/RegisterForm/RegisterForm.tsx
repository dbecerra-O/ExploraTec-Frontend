import React, { useState } from 'react';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff } from 'react-icons/fi';
import tecsupImage from '../../assets/tecsup-register.png';

interface RegisterFormProps {
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
    onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onUsernameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onConfirmPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
    error?: string;
    loading?: boolean;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
    email,
    username,
    password,
    confirmPassword,
    onEmailChange,
    onUsernameChange,
    onPasswordChange,
    onConfirmPasswordChange,
    onSubmit,
    error,
    loading = false
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    const passwordsMatch = password && confirmPassword && password === confirmPassword;
    const passwordsDontMatch = confirmPassword && password !== confirmPassword;

    const isFormValid = email && username && password && confirmPassword && passwordsMatch;

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-sky-100 to-sky-20 flex items-center justify-center p-4 overflow-hidden">
            <div className="w-full max-w-4xl h-[90vh] max-h-[650px] grid md:grid-cols-2 bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="p-6 sm:p-8 bg-gradient-to-br from-white to-sky-50 flex items-center justify-center overflow-y-auto">
                    <div className="w-full max-w-md space-y-6">
                        <div className="text-center">
                            <h1 className="text-2xl sm:text-3xl font-bold text-sky-900">
                                Crear Cuenta
                            </h1>
                            <h2 className="text-sky-600 text-base sm:text-lg mt-2">
                                Regístrate en ExploraTec
                            </h2>
                        </div>

                        <form className="space-y-4" onSubmit={onSubmit}>
                            <div className="space-y-3">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <FiMail className="h-5 w-5 text-sky-400" />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        className="block w-full pl-12 pr-4 py-2.5 border border-sky-200 rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition duration-150 ease-in-out bg-white text-base"
                                        placeholder="Correo electrónico"
                                        value={email}
                                        onChange={onEmailChange}
                                        disabled={loading}
                                    />
                                </div>

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

                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <FiLock className="h-5 w-5 text-sky-400" />
                                    </div>
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        required
                                        className={`block w-full pl-12 pr-10 py-2.5 border rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition duration-150 ease-in-out bg-white text-base ${
                                            passwordsDontMatch 
                                                ? "border-red-400 focus:border-red-400 focus:ring-red-400" 
                                                : "border-sky-200"
                                        }`}
                                        placeholder="Confirmar contraseña"
                                        value={confirmPassword}
                                        onChange={onConfirmPasswordChange}
                                        disabled={loading}
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center space-x-2">
                                        <button
                                            type="button"
                                            className="flex items-center"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            disabled={loading}
                                        >
                                            {showConfirmPassword ? (
                                                <FiEyeOff className="h-5 w-5 text-sky-500" />
                                            ) : (
                                                <FiEye className="h-5 w-5 text-sky-500" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                                
                                {passwordsDontMatch && (
                                    <p className="text-red-500 text-sm mt-1">Las contraseñas no coinciden</p>
                                )}
                            </div>

                            {error && (
                                <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded text-sm">
                                    <p className="text-red-600">{error}</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={!isFormValid || loading}
                                className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-400 transition duration-150 ease-in-out text-base font-semibold shadow-md ${
                                    !isFormValid || loading
                                        ? "bg-gray-400 cursor-not-allowed" 
                                        : "bg-sky-500 hover:bg-sky-600"
                                }`}
                            >
                                {loading ? (
                                    <div className="flex items-center">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Registrando...
                                    </div>
                                ) : (
                                    "Registrarse"
                                )}
                            </button>
                            <div className="text-center">
                                <span className="text-gray-600">¿Ya tienes una cuenta? </span>
                                <a href="/login" className="text-sky-600 hover:text-sky-700 font-medium">
                                    Inicia Sesión
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