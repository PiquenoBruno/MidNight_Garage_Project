import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import LoginPage from './pages/login';
import CadastroPage from './pages/cadastro';
import Catalogo from './pages/catalogo';
import AdminDashboard from './pages/page_dashboard';
import PageUserList from './pages/page_userlist';
import PageAdminList from './pages/page_adminlist';
import PagePedidos from './pages/page_pedidos';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={< LoginPage/>} />
        <Route path="/cadastro" element={< CadastroPage/>} />
        <Route path="/catalogo" element={< Catalogo />} />
        <Route path='/dashboard' element={< AdminDashboard />} />
        <Route path='/userlist' element={< PageUserList />} />
        <Route path='/adminlist' element={<PageAdminList />} />
        <Route path='/pedidolist' element={<PagePedidos />} />

      </Routes>
    </Router>
  );
}

export default App;