'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Product, ApiResponse } from '@/types/products';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const CATEGORIES = [
  { id: 0, nombre: '🔥 Todos' },
  { id: 1, nombre: '💻 Tecnología' },
  { id: 2, nombre: '🏠 Hogar' },
  { id: 3, nombre: '✨ Moda' }
];

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch(`${API_URL}/products`, { cache: 'no-store' });
        if (res.ok) {
          const data: ApiResponse<Product[]> = await res.json();
          if (data.success) setProducts(data.data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  const filteredProducts = selectedCategory === 0
    ? products
    : products.filter(p => p.CategoryId === selectedCategory);

  const getCatName = (id?: number) => {
    if (id === 1) return 'Tecnología';
    if (id === 2) return 'Hogar';
    if (id === 3) return 'Moda';
    return 'General';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96 text-gray-500 font-medium">
        Cargando las últimas tendencias...
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Micro-Banner */}
      <div className="bg-gradient-to-r from-gray-950 to-gray-800 text-white py-16 px-4 border-b border-gray-800">
        <div className="max-w-7xl mx-auto text-center md:text-left">
          <span className="text-xs font-bold tracking-widest text-blue-400 uppercase bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
            Novedades de la semana
          </span>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mt-4 max-w-2xl leading-none">
            Descubre productos con diseño inteligente.
          </h1>
          <p className="text-gray-400 text-md mt-4 max-w-md font-normal">
            Una selección curada de artículos premium con envíos express a nivel nacional.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Barra de Filtros Estilizada */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-5 mb-10">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Catálogo Exclusivo</h2>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-200 ${
                  selectedCategory === cat.id
                    ? 'bg-gray-900 text-white shadow-md shadow-gray-900/10'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {cat.nombre}
              </button>
            ))}
          </div>
        </div>

        {/* Grid de Productos */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-200/60 shadow-sm">
            <p className="text-gray-400 font-medium">No se encontraron artículos en esta sección.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="group bg-white rounded-2xl border border-gray-200/70 overflow-hidden hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col"
              >
                {/* Contenedor Imagen Proporcional */}
                <div 
                  className="aspect-[4/3] w-full bg-gray-100 relative bg-cover bg-center group-hover:scale-102 transition-transform duration-500"
                  style={{ backgroundImage: `url(${product.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'})` }}
                />
                
                {/* Cuerpo del Card */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                        {getCatName(product.CategoryId)}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors line-clamp-1">
                      {product.nombre}
                    </h3>
                    {product.descripcion && (
                      <p className="text-gray-500 text-xs mt-2 line-clamp-2 leading-relaxed">
                        {product.descripcion}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Precio contado</span>
                      <span className="text-xl font-black text-gray-900 tracking-tight">
                        S/ {Number(product.precio).toFixed(2)}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-blue-600 group-hover:underline flex items-center gap-1">
                      Ver detalles →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}