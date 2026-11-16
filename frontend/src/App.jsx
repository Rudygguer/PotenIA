import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import MenuAdminPage from './pages/MenuAdminPage';
import GestionUsuariosPage from './pages/GestionUsuariosPage';
import GestionProductosPage from './pages/GestionProductosPage';
import MenuAlmacenistaPage from './pages/MenuAlmacenistaPage';
import RutaProtegida from './components/RutaProtegida';
import GestionProveedoresPage from './pages/GestionProveedoresPage';

function App() {
  return (
    <Routes>
  <Route path="/" element={<Navigate to="/login" />} />
  <Route path="/login" element={<LoginPage />} />

  {/* Todo lo que está aquí dentro es solo para admin */}
  <Route element={<RutaProtegida rolPermitido="admin" />}>
    <Route path="/admin" element={<MenuAdminPage />} />
    <Route path="/usuarios" element={<GestionUsuariosPage />} />
    <Route path="/productos" element={<GestionProductosPage />} />
    <Route path="/proveedores" element={<GestionProveedoresPage />} />
  </Route>

  {/* Todo lo que está aquí dentro es solo para almacenista */}
  <Route element={<RutaProtegida rolPermitido="almacenista" />}>
    <Route path="/almacenista" element={<MenuAlmacenistaPage />} />
  </Route>
</Routes>
  );
}

export default App;