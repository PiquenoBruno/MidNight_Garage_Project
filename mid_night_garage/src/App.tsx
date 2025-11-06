import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Type from './pages/vehicle_type';
import LoginPage from './pages/login';
import CadastroPage from './pages/cadastro';
import Catalogo from './pages/catalogo';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/type" element={<Type />} />
        <Route path="/login" element={< LoginPage/>} />
        <Route path="/cadastro" element={< CadastroPage/>} />
        <Route path="/catalogo" element={<Catalogo />} />

      </Routes>
    </Router>
  );
}

export default App;