import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Items from './pages/Items';
import Logo from './assets/sickasslogo.svg';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 font-sans">
        <nav className="bg-purple-900 text-white shadow-lg border-b border-purple-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="font-extrabold text-xl tracking-wider flex items-center gap-2">
                <img src={Logo} alt="Logo Toko" className="w-8 h-8" />
                <span>Toko Netlab</span>
              </div>
              <div className="flex space-x-6 items-center text-sm">
                <Link to="/items" className="hover:text-purple-300 transition-colors font-medium">Daftar Barang</Link>
                <Link to="/login" className="hover:text-purple-300 transition-colors font-medium">Login</Link>
                <Link to="/register" className="bg-purple-700 hover:bg-purple-600 px-5 py-2 rounded-lg font-bold transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5">
                  Register
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <div className="p-8">
          <Routes>
            <Route path="/" element={<Items />} />
            <Route path="/items" element={<Items />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;