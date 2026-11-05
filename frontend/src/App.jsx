import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import MenuAdminPage from './pages/MenuAdminPage';
import GestionUsuariosPage from './pages/GestionUsuariosPage';
import GestionProductosPage from './pages/GestionProductosPage';
import MenuAlmacenistaPage from './pages/MenuAlmacenistaPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/admin" element={<MenuAdminPage />} />
      <Route path="/usuarios" element={<GestionUsuariosPage />} />
      <Route path="/productos" element={<GestionProductosPage />} />
      <Route path="/almacenista" element={<MenuAlmacenistaPage />} /> 
    </Routes>
  );
}

export default App;