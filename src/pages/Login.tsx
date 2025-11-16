import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import './Login.css';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = login(username, password);
      if (success) {
        toast({
          title: 'Muvaffaqiyatli!',
          description: 'Tizimga kirdingiz',
        });
        navigate('/dashboard');
      } else {
        toast({
          title: 'Xato',
          description: 'Username yoki parol noto\'g\'ri',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Xato',
        description: 'Tizimga kirishda xatolik yuz berdi',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="background">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
        <div className="shape shape-4"></div>
        <div className="shape shape-5"></div>
      </div>

      <div className="login-card">
        <img className="logo-placeholder" src="/logo.png" alt="Logo" />
        
        <div className="login-header">
          <h3>University of Business and Science<br />Tashkent branch</h3>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={isLoading}
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />

          <button type="submit" className="signin-btn" disabled={isLoading}>
            {isLoading ? 'Yuklanmoqda...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
