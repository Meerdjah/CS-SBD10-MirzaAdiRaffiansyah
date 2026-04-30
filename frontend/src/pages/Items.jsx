import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Items() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:3000/items')
      .then((response) => {
        setItems(response.data.data || response.data.payload || response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Gagal mengambil data barang:", error);
        setLoading(false);
      });
  }, []);

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(angka);
  };

return (
    <div className="min-h-screen bg-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="flex justify-between items-end mb-8 border-b border-purple-200 pb-4">
          <div>
            <h1 className="text-3xl font-extrabold text-purple-900 tracking-tight">Catalog</h1>
            <p className="text-purple-600 mt-2 font-medium">The best hardware in store</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {items.map((item) => (
              <div 
                key={item.id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-purple-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-purple-100 flex flex-col"
              >
                <img 
                  src={`/${item.name.toLowerCase()}.jpg`}
                  alt={item.name} 
                  className="h-48 w-full object-cover object-center"
                  onError={(e) => {
                    e.target.onerror = null; 
                    e.target.src = `https://ui-avatars.com/api/?name=${item.name}&background=f3e8ff&color=7e22ce&size=400`;
                  }}
                />

                <div className="p-5 grow flex flex-col justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-purple-900 mb-1 line-clamp-1">{item.name}</h2>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-purple-600 font-extrabold text-lg">{formatRupiah(item.price)}</span>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-purple-50 flex justify-between items-center">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${item.stock > 10 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      Stok: {item.stock}
                    </span>
                    
                    <button className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium py-1.5 px-4 rounded-lg transition-colors shadow-sm hover:shadow-md">
                      Beli
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Items;