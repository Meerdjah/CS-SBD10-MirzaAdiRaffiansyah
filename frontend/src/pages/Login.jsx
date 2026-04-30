import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pesan, setPesan] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setPesan('Loading...');

    try {
      const response = await axios.post('https://cs-sbd-10-mirza-adi-raffiansyah-2ba.vercel.app/auth/login', {
        email: email,
        password: password
      });

      setPesan('Login Berhasil!');
      setTimeout(() => {
        navigate('/items');
      }, 1000);

    } catch (error) {
      console.error(error);
      setPesan('Login gagal. Cek kembali email dan passwordmu.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-purple-50 flex justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-purple-200 hover:shadow-xl transition-all duration-300 border border-purple-100 w-full max-w-md">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-purple-900 tracking-tight">Login Netlab</h2>
        
        {pesan && (
          <div className={`mb-6 p-3 text-center rounded-lg text-sm font-medium ${pesan.includes('Berhasil') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {pesan}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-purple-900 font-semibold mb-1 text-sm">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-500 transition-colors"
              placeholder="example@email.com"
              required 
            />
          </div>
          <div>
            <label className="block text-purple-900 font-semibold mb-1 text-sm">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-500 transition-colors"
              placeholder="Password"
              required 
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md mt-4"
          >
            Masuk Sekarang
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-500 font-medium">
          Belum punya akun? <Link to="/register" className="text-purple-600 hover:text-purple-800 hover:underline transition-colors">Daftar di sini</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;