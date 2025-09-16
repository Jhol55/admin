import React, { useState } from 'react';
import { Input, Button } from '@/components';

export type ProductForm = {
  nome: string;
  codigo: string;
  valor: string;
  valorPromocional: string;
  peso: string;
  comprimento: string;
  largura: string;
  altura: string;
  quantidadeUnidade: string;
};

export type ProductModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (form: ProductForm) => void;
};

const ProductModal = ({ isOpen, onClose, onSave }: ProductModalProps) => {
  const [tab, setTab] = useState<'dados' | 'caracteristicas' | 'imagens' | 'estoque' | 'tributacao' | 'variacoes'>('dados');
  const [form, setForm] = useState<ProductForm>({
    nome: '',
    codigo: '',
    valor: '',
    valorPromocional: '',
    peso: '',
    comprimento: '',
    largura: '',
    altura: '',
    quantidadeUnidade: '',
  });

  if (!isOpen) return null;

  const steps = [
    { key: 'dados', label: 'Dados básicos', optional: false },
    { key: 'caracteristicas', label: 'Características', optional: true },
    { key: 'imagens', label: 'Imagens', optional: true },
    { key: 'estoque', label: 'Estoque', optional: true },
    { key: 'tributacao', label: 'Tributação', optional: true },
    { key: 'variacoes', label: 'Variações', optional: true },
  ];

  const stepperActiveColor = 'bg-green-600 border-green-600 text-white';
  const stepperInactiveColor = 'bg-gray-50 dark:bg-gray-200 border-gray-300 text-gray-400';
  const stepperTextActive = 'text-green-600';
  const stepperTextInactive = 'text-gray-500 dark:text-gray-400';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 shadow-2xl max-w-5xl w-full h-screen max-h-[80vh] overflow-hidden flex flex-col relative bg-gray-50 dark:bg-gray-900">
        {/* Botão de fechar no canto superior direito */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-300 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900 dark:hover:text-red-400 transition-colors shadow focus:outline-none"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="p-0 flex rounded-lg flex-row h-full">
          {/* Stepper vertical */}
          <div className="w-56 bg-gray-50 dark:bg-gray-900 border-r border-gray-700 flex flex-col py-4 px-4">
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1">Etapas do cadastro</h3>
            <p className="text-xs text-gray-500 mb-5">Navegue entre as etapas do cadastro</p>
            <ol className="space-y-2 relative">
              {steps.map((step, idx) => (
                <li key={step.key} className="flex items-start group">
                  <div className="flex flex-col items-center mr-3">
                    <span className={`flex text-gray-600 items-center justify-center w-6 h-6 rounded-full border text-xs font-bold transition-colors duration-200
                      ${tab === step.key ? stepperActiveColor : stepperInactiveColor}
                    `}>
                      {idx + 1}
                    </span>
                    {idx < steps.length - 1 && (
                      <span className="w-px flex-1 bg-gray-200 mx-auto" />
                    )}
                  </div>
                  <button
                    type="button"
                    className={`text-left py-1 focus:outline-none transition-colors duration-200 text-xs
                      ${tab === step.key ? stepperTextActive + ' font-semibold' : stepperTextInactive + ' hover:text-green-600'}
                    `}
                    onClick={() => setTab(step.key as typeof tab)}
                  >
                    {step.label}
                    {step.optional && <span className="ml-1 text-xs text-gray-400 font-normal">(opcional)</span>}
                  </button>
                </li>
              ))}
            </ol>
          </div>
          {/* Conteúdo do formulário */}
          <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900 pt-12">
            <div className="p-4 flex items-center justify-between border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-0">Incluir produto</h2>
              <span className="text-xs text-red-500 whitespace-nowrap">(*) Campos obrigatórios</span>
            </div>
            <form className="flex-1 overflow-y-auto px-4 py-4" onSubmit={e => { e.preventDefault(); onSave(form); }}>
              {tab === 'dados' && (
                <div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Nome <span className="text-red-500">*</span>
                      </label>
                      <Input value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} required className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 px-3 py-1.5 text-xs rounded-md focus:border-green-600 focus:ring-green-600" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Código (SKU)
                      </label>
                      <Input value={form.codigo} onChange={e => setForm(f => ({ ...f, codigo: e.target.value }))} className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 px-3 py-1.5 text-xs rounded-md focus:border-green-600 focus:ring-green-600" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                       Valor de venda 
                      </label>
                      <Input type="number" value={form.valor} onChange={e => setForm(f => ({ ...f, valor: e.target.value }))} className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 px-3 py-1.5 text-xs rounded-md focus:border-green-600 focus:ring-green-600" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 whitespace-nowrap">Valor Promocional</label>
                      <Input type="number" value={form.valorPromocional} onChange={e => setForm(f => ({ ...f, valorPromocional: e.target.value }))} className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 px-3 py-1.5 text-xs rounded-md focus:border-green-600 focus:ring-green-600" />
                    </div>
                  </div>
                </div>
              )}
              {tab === 'caracteristicas' && (
                <div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Peso</label>
                      <Input type="number" value={form.peso} onChange={e => setForm(f => ({ ...f, peso: e.target.value }))} className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 px-3 py-1.5 text-xs rounded-md focus:border-green-600 focus:ring-green-600" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Comprimento</label>
                      <Input type="number" value={form.comprimento} onChange={e => setForm(f => ({ ...f, comprimento: e.target.value }))} className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 px-3 py-1.5 text-xs rounded-md focus:border-green-600 focus:ring-green-600" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Largura</label>
                      <Input type="number" value={form.largura} onChange={e => setForm(f => ({ ...f, largura: e.target.value }))} className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 px-3 py-1.5 text-xs rounded-md focus:border-green-600 focus:ring-green-600" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Altura</label>
                      <Input type="number" value={form.altura} onChange={e => setForm(f => ({ ...f, altura: e.target.value }))} className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 px-3 py-1.5 text-xs rounded-md focus:border-green-600 focus:ring-green-600" />
                    </div>
                    <div className="sm:col-span-2 lg:col-span-1">
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 whitespace-nowrap">Quantidade / Unidade</label>
                      <Input type="number" value={form.quantidadeUnidade} onChange={e => setForm(f => ({ ...f, quantidadeUnidade: e.target.value }))} className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 px-3 py-1.5 text-xs rounded-md focus:border-green-600 focus:ring-green-600" />
                    </div>
                  </div>
                </div>
              )}
              {/* Futuras etapas podem ser adicionadas aqui */}
              <div className="flex justify-between items-center bg-transparent p-0 mt-6">
                <Button type="button" onClick={onClose} className="border border-red-600 bg-red-600 text-white hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 px-6 py-1.5 rounded-md text-xs font-semibold">Cancelar</Button>
                <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-6 py-1.5 rounded-md text-xs font-semibold">Avançar</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
