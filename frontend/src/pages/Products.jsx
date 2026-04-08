import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import api from '../services/api';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', price: 0 });
  const [saving, setSaving] = useState(false);

  const toast = useRef(null);
  const navigate = useNavigate();

  async function fetchProducts() {
    setLoading(true);
    try {
      const { data } = await api.get('/products');

      if (Array.isArray(data)) {
        setProducts(data);
      } else if (Array.isArray(data?.data)) {
        setProducts(data.data);
      } else {
        setProducts([]);
      }

    } catch (err) {
      setProducts([]);

      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }

      toast.current.show({
        severity: 'error',
        summary: 'Erro',
        detail: 'Erro ao carregar produtos'
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  function openNew() {
    setEditingProduct(null);
    setForm({ name: '', description: '', price: 0 });
    setDialogVisible(true);
  }

  function openEdit(product) {
    setEditingProduct(product);
    setForm(product);
    setDialogVisible(true);
  }

  async function handleSave() {
    if (!form.name || !form.price) {
      toast.current.show({ severity: 'warn', summary: 'Preencha tudo' });
      return;
    }

    setSaving(true);

    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, form);
      } else {
        await api.post('/products', form);
      }

      toast.current.show({ severity: 'success', summary: 'Salvo com sucesso 🔥' });

      setDialogVisible(false);
      fetchProducts();

    } catch {
      toast.current.show({ severity: 'error', summary: 'Erro ao salvar' });
    } finally {
      setSaving(false);
    }
  }

  function confirmDelete(product) {
    confirmDialog({
      message: `Deletar ${product.name}?`,
      accept: () => handleDelete(product.id),
    });
  }

  async function handleDelete(id) {
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch {
      toast.current.show({ severity: 'error', summary: 'Erro ao deletar' });
    }
  }

  function handleLogout() {
    localStorage.removeItem('token');
    navigate('/login');
  }

  const priceTemplate = (row) => (
    <span style={{
      background: 'rgba(34,197,94,0.15)',
      padding: '0.3rem 0.6rem',
      borderRadius: '0.5rem',
      color: '#22c55e',
      fontWeight: 600
    }}>
      R$ {Number(row.price).toFixed(2)}
    </span>
  );

  const actionsTemplate = (row) => (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      <Button
        icon="pi pi-pencil"
        rounded
        text
        severity="info"
        onClick={() => openEdit(row)}
      />
      <Button
        icon="pi pi-trash"
        rounded
        text
        severity="danger"
        onClick={() => confirmDelete(row)}
      />
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(circle at top, #1e293b, #020617)',
      display: 'flex',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <Toast ref={toast} />
      <ConfirmDialog />

      <div style={{ width: '100%', maxWidth: '1200px' }}>

        {/* HEADER */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          padding: '1.5rem',
          borderRadius: '1rem',
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
        }}>
          <h2 style={{ color: '#fff' }}>🚀 ProductHub</h2>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <Button label="Novo Produto" icon="pi pi-plus" onClick={openNew} />
            <Button icon="pi pi-sign-out" severity="danger" onClick={handleLogout} />
          </div>
        </div>

        {/* TABELA */}
        <div style={{
          borderRadius: '1rem',
          overflow: 'hidden',
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 10px 50px rgba(0,0,0,0.6)'
        }}>
          <DataTable
            value={products}
            loading={loading}
            paginator
            rows={8}
            stripedRows
            rowHover
            emptyMessage="Nenhum produto encontrado"
          >
            <Column field="id" header="ID" />
            <Column field="name" header="Nome" />
            <Column field="description" header="Descrição" />
            <Column field="price" header="Preço" body={priceTemplate} />
            <Column header="Ações" body={actionsTemplate} />
          </DataTable>
        </div>

        {/* MODAL */}
        <Dialog
          header={editingProduct ? 'Editar Produto' : 'Novo Produto'}
          visible={dialogVisible}
          onHide={() => setDialogVisible(false)}
          style={{ width: '400px' }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <InputText
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Nome"
            />

            <InputTextarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Descrição"
            />

            <InputNumber
              value={form.price}
              onValueChange={(e) => setForm({ ...form, price: e.value })}
              mode="currency"
              currency="BRL"
              locale="pt-BR"
            />

            <Button
              label={saving ? 'Salvando...' : 'Salvar'}
              loading={saving}
              onClick={handleSave}
            />
          </div>
        </Dialog>
      </div>
    </div>
  );
}