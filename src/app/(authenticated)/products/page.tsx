'use client';

import React, { useState } from 'react';
import {
  Header,
  HeaderActions,
  Input,
  Card,
  Button
} from '@/components';
import ProductModal from '@/components/ProductModal';

export default function ProductsPage() {
  const [searchValue, setSearchValue] = useState('');
  const [products] = useState(mockProducts);
  const [showModal, setShowModal] = useState(false);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    product.code.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[var(--background)]">
      <ProductModal isOpen={showModal} onClose={() => setShowModal(false)} onSave={() => setShowModal(false)} />
      {/* Header */}
      <Header
        title="Produtos"
        subtitle="Gerencie seus produtos cadastrados"
        onMenuToggle={() => {}}
        showMenuButton={true}
      >
        <HeaderActions>{null}</HeaderActions>
      </Header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-6 bg-[var(--background)]">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Barra de busca e botão Incluir Produto */}
          <div className="flex items-center gap-4 mb-2">
            <Input
              className="w-full md:w-80"
              placeholder="Buscar produtos..."
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              leftIcon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              }
            />
            <Button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-medium rounded-md transition-colors duration-200 whitespace-nowrap"
            >
              <span className="text-sm font-normal">+</span>
              Incluir Produto
            </Button>
          </div>

          {/* Tabela de Produtos */}
          <Card padding="none">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Imagem</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unidade</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preço</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estoque</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map(product => (
                      <tr key={product.id}>
                        <td className="px-4 py-2">
                          {product.image ? (
                            <img src={product.image} alt={product.name} className="w-10 h-10 object-cover rounded" />
                          ) : (
                            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded flex items-center justify-center text-gray-400">-</div>
                          )}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">{product.name}</td>
                        <td className="px-4 py-2 text-sm text-gray-700">{product.code}</td>
                        <td className="px-4 py-2 text-sm text-gray-700">{product.unit}</td>
                        <td className="px-4 py-2 text-sm text-gray-700">R$ {product.price.toFixed(2)}</td>
                        <td className="px-4 py-2 text-sm text-gray-700">{product.stock}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-gray-500">Nenhum produto encontrado.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}

// Mock de produtos para exibição inicial
const mockProducts = [
  {
    id: 1,
    image: '',
    name: 'Produto 1',
    code: 'P001',
    unit: 'un',
    price: 10.5,
    stock: 100
  },
  {
    id: 2,
    image: '',
    name: 'Produto 2',
    code: 'P002',
    unit: 'kg',
    price: 25.0,
    stock: 50
  }
];
