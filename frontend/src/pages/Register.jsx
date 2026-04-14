import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Card } from 'primereact/card';
import api from '../services/api';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const toast = useRef(null);
  const navigate = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/auth/register', { name, email, password });

      toast.current.show({
        severity: 'success',
        summary: 'Conta criada 🔥',
        detail: 'Agora faz login',
        life: 2000
      });

      setTimeout(() => navigate('/login'), 1500);

    } catch {
      toast.current.show({
        severity: 'error',
        summary: 'Erro',
        detail: 'Não foi possível cadastrar'
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
      background: 'linear-gradient(135deg, #0f172a, #020617)'
    }}>
      <Toast ref={toast} />

      <Card style={{
        width: '400px',
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(10px)',
        borderRadius: '1rem'
      }}>
        <h2 style={{ color: '#fff', textAlign: 'center' }}>Criar conta</h2>

        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <InputText
            placeholder="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <InputText
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Password
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            feedback={false}
            toggleMask
          />

          <Button
            label={loading ? 'Criando...' : 'Criar conta'}
            loading={loading}
            type="submit"
          />

          <Button
            label="Já tenho conta"
            text
            onClick={() => navigate('/login')}
          />

        </form>
      </Card>
    </div>
  );
}