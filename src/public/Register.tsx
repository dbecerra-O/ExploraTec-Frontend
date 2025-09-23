import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RegisterForm } from '../components';
import { authService } from '../services/authservice';

export const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(undefined);
    setLoading(true);
    try {
      await authService.register({ email, username, password });
      navigate('/main');
    } catch (err: any) {
      setError(err.message || 'Error en el registro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <RegisterForm
      email={email}
      username={username}
      password={password}
      confirmPassword={confirmPassword}
      onEmailChange={(e) => setEmail(e.target.value)}
      onUsernameChange={(e) => setUsername(e.target.value)}
      onPasswordChange={(e) => setPassword(e.target.value)}
      onConfirmPasswordChange={(e) => setConfirmPassword(e.target.value)}
      onSubmit={onSubmit}
      error={error}
      loading={loading}
    />
  );
};
