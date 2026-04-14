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
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(circle at top, #0f172a, #020617)',
      padding: '2rem',
      display: 'flex',
      justifyContent: 'center'
    }}>
      <Toast ref={toast} />

      <div style={{ width: '100%', maxWidth: '1300px' }}>

        {/* HEADER */}
        <div style={{
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
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: 50,
              height: 50,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 25px rgba(99,102,241,0.7)'
            }}>
              <i className="pi pi-shopping-bag" style={{ color: '#fff', fontSize: '1.3rem' }} />
            </div>

            <div>
              <h2 style={{ color: '#fff', margin: 0 }}>ProductHub</h2>
              <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                Fala {user.name || 'dev'} 👋
              </span>
            </div>
          </div>

          <Button icon="pi pi-sign-out" rounded text severity="danger" onClick={handleLogout} />
        </div>

        {/* SEARCH */}
        <div style={{ marginBottom: '2rem', maxWidth: 500 }}>
          <div style={{ position: 'relative' }}>
            <i className="pi pi-search" style={{
              position: 'absolute',
              left: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#6366f1'
            }} />
            <InputText
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar produtos..."
              style={{
                width: '100%',
                padding: '0.9rem 1rem 0.9rem 2.5rem',
                borderRadius: '1rem',
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: '#fff'
              }}
            />
          </div>
        </div>

        {/* GRID */}
        {loading ? (
          <div style={{ textAlign: 'center', marginTop: '4rem' }}>
            <i className="pi pi-spin pi-spinner" style={{ fontSize: '2.5rem', color: '#6366f1' }} />
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '1.5rem'
          }}>
            {filtered.map(product => (
              <div key={product.id}
                style={{
                  borderRadius: '1rem',
                  overflow: 'hidden',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  transition: 'all 0.3s',
                  cursor: 'pointer'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-8px) scale(1.03)';
                  e.currentTarget.style.boxShadow = '0 20px 60px rgba(99,102,241,0.4)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                onClick={() => {
                  setSelectedProduct(product);
                  setDetailVisible(true);
                }}
              >
                <div style={{
                  height: 170,
                  background: 'linear-gradient(135deg, #6366f122, #8b5cf622)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <i className="pi pi-box" style={{ fontSize: '3rem', color: '#6366f1' }} />
                </div>

                <div style={{ padding: '1rem' }}>
                  <h3 style={{ color: '#fff' }}>{product.name}</h3>

                  <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                    {product.description || 'Sem descrição'}
                  </p>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{ color: '#22c55e', fontWeight: 700 }}>
                      R$ {Number(product.price).toFixed(2)}
                    </span>

                    <Tag value="Disponível" severity="success" />
                  </div>

                  <Button label="Ver mais" icon="pi pi-eye" text style={{ width: '100%', marginTop: '0.5rem' }} />
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
          style={{ width: '420px' }}
          modal
        >
          {selectedProduct && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h2 style={{ margin: 0 }}>{selectedProduct.name}</h2>
              <p>{selectedProduct.description}</p>
              <h3 style={{ color: '#22c55e' }}>
                R$ {Number(selectedProduct.price).toFixed(2)}
              </h3>

              <Button
                label="Comprar"
                icon="pi pi-cart-plus"
                style={{
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  border: 'none'
                }}
              />
            </div>
          )}
        </Dialog>

      </div>
    </div>
  );
}