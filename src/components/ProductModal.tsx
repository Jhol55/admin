import React, { useState } from 'react';
import { Input, Button } from '@/components';
import Image from 'next/image';

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
  pesoMin?: string;
  pesoMax?: string;
  imagemCardapio?: File | null;
  imagemTabelaNutricional?: File | null;
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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  if (!isOpen) return null;

  const steps = [
    { key: 'dados', label: 'Dados básicos', optional: false },
    { key: 'caracteristicas', label: 'Características', optional: true },
    { key: 'imagens', label: 'Imagens', optional: true },
    { key: 'estoque', label: 'Estoque', optional: true },
    { key: 'tributacao', label: 'Tributação', optional: true },
    { key: 'variacoes', label: 'Variações', optional: true },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="rounded-[var(--card-radius)] border border-[var(--card-border)] shadow-[var(--card-shadow)] max-w-5xl w-full h-screen max-h-[80vh] overflow-hidden flex flex-col relative bg-[var(--card-bg)]">
        {/* Botão de fechar no canto superior direito */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-red-100 hover:text-red-600 transition-colors shadow focus:outline-none"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="p-0 flex rounded-[var(--card-radius)] flex-row h-full">
          {/* Stepper vertical */}
          <div className="w-56 bg-[var(--sidebar-bg)] border-r border-[var(--sidebar-border)] flex flex-col py-4 px-4">
            <h3 className="text-base font-semibold text-[var(--foreground)] mb-1">Etapas do cadastro</h3>
            <p className="text-xs text-[var(--muted)] mb-5">Navegue entre as etapas do cadastro</p>
            <ol className="space-y-2 relative">
              {steps.map((step, idx) => (
                <li key={step.key} className="flex items-start group">
                  <div className="flex flex-col items-center mr-3">
                    <span className={`flex items-center justify-center w-6 h-6 rounded-full border text-xs font-bold transition-colors duration-200
                      ${tab === step.key ? 'bg-[var(--primary)] border-[var(--primary)] text-white' : 'bg-gray-100 border-gray-300 text-gray-400'}
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
                      ${tab === step.key ? 'text-[var(--primary)] font-semibold' : 'text-gray-500 hover:text-[var(--primary)]'}
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
          <div className="flex-1 flex flex-col bg-[var(--card-bg)] pt-12">
            <div className="p-4 flex items-center justify-between border-b border-[var(--card-border)]">
              <h2 className="text-lg font-bold text-[var(--foreground)] mb-0">Incluir produto</h2>
              <span className="text-xs text-red-500 whitespace-nowrap">(*) Campos obrigatórios</span>
            </div>
            <form className="flex-1 overflow-y-auto px-4 py-4" onSubmit={e => { e.preventDefault(); onSave(form); }}>
              {tab === 'dados' && (
                <div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-xs font-medium text-[var(--foreground)] mb-1">
                        Nome <span className="text-red-500">*</span>
                      </label>
                      <Input value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} required className="bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--foreground)] placeholder-gray-400 px-3 py-1.5 text-xs rounded-md focus:border-[var(--primary)] focus:ring-[var(--primary)]" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[var(--foreground)] mb-1">
                        Código (SKU)
                      </label>
                      <Input value={form.codigo} onChange={e => setForm(f => ({ ...f, codigo: e.target.value }))} className="bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--foreground)] placeholder-gray-400 px-3 py-1.5 text-xs rounded-md focus:border-[var(--primary)] focus:ring-[var(--primary)]" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[var(--foreground)] mb-1">
                       Valor de venda 
                      </label>
                      <Input type="number" value={form.valor} onChange={e => setForm(f => ({ ...f, valor: e.target.value }))} className="bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--foreground)] placeholder-gray-400 px-3 py-1.5 text-xs rounded-md focus:border-[var(--primary)] focus:ring-[var(--primary)]" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[var(--foreground)] mb-1 whitespace-nowrap">Valor Promocional</label>
                      <Input type="number" value={form.valorPromocional} onChange={e => setForm(f => ({ ...f, valorPromocional: e.target.value }))} className="bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--foreground)] placeholder-gray-400 px-3 py-1.5 text-xs rounded-md focus:border-[var(--primary)] focus:ring-[var(--primary)]" />
                    </div>
                  </div>
                </div>
              )}
              {tab === 'caracteristicas' && (
                <div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    <div className="col-span-1">
                      <label className="block text-xs font-medium text-[var(--foreground)] mb-1">Peso mínimo (g) / unidade</label>
                      <Input type="number" value={form.pesoMin || ''} onChange={e => setForm(f => ({ ...f, pesoMin: e.target.value }))} className="bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--foreground)] placeholder-gray-400 px-3 py-1.5 text-xs rounded-md focus:border-[var(--primary)] focus:ring-[var(--primary)]" />
                    </div>
                    <div className="col-span-1">
                      <label className="block text-xs font-medium text-[var(--foreground)] mb-1">Peso máximo (g) / unidade</label>
                      <Input type="number" value={form.pesoMax || ''} onChange={e => setForm(f => ({ ...f, pesoMax: e.target.value }))} className="bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--foreground)] placeholder-gray-400 px-3 py-1.5 text-xs rounded-md focus:border-[var(--primary)] focus:ring-[var(--primary)]" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[var(--foreground)] mb-1">Comprimento</label>
                      <Input type="number" value={form.comprimento} onChange={e => setForm(f => ({ ...f, comprimento: e.target.value }))} className="bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--foreground)] placeholder-gray-400 px-3 py-1.5 text-xs rounded-md focus:border-[var(--primary)] focus:ring-[var(--primary)]" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[var(--foreground)] mb-1">Largura</label>
                      <Input type="number" value={form.largura} onChange={e => setForm(f => ({ ...f, largura: e.target.value }))} className="bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--foreground)] placeholder-gray-400 px-3 py-1.5 text-xs rounded-md focus:border-[var(--primary)] focus:ring-[var(--primary)]" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[var(--foreground)] mb-1">Altura</label>
                      <Input type="number" value={form.altura} onChange={e => setForm(f => ({ ...f, altura: e.target.value }))} className="bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--foreground)] placeholder-gray-400 px-3 py-1.5 text-xs rounded-md focus:border-[var(--primary)] focus:ring-[var(--primary)]" />
                    </div>
                    <div className="sm:col-span-2 lg:col-span-1">
                      <label className="block text-xs font-medium text-[var(--foreground)] mb-1 whitespace-nowrap">Quantidade / unidade</label>
                      <Input type="number" value={form.quantidadeUnidade} onChange={e => setForm(f => ({ ...f, quantidadeUnidade: e.target.value }))} className="bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--foreground)] placeholder-gray-400 px-3 py-1.5 text-xs rounded-md focus:border-[var(--primary)] focus:ring-[var(--primary)]" />
                    </div>
                  </div>
                </div>
              )}
              {tab === 'imagens' && (
                <div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div className="flex flex-col gap-1">
                      <label className="block text-xs font-medium text-[var(--foreground)] mb-0">Imagem do cardápio</label>
                      <div className="relative flex items-center gap-3">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={e => {
                            const file = e.target.files?.[0] || null;
                            setForm(f => ({ ...f, imagemCardapio: file }));
                          }}
                          className="block w-full text-xs text-gray-700 border border-[var(--input-border)] rounded-md bg-[var(--input-bg)] file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:bg-[var(--primary)] file:hover:bg-[var(--primary-hover)] file:text-white cursor-pointer"
                        />
                        {form.imagemCardapio ? (
                          <>
                            <Image
                              src={form.imagemCardapio ? URL.createObjectURL(form.imagemCardapio as File) : ''}
                              alt="Preview imagem cardápio"
                              width={64}
                              height={64}
                              className="w-16 h-16 absolute right-0 object-cover rounded-lg border border-[var(--input-border)] shadow-md bg-gray-100 transition-transform duration-200 hover:scale-110 cursor-pointer"
                              onClick={() => form.imagemCardapio && setPreviewUrl(URL.createObjectURL(form.imagemCardapio as File))}
                            />
                            <div className="ml-2 w-16 rounded-lg" />
                          </>
                        ) : (
                          <div className="w-16 rounded-lg" />
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="block text-xs font-medium text-[var(--foreground)] mb-0">Imagem da tabela nutricional</label>
                      <div className="relative flex items-center gap-3">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={e => {
                            const file = e.target.files?.[0] || null;
                            setForm(f => ({ ...f, imagemTabelaNutricional: file }));
                          }}
                          className="block w-full text-xs text-gray-700 border border-[var(--input-border)] rounded-md bg-[var(--input-bg)] file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:bg-[var(--primary)] file:hover:bg-[var(--primary-hover)] file:text-white cursor-pointer"
                        />
                        {form.imagemTabelaNutricional ? (
                          <>
                            <Image
                              src={form.imagemTabelaNutricional ? URL.createObjectURL(form.imagemTabelaNutricional as File) : ''}
                              alt="Preview tabela nutricional"
                              width={64}
                              height={64}
                              className="w-16 h-16 absolute right-0 object-cover rounded-lg border border-[var(--input-border)] shadow-md bg-gray-100 transition-transform duration-200 hover:scale-110 cursor-pointer"
                              onClick={() => form.imagemTabelaNutricional && setPreviewUrl(URL.createObjectURL(form.imagemTabelaNutricional as File))}
                            />
                            <div className="ml-2 w-16 rounded-lg" />
                          </>
                        ) : (
                          <div className="w-16 rounded-lg" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {/* Futuras etapas podem ser adicionadas aqui */}
              <div className="flex justify-between items-center bg-transparent p-0 mt-10">
                <Button type="button" variant="danger" onClick={onClose} className="px-6 py-1.5 rounded-md text-xs font-semibold">Cancelar</Button>
                <Button type="submit" className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white px-6 py-1.5 rounded-md text-xs font-semibold">Avançar</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* Modal de preview da imagem */}
      {previewUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70" onClick={() => setPreviewUrl(null)}>
          <div className="relative w-full max-w-2xl max-h-[80vh] flex items-center justify-center">
            <Image src={previewUrl} alt="Preview grande" width={600} height={600} style={{objectFit: 'contain', width: '100%', height: 'auto', maxHeight: '80vh'}} className="rounded-lg shadow-2xl border-4 border-white" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductModal;
