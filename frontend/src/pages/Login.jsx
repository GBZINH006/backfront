import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Card } from 'primereact/card';
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
      toast.current.show({ severity: 'success', summary: 'Bem-vindo!', detail: 'Login realizado com sucesso.', life: 2000 });
      setTimeout(() => navigate('/products'), 1500);
    } catch {
      toast.current.show({ severity: 'error', summary: 'Erro', detail: 'E-mail ou senha inválidos.', life: 3000 });
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
      background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)',
    }}>
      <Toast ref={toast} />

      <div style={{ width: '100%', maxWidth: 420, padding: '0 1rem' }}>
        {/* Logo / Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: 70, height: 70, borderRadius: '50%',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1rem',
            boxShadow: '0 0 30px rgba(99,102,241,0.5)',
          }}>
            <i className="pi pi-box" style={{ fontSize: '2rem', color: '#fff' }} />
          </div>
          <h1 style={{ color: '#fff', fontSize: '1.8rem', fontWeight: 700, margin: 0 }}>ProductHub</h1>
          <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>Faça login para continuar</p>
        </div>

        <Card style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '1rem',
          backdropFilter: 'blur(10px)',
        }}>
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ color: '#94a3b8', fontSize: '0.85rem', display: 'block', marginBottom: '0.5rem' }}>
                E-mail
              </label>
              <span className="p-input-icon-left" style={{ width: '100%' }}>
                <i className="pi pi-envelope" />
                <InputText
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  style={{ width: '100%', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }}
                  required
                />
              </span>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ color: '#94a3b8', fontSize: '0.85rem', display: 'block', marginBottom: '0.5rem' }}>
                Senha
              </label>
              <Password
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                feedback={false}
                toggleMask
                inputStyle={{ width: '100%', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff' }}
                style={{ width: '100%' }}
                required
              />
            </div>

            <Button
              type="submit"
              label={loading ? 'Entrando...' : 'Entrar'}
              icon={loading ? 'pi pi-spin pi-spinner' : 'pi pi-sign-in'}
              loading={loading}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                border: 'none',
                padding: '0.85rem',
                fontSize: '1rem',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 20px rgba(99,102,241,0.4)',
              }}
            />
          </form>
        </Card>
      </div>
    </div>
  );
}