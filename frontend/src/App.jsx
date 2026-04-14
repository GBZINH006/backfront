import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PrimeReactProvider } from 'primereact/api';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import Shop from './pages/Shop';

function getRole() {
  try {
    const token = localStorage.getItem('token');
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role;
  } catch { return null; }
}

function PrivateRoute({ children, adminOnly }) {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" />;
  if (adminOnly && getRole() !== 'admin') return <Navigate to="/shop" />;
  return children;
}

export default function App() {
  return (
    <PrimeReactProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products" element={
            <PrivateRoute adminOnly>
              <Products />
            </PrivateRoute>
          } />
          <Route path="/shop" element={
            <PrivateRoute>
              <Shop />
            </PrivateRoute>
          } />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </PrimeReactProvider>
  );
}