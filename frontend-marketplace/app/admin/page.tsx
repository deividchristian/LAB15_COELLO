'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Product, ApiResponse } from '@/types/products';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export default function AdminPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    nombre: '',
    precio: '',
    descripcion: '',
    imageUrl: '',
    CategoryId: '1'
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    const currentRole = localStorage.getItem('user-role') || 'CUSTOMER';
    if (currentRole !== 'ADMIN') {
      alert('Acceso restringido: Requiere privilegios de Administrador');
      router.push('/');
      return;
    }
    fetchProducts();
  }, [router]);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/products`);
      const data: ApiResponse<Product[]> = await res.json();
      if (data.success) setProducts(data.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingId ? `${API_URL}/products/${editingId}` : `${API_URL}/products`;
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'x-role': 'ADMIN'
        },
        body: JSON.stringify({
          nombre: formData.nombre,
          precio: parseFloat(formData.precio),
          descripcion: formData.descripcion || undefined,
          imageUrl: formData.imageUrl || undefined,
          CategoryId: parseInt(formData.CategoryId)
        }),
      });

      if (res.ok) {
        setFormData({ nombre: '', precio: '', descripcion: '', imageUrl: '', CategoryId: '1' });
        setEditingId(null);
        fetchProducts();
      }
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleEdit = (product: Product) => {
    setFormData({
      nombre: product.nombre,
      precio: product.precio.toString(),
      descripcion: product.descripcion || '',
      imageUrl: product.imageUrl || '',
      CategoryId: (product.CategoryId || 1).toString()
    });
    setEditingId(product.id);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Desea dar de baja este artículo del inventario público?')) return;

    try {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: { 'x-role': 'ADMIN' }
      });
      if (res.ok) fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  // Cálculos dinámicos para los KPI Cards
  const totalValue = products.reduce((acc, p) => acc + Number(p.precio), 0);
  const totalCategories = new Set(products.map(p => p.CategoryId)).size;

  if (loading) return <div className="text-center py-20 text-gray-500 font-medium">Abriendo consola de administración...</div>;

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Encabezado del Panel */}
        <div className="mb-10">
          <h1 className="text-3xl font-black tracking-tight text-gray-900">Consola Interna de Control</h1>
          <p className="text-gray-500 text-sm mt-1">Supervisión integral de catálogo, precios e inventario en Railway.</p>
        </div>

        {/* Dashboard Cards Widgets */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl border border-gray-200/80 shadow-sm flex flex-col">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Productos Activos</span>
            <span className="text-3xl font-black text-gray-900 mt-2">{products.length} Items</span>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200/80 shadow-sm flex flex-col">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Valor total del catálogo</span>
            <span className="text-3xl font-black text-blue-600 mt-2">S/ {totalValue.toFixed(2)}</span>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200/80 shadow-sm flex flex-col">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Secciones Cubiertas</span>
            <span className="text-3xl font-black text-gray-900 mt-2">{totalCategories || 1} Categorías</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Formulario Estilizado */}
          <div className="lg:col-span-1 bg-white border border-gray-200/80 rounded-xl p-6 shadow-sm sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-3">
              {editingId ? '⚡ Editar Registro' : '➕ Alta de Artículo'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Nombre Comercial</label>
                <input
                  type="text" required value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-lg text-sm text-gray-900 focus:bg-white focus:ring-2 focus:ring-gray-900 focus:outline-none transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Precio (S/)</label>
                  <input
                    type="number" step="0.01" required value={formData.precio}
                    onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-lg text-sm text-gray-900 focus:bg-white focus:ring-2 focus:ring-gray-900 focus:outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Categoría</label>
                  <select
                    value={formData.CategoryId}
                    onChange={(e) => setFormData({ ...formData, CategoryId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-lg text-sm text-gray-900 focus:bg-white focus:ring-2 focus:ring-gray-900 focus:outline-none transition-all"
                  >
                    <option value="1">Tecnología</option>
                    <option value="2">Hogar</option>
                    <option value="3">Moda</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Enlace de Imagen (URL)</label>
                <input
                  type="url" value={formData.imageUrl} placeholder="https://images.unsplash.com/..."
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-lg text-xs text-gray-900 focus:bg-white focus:ring-2 focus:ring-gray-900 focus:outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Ficha Descriptiva</label>
                <textarea
                  rows={3} value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-lg text-sm text-gray-900 focus:bg-white focus:ring-2 focus:ring-gray-900 focus:outline-none transition-all"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 bg-gray-900 text-white py-2 text-sm font-bold uppercase tracking-wider rounded-lg hover:bg-gray-800 shadow-lg shadow-gray-900/10 transition-all">
                  {editingId ? 'Guardar' : 'Publicar'}
                </button>
                {editingId && (
                  <button type="button" onClick={() => setEditingId(null)} className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Tabla Gerencial */}
          <div className="lg:col-span-2 bg-white border border-gray-200/80 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-400">Miniatura</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-400">Nombre</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-400">Precio</th>
                  <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-gray-400">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div 
                        className="w-12 h-12 rounded-lg bg-cover bg-center border border-gray-200/60"
                        style={{ backgroundImage: `url(${product.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'})` }}
                      />
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">{product.nombre}</td>
                    <td className="px-6 py-4 text-sm font-black text-gray-900">S/ {Number(product.precio).toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm text-right space-x-4">
                      <button onClick={() => handleEdit(product)} className="text-gray-500 hover:text-gray-900 font-bold text-xs uppercase tracking-wider">Editar</button>
                      <button onClick={() => handleDelete(product.id)} className="text-red-500 hover:text-red-700 font-bold text-xs uppercase tracking-wider">Baja</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}