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
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      const payload = JSON.parse(atob(data.token.split('.')[1]));
      toast.current.show({ severity: 'success', summary: 'Bem-vindo!', detail: 'Login realizado!', life: 2000 });
      setTimeout(() => navigate(payload.role === 'admin' ? '/products' : '/shop'), 1500);
    } catch {
      toast.current.show({ severity: 'error', summary: 'Erro', detail: 'E-mail ou senha inválidos.', life: 3000 });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)',
    }}>
      <Toast ref={toast} />
      <div style={{ width: '100%', maxWidth: 420, padding: '0 1.5rem' }}>

        {/* LOGO */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: 76, height: 76, borderRadius: '50%',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.2rem',
            boxShadow: '0 0 40px rgba(99,102,241,0.6)',
          }}>
            <i className="pi pi-box" style={{ fontSize: '2.2rem', color: '#fff' }} />
          </div>
          <h1 style={{ color: '#fff', fontSize: '2rem', fontWeight: 800, margin: 0, letterSpacing: '-0.5px' }}>ProductHub</h1>
          <p style={{ color: '#64748b', marginTop: '0.5rem', fontSize: '0.95rem' }}>Faça login para continuar</p>
        </div>

        {/* CARD */}
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '1.5rem',
          padding: '2rem',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
        }}>
          <form onSubmit={handleLogin}>
            {/* EMAIL */}
            <div style={{ marginBottom: '1.2rem' }}>
              <label style={{ color: '#94a3b8', fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                E-mail
              </label>
              <div style={{ position: 'relative' }}>
                <i className="pi pi-envelope" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#6366f1', zIndex: 1 }} />
                <InputText
                  value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="seu@email.com" type="email" required
                  style={{
                    width: '100%', paddingLeft: '2.8rem',
                    background: 'rgba(99,102,241,0.08)',
                    border: '1px solid rgba(99,102,241,0.2)',
                    borderRadius: '0.75rem', color: '#fff',
                    fontSize: '0.95rem', padding: '0.85rem 0.85rem 0.85rem 2.8rem',
                    transition: 'border 0.2s',
                  }}
                />
              </div>
            </div>

            {/* SENHA */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ color: '#94a3b8', fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Senha
              </label>
              <Password
                value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" feedback={false} toggleMask required
                inputStyle={{
                  width: '100%', background: 'rgba(99,102,241,0.08)',
                  border: '1px solid rgba(99,102,241,0.2)',
                  borderRadius: '0.75rem', color: '#fff', fontSize: '0.95rem',
                  padding: '0.85rem',
                }}
                style={{ width: '100%' }}
              />
            </div>

            {/* BOTÃO */}
            <Button
              type="submit"
              label={loading ? 'Entrando...' : 'Entrar'}
              icon={loading ? 'pi pi-spin pi-spinner' : 'pi pi-sign-in'}
              loading={loading}
              style={{
                width: '100%', padding: '0.9rem',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                border: 'none', borderRadius: '0.75rem', fontSize: '1rem', fontWeight: 700,
                boxShadow: '0 8px 25px rgba(99,102,241,0.5)',
                transition: 'transform 0.2s',
              }}
            />
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Não tem uma conta? </span>
            <Link to="/register" style={{ color: '#818cf8', fontWeight: 700, textDecoration: 'none', fontSize: '0.9rem' }}>Criar conta</Link>
          </div>
        </div>
      </div>
    </div>
  );
}