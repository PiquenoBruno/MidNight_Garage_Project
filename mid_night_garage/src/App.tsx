import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Type from './pages/vehicle_type';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/type" element={<Type />} />
      </Routes>
    </Router>
  );
}

export default App;