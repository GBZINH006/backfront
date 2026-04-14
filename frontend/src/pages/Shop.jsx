import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import api from '../services/api';

function getUserInfo() {
  try {
    const token = localStorage.getItem('token');
    return JSON.parse(atob(token.split('.')[1]));
  } catch { return {}; }
}

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);
  const navigate = useNavigate();
  const user = getUserInfo();

  async function fetchProducts() {
    setLoading(true);
    try {
      const { data } = await api.get('/products');

      const list = Array.isArray(data) ? data : [];
      setProducts(list);
      setFiltered(list);

    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchProducts(); }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      (p.description || '').toLowerCase().includes(q)
    ));
  }, [search, products]);

  function handleLogout() {
    localStorage.removeItem('token');
    navigate('/login');
  }


  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(circle at top, #0f172a, #020617)',
        padding: '2rem',
        display: 'flex',
        justifyContent: 'center'
      }}
    >
      <Toast ref={toast} />
  
      <div style={{ width: '100%', maxWidth: '1200px' }}>
  
        {/* HEADER */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
            padding: '1.2rem 1.5rem',
            borderRadius: '1rem',
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 10px 40px rgba(0,0,0,0.4)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <div
              style={{
                width: 45,
                height: 45,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 20px rgba(99,102,241,0.6)'
              }}
            >
              <i className="pi pi-shopping-bag" style={{ color: '#fff' }} />
            </div>
  
            <div>
              <h2 style={{ color: '#fff', margin: 0 }}>ProductHub</h2>
              <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
                Loja digital
              </span>
            </div>
          </div>
  
          <Button
            icon="pi pi-sign-out"
            rounded
            text
            severity="danger"
            onClick={handleLogout}
          />
        </div>
  
        {/* SEARCH */}
        <div style={{ marginBottom: '2rem', maxWidth: '500px' }}>
          <div style={{ position: 'relative' }}>
            <i
              className="pi pi-search"
              style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#6366f1'
              }}
            />
            <InputText
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar produtos..."
              style={{
                width: '100%',
                padding: '0.8rem 1rem 0.8rem 2.5rem',
                borderRadius: '0.8rem',
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: '#fff'
              }}
            />
          </div>
        </div>
  
        {/* GRID */}
        {loading ? (
          <div style={{ textAlign: 'center', color: '#94a3b8', marginTop: '3rem' }}>
            <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }} />
            <p>Carregando produtos...</p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '1.5rem'
            }}
          >
            {filtered.map(product => (
              <div
                key={product.id}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: '1rem',
                  border: '1px solid rgba(255,255,255,0.1)',
                  overflow: 'hidden',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.25s ease',
                  boxShadow: '0 6px 25px rgba(0,0,0,0.4)',
                  cursor: 'pointer'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 20px 60px rgba(99,102,241,0.35)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 6px 25px rgba(0,0,0,0.4)';
                }}
                onClick={() => {
                  setSelectedProduct(product);
                  setDetailVisible(true);
                }}
              >
                {/* IMAGEM FAKE */}
                <div
                  style={{
                    height: 160,
                    background: 'linear-gradient(135deg, #6366f122, #8b5cf622)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <i className="pi pi-box" style={{ fontSize: '2.5rem', color: '#6366f1' }} />
                </div>
  
                <div style={{ padding: '1rem' }}>
                  <h3 style={{ color: '#fff', margin: '0 0 0.5rem' }}>
                    {product.name}
                  </h3>
  
                  <p style={{
                    color: '#94a3b8',
                    fontSize: '0.85rem',
                    minHeight: 40
                  }}>
                    {product.description || 'Sem descrição'}
                  </p>
  
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '0.8rem'
                  }}>
                    <span style={{
                      color: '#22c55e',
                      fontWeight: 700,
                      fontSize: '1.2rem'
                    }}>
                      R$ {Number(product.price).toFixed(2)}
                    </span>
  
                    <Tag value="Disponível" severity="success" />
                  </div>
  
                  <Button
                    label="Ver detalhes"
                    icon="pi pi-eye"
                    text
                    style={{ width: '100%', marginTop: '0.8rem' }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
  
        {/* MODAL */}
        <Dialog
          header="📦 Produto"
          visible={detailVisible}
          onHide={() => setDetailVisible(false)}
          style={{ width: '400px' }}
          modal
        >
          {selectedProduct && (
            <>
              <h2>{selectedProduct.name}</h2>
              <p>{selectedProduct.description}</p>
              <h3>R$ {Number(selectedProduct.price).toFixed(2)}</h3>
            </>
          )}
        </Dialog>
      </div>
    </div>
