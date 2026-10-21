import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import MenuAdminPage from './pages/MenuAdminPage';
import GestionUsuariosPage from './pages/GestionUsuariosPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/admin" element={<MenuAdminPage />} />
      <Route path="/usuarios" element={<GestionUsuariosPage />} />
    </Routes>
  );
}

export default App;