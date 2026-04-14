import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import api from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await api.post('/auth/login', {
        email,
        password
      });

      localStorage.setItem('token', data.token);

      toast.current.show({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Login realizado!',
        life: 2000
      });

      setTimeout(() => navigate('/shop'), 1000);

    } catch (err) {
      console.log(err);

      toast.current.show({
        severity: 'error',
        summary: 'Erro',
        detail: err.response?.data?.error || 'Erro ao fazer login',
        life: 3000
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at top, #0f172a, #020617)',
    }}>
      <Toast ref={toast} />

      <div style={{ width: '100%', maxWidth: 420, padding: '0 1.5rem' }}>

        {/* LOGO */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
            boxShadow: '0 0 40px rgba(99,102,241,0.6)',
            animation: 'pulse 2s infinite'
          }}>
            <i className="pi pi-box" style={{ fontSize: '2rem', color: '#fff' }} />
          </div>

          <h1 style={{ color: '#fff', marginTop: '1rem' }}>ProductHub</h1>
          <p style={{ color: '#94a3b8' }}>Acesse sua conta</p>
        </div>

        {/* CARD */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '1.5rem',
          padding: '2rem',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
        }}>
          <form onSubmit={handleLogin}>

            <div style={{ marginBottom: '1.2rem' }}>
              <InputText
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email"
                style={{
                  width: '100%',
                  padding: '0.9rem',
                  borderRadius: '0.8rem',
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#fff'
                }}
              />
            </div>

            <div style={{ marginBottom: '1.8rem' }}>
              <Password
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Senha"
                toggleMask
                feedback={false}
                inputStyle={{
                  width: '100%',
                  padding: '0.9rem',
                  borderRadius: '0.8rem',
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#fff'
                }}
              />
            </div>

            <Button
              type="submit"
              label={loading ? 'Entrando...' : 'Entrar'}
              icon="pi pi-sign-in"
              loading={loading}
              style={{
                width: '100%',
                padding: '0.9rem',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                border: 'none',
                borderRadius: '0.8rem',
                fontWeight: 700,
                boxShadow: '0 10px 30px rgba(99,102,241,0.5)'
              }}
            />
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <span style={{ color: '#94a3b8' }}>Não tem conta? </span>
            <Link to="/register" style={{ color: '#6366f1', fontWeight: 700 }}>
              Criar conta
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}