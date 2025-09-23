import React, { useState } from 'react';
import { LoginForm } from '../components';
import { useLogin } from '../hooks/useLogin';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import type { LoginRequest, AuthResponse } from '../types';

export const Login: React.FC = () => {
    const navigate = useNavigate();
    const { loading, error, login } = useLogin();
    const { updateAuthStatus } = useAuth();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value);
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const credentials: LoginRequest = { username, password };

        try {
            const response: AuthResponse | null = await login(credentials);

            if (response && response.access_token) {
                localStorage.setItem('access_token', response.access_token);
                if (response.user) localStorage.setItem('user', JSON.stringify(response.user));

                window.dispatchEvent(new CustomEvent('authChange'));
                updateAuthStatus();

                // Redirigir según rol
                if (response.user?.is_admin) {
                    navigate('/dashboard', { replace: true });
                } else {
                    navigate('/main', { replace: true });
                }
            } else {
                // response === null -> error ya seteado en useLogin
                console.warn('Login falló.');
            }
        } catch (err) {
            console.error('Error en login:', err);
        }
    };

    return (
        <LoginForm
            username={username}
            password={password}
            onUsernameChange={handleUsernameChange}
            onPasswordChange={handlePasswordChange}
            onSubmit={handleSubmit}
            error={error || undefined}
            loading={loading}
        />
    );
};

export default Login;