import React, { useState } from 'react';
import { Beaker, Search, ShieldAlert, Check, ShoppingBag, ExternalLink, ArrowRight, Sparkles } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { FEATURED_COMPOUNDS, searchPubChemCompound } from '../services/pubchemService';
import { CompoundDetail, Product } from '../types';

export const BioscienceExplorer: React.FC = () => {
  const { products, addToCart, setIsCartOpen, setSelectedCategory, setActiveTab } = useShop();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompound, setSelectedCompound] = useState<CompoundDetail>(FEATURED_COMPOUNDS[0]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [addedNotice, setAddedNotice] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setLoading(true);
    setErrorMsg('');
    try {
      const result = await searchPubChemCompound(searchQuery.trim());
      if (result) {
        setSelectedCompound(result);
      } else {
        setErrorMsg(`Compound "${searchQuery}" not found in NCBI PubChem index.`);
      }
    } catch (err) {
      setErrorMsg('Failed fetching compound data from PubChem API.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSelect = async (compound: CompoundDetail) => {
    setSelectedCompound(compound);
    setSearchQuery(compound.name);
    setErrorMsg('');
  };

  // Add compound directly as a certified lab reagent into customer cart
  const handleAddCompoundToCart = () => {
    const labProduct: Product = {
      id: `PUBCHEM-${selectedCompound.cid}`,
      name: `${selectedCompound.name} (Analytical Grade Reagent - 500g)`,
      price: selectedCompound.suggestedPricePkr || 1850,
      originalPrice: (selectedCompound.suggestedPricePkr || 1850) + 650,
      category: 'Bioscience & Lab Supplies',
      subcategory: 'Chemical Reagents',
      image: selectedCompound.imageUrl,
      stock: 40,
      rating: 4.9,
      reviewsCount: 38,
      brand: 'ChemPure Bioscience PK',
      sku: `CID-${selectedCompound.cid}`,
      description: `${selectedCompound.description} Formula: ${selectedCompound.molecularFormula}, MW: ${selectedCompound.molecularWeight}, IUPAC: ${selectedCompound.iupacName}.`,
      specifications: {
        'PubChem CID': selectedCompound.cid.toString(),
        'Formula': selectedCompound.molecularFormula,
        'Molecular Weight': selectedCompound.molecularWeight,
        'IUPAC Name': selectedCompound.iupacName,
        'Canonical SMILES': selectedCompound.canonicalSmiles,
        'Grade': 'Analytical Reagent (AR) 99%+'
      },
      isBioscience: true,
      pubchemCid: selectedCompound.cid,
      molecularFormula: selectedCompound.molecularFormula,
      isDarazMall: true,
      freeDelivery: (selectedCompound.suggestedPricePkr || 1850) >= 2500,
      sellerName: 'Pakistan Scientific Instruments & Chemical Corp'
    };

    addToCart(labProduct, 1);
    setAddedNotice(selectedCompound.name);
    setTimeout(() => setAddedNotice(null), 2500);
  };

  // Filter existing lab products from store
  const existingLabProducts = products.filter(p => p.isBioscience || p.category.includes('Bioscience'));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md border border-blue-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-300 mb-1">
            <Beaker className="w-4 h-4" /> NCBI PubChem & Bioscience Lab Hub
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Bioscience Lab Scout & Chemical Reagents
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 mt-1 max-w-xl">
            Live integration with NCBI PubChem database for biochemical reagents, molecular structures, and lab equipment across Pakistan.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setSelectedCategory('Bioscience & Lab Supplies');
              setActiveTab('shop');
            }}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
          >
            Browse All Lab Products ({existingLabProducts.length}) <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Example Chips (MANDATORY per Science Skill UI & Palette System) */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Quick-Try Research Reagents (Click to Inspect):
          </span>
          <span className="text-[11px] text-slate-400">Powered by NCBI PubChem REST API</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {FEATURED_COMPOUNDS.map((c) => (
            <button
              key={c.cid}
              onClick={() => handleQuickSelect(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedCompound.cid === c.cid
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700'
              }`}
            >
              <span>{c.name}</span>
              <span className="text-[10px] opacity-75 font-mono">({c.molecularFormula})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Search Input Bar */}
      <form onSubmit={handleSearch} className="flex gap-2 max-w-2xl">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search chemical name or formula in PubChem (e.g. Paracetamol, Ibuprofen, Salicylic Acid)..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-blue-600 shadow-2xs"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 disabled:opacity-50"
        >
          {loading ? 'Searching...' : 'Lookup PubChem'}
        </button>
      </form>

      {errorMsg && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
          {errorMsg}
        </div>
      )}

      {/* Main Split Scientific Workbench: 2D Depiction + Tabular Data */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 2D Structure & Purchase Card (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                2D Chemical Depiction
              </span>
              <span className="text-[11px] font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-bold">
                CID: {selectedCompound.cid}
              </span>
            </div>

            <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center aspect-square max-h-[300px] mx-auto overflow-hidden">
              <img
                src={selectedCompound.imageUrl}
                alt={selectedCompound.name}
                referrerPolicy="no-referrer"
                className="max-h-full max-w-full object-contain filter drop-shadow-sm"
              />
            </div>

            <div className="mt-4 text-center">
              <h3 className="text-lg font-bold text-slate-900">{selectedCompound.name}</h3>
              <p className="font-mono text-xs font-bold text-blue-600 mt-0.5">
                {selectedCompound.molecularFormula} · {selectedCompound.molecularWeight}
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-slate-500">Suggested Laboratory Price:</span>
              <span className="text-xl font-black text-[#f85606] tabular-nums">
                Rs. {(selectedCompound.suggestedPricePkr || 1850).toLocaleString()}
              </span>
            </div>

            <button
              onClick={handleAddCompoundToCart}
              className="w-full py-3 bg-[#f85606] hover:bg-[#e04d05] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              {addedNotice ? (
                <>
                  <Check className="w-4 h-4" /> Added to Daraz Cart!
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" /> Order Reagent (Cash on Delivery)
                </>
              )}
            </button>
            <p className="text-[10px] text-center text-slate-400">
              Dispatched with Certificate of Analysis (COA) to universities and clinics.
            </p>
          </div>
        </div>

        {/* Right Column: Tabular Specifications & Safety Data (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 shadow-2xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Scientific Specifications & Metadata
              </span>
              <a
                href={`https://pubchem.ncbi.nlm.nih.gov/compound/${selectedCompound.cid}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 font-semibold"
              >
                View on NCBI PubChem <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase mb-1">Functional Summary</h4>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                {selectedCompound.description}
              </p>
            </div>

            {/* Tabular Properties */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase">Chemical Properties</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">PubChem CID</span>
                  <span className="font-mono font-bold text-slate-800">{selectedCompound.cid}</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">Molecular Formula</span>
                  <span className="font-mono font-bold text-slate-800">{selectedCompound.molecularFormula}</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">Molecular Weight</span>
                  <span className="font-mono font-bold text-slate-800 tabular-nums">{selectedCompound.molecularWeight}</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">Purity Standard</span>
                  <span className="font-bold text-emerald-700">Analytical Reagent (AR) 99.5%</span>
                </div>
                <div className="sm:col-span-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">IUPAC Name</span>
                  <span className="font-mono text-[11px] text-slate-800 break-all">{selectedCompound.iupacName}</span>
                </div>
                <div className="sm:col-span-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">Canonical SMILES</span>
                  <span className="font-mono text-[11px] text-slate-700 break-all">{selectedCompound.canonicalSmiles}</span>
                </div>
              </div>
            </div>

            {/* GHS Safety Data */}
            <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200 text-xs">
              <div className="flex items-center gap-1.5 text-amber-900 font-bold mb-1">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                Laboratory Safety & Handling Protocol (GHS)
              </div>
              <p className="text-[11px] text-amber-950">
                {selectedCompound.safetySummary}
              </p>
            </div>
          </div>

          {/* Epistemic Provenance Badge */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>Provenance: [Literature Curated & NCBI PubChem Verified]</span>
            <span>Origin: ISO 9001 Certified Labs</span>
          </div>
        </div>
      </div>

      {/* Existing Lab Supplies In Daraz Store */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Featured Laboratory Apparatus & Diagnostic Kits on Daraz PK
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {existingLabProducts.map((p) => (
            <div
              key={p.id}
              className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between"
            >
              <div>
                <img
                  src={p.image}
                  alt={p.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-32 object-cover rounded-lg bg-white mb-2"
                />
                <h4 className="text-xs font-bold text-slate-900 line-clamp-2">{p.name}</h4>
                <span className="text-[10px] text-slate-500 block mt-1">{p.brand}</span>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between">
                <span className="font-bold text-xs text-[#f85606] tabular-nums">
                  Rs. {p.price.toLocaleString()}
                </span>
                <button
                  onClick={() => addToCart(p, 1)}
                  className="px-2.5 py-1 bg-[#f85606] hover:bg-[#e04d05] text-white text-[11px] font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
