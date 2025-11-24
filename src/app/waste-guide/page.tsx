'use client';

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faRecycle, 
  faSearch, 
  faTrash,
  faBoxOpen,
  faWineBottle,
  faAppleAlt,
  faMobileAlt,
  faLeaf
} from '@fortawesome/free-solid-svg-icons';

// Categorie rifiuti con colori e info
const wasteCategories = [
  {
    id: 'plastic',
    name: 'Plastica',
    icon: faBoxOpen,
    color: 'yellow',
    bgColor: 'bg-yellow-500',
    lightBg: 'bg-yellow-50',
    borderColor: 'border-yellow-500',
    textColor: 'text-yellow-600',
    description: 'Imballaggi in plastica e materiali plastici',
    examples: [
      'Bottiglie di plastica',
      'Flaconi di detersivi',
      'Vaschette alimentari',
      'Sacchetti in plastica',
      'Pellicole trasparenti',
    ],
    notAllowed: [
      'Giocattoli in plastica',
      'CD e DVD',
      'Posate e piatti usa e getta',
      'Oggetti in gomma',
    ],
  },
  {
    id: 'paper',
    name: 'Carta e Cartone',
    icon: faBoxOpen,
    color: 'blue',
    bgColor: 'bg-blue-500',
    lightBg: 'bg-blue-50',
    borderColor: 'border-blue-500',
    textColor: 'text-blue-600',
    description: 'Carta, cartone e imballaggi di carta',
    examples: [
      'Giornali e riviste',
      'Scatole di cartone',
      'Quaderni e libri',
      'Sacchetti di carta',
      'Cartoni della pizza (puliti)',
    ],
    notAllowed: [
      'Carta sporca o unta',
      'Scontrini termici',
      'Carta plastificata',
      'Fazzoletti usati',
    ],
  },
  {
    id: 'glass',
    name: 'Vetro',
    icon: faWineBottle,
    color: 'green',
    bgColor: 'bg-green-600',
    lightBg: 'bg-green-50',
    borderColor: 'border-green-600',
    textColor: 'text-green-700',
    description: 'Contenitori in vetro e cristallo',
    examples: [
      'Bottiglie di vetro',
      'Barattoli di vetro',
      'Bicchieri di vetro',
      'Vasetti per conserve',
    ],
    notAllowed: [
      'Specchi',
      'Lampadine',
      'Ceramica e porcellana',
      'Vetri di finestre',
      'Cristallo',
    ],
  },
  {
    id: 'organic',
    name: 'Organico',
    icon: faAppleAlt,
    color: 'brown',
    bgColor: 'bg-amber-700',
    lightBg: 'bg-amber-50',
    borderColor: 'border-amber-700',
    textColor: 'text-amber-800',
    description: 'Rifiuti organici e biodegradabili',
    examples: [
      'Scarti di frutta e verdura',
      'Fondi di caffè',
      'Gusci d\'uovo',
      'Fiori e piante',
      'Tovaglioli di carta sporchi',
      'Scarti di cibo',
    ],
    notAllowed: [
      'Ossa grandi',
      'Lettiere animali',
      'Cenere di carbone',
      'Gomme da masticare',
    ],
  },
  {
    id: 'unsorted',
    name: 'Indifferenziato',
    icon: faTrash,
    color: 'gray',
    bgColor: 'bg-stone-600',
    lightBg: 'bg-stone-50',
    borderColor: 'border-stone-600',
    textColor: 'text-stone-700',
    description: 'Rifiuti non riciclabili',
    examples: [
      'Pannolini e assorbenti',
      'Polvere e cenere',
      'Gomme da masticare',
      'Mozziconi di sigaretta',
      'Carta sporca',
    ],
    notAllowed: [
      'Pile e batterie',
      'Farmaci scaduti',
      'Materiali riciclabili',
      'RAEE',
    ],
  },
  {
    id: 'electronics',
    name: 'RAEE (Elettronici)',
    icon: faMobileAlt,
    color: 'red',
    bgColor: 'bg-red-500',
    lightBg: 'bg-red-50',
    borderColor: 'border-red-500',
    textColor: 'text-red-600',
    description: 'Rifiuti da Apparecchiature Elettriche ed Elettroniche',
    examples: [
      'Smartphone e tablet',
      'Computer e laptop',
      'TV e monitor',
      'Elettrodomestici',
      'Lampadine a LED',
      'Caricabatterie',
    ],
    notAllowed: [
      'Batterie (vanno separate)',
      'Toner stampanti',
    ],
  },
];

const WasteGuidePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Filtra categorie per ricerca
  const filteredCategories = wasteCategories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.examples.some(ex => ex.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const selectedCategoryData = wasteCategories.find(c => c.id === selectedCategory);

  return (
    <div className="min-h-screen pt-28 pb-10 px-5 sm:px-10 md:px-15 lg:px-20">
      {/* Header */}
      <div className="mb-10 text-center">
        <div className="inline-block bg-emerald-500 p-4 rounded-full mb-4">
          <FontAwesomeIcon icon={faRecycle} className="text-5xl text-white" />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-3">
          Guida alla <span className="text-emerald-500">Raccolta Differenziata</span>
        </h1>
        <p className="text-xl text-stone-600 max-w-3xl mx-auto">
          Impara a differenziare correttamente e contribuisci alla salvaguardia dell'ambiente
        </p>
      </div>

      {/* Barra di Ricerca */}
      <div className="max-w-2xl mx-auto mb-12">
        <div className="relative">
          <FontAwesomeIcon 
            icon={faSearch} 
            className="absolute left-5 top-1/2 transform -translate-y-1/2 text-stone-400 text-xl"
          />
          <input
            type="text"
            placeholder="Cerca un tipo di rifiuto... (es. bottiglia, carta, smartphone)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-6 py-4 rounded-3xl border-2 border-stone-300 
                     focus:border-emerald-500 focus:outline-none transition text-lg"
          />
        </div>
      </div>

      {/* Grid Categorie */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {filteredCategories.map((category) => (
          <div
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`${category.lightBg} border-4 ${category.borderColor} rounded-3xl p-6 
                       cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl
                       ${selectedCategory === category.id ? 'ring-4 ring-emerald-500 scale-105' : ''}`}
          >
            {/* Icon e Titolo */}
            <div className="flex items-center gap-4 mb-4">
              <div className={`${category.bgColor} p-4 rounded-full`}>
                <FontAwesomeIcon icon={category.icon} className="text-3xl text-white" />
              </div>
              <h2 className="text-2xl font-bold text-stone-900">{category.name}</h2>
            </div>

            {/* Descrizione */}
            <p className="text-stone-600 mb-4">{category.description}</p>

            {/* Badge esempi */}
            <div className="flex flex-wrap gap-2">
              {category.examples.slice(0, 3).map((example, idx) => (
                <span
                  key={idx}
                  className={`text-xs px-3 py-1 rounded-full ${category.bgColor} text-white`}
                >
                  {example}
                </span>
              ))}
              {category.examples.length > 3 && (
                <span className="text-xs px-3 py-1 rounded-full bg-stone-200 text-stone-700">
                  +{category.examples.length - 3} altri
                </span>
              )}
            </div>

            {/* CTA */}
            <button className={`mt-4 w-full py-2 rounded-2xl ${category.bgColor} text-white font-semibold
                              hover:opacity-90 transition`}>
              Scopri di più
            </button>
          </div>
        ))}
      </div>

      {/* Dettaglio Categoria Selezionata */}
      {selectedCategoryData && (
        <div className="max-w-4xl mx-auto bg-stone-100 rounded-3xl p-8 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className={`${selectedCategoryData.bgColor} p-4 rounded-full`}>
                <FontAwesomeIcon icon={selectedCategoryData.icon} className="text-4xl text-white" />
              </div>
              <h2 className="text-3xl font-bold">{selectedCategoryData.name}</h2>
            </div>
            <button
              onClick={() => setSelectedCategory(null)}
              className="px-6 py-2 bg-stone-300 rounded-2xl hover:bg-stone-400 transition font-semibold"
            >
              Chiudi
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Cosa SI può buttare */}
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-2xl">✅</span> Cosa SI può buttare
              </h3>
              <ul className="space-y-2">
                {selectedCategoryData.examples.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-white p-3 rounded-2xl">
                    <FontAwesomeIcon icon={faLeaf} className={`${selectedCategoryData.textColor} mt-1`} />
                    <span className="text-stone-900">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Cosa NON si può buttare */}
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-2xl">❌</span> Cosa NON si può buttare
              </h3>
              <ul className="space-y-2">
                {selectedCategoryData.notAllowed.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-white p-3 rounded-2xl">
                    <span className="text-red-500 text-xl mt-1">⊗</span>
                    <span className="text-stone-900">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Suggerimento */}
          <div className="mt-6 bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-4">
            <p className="text-emerald-900">
              <strong>💡 Suggerimento:</strong> In caso di dubbio, consulta sempre le linee guida del tuo comune 
              o porta il rifiuto in una stazione ecologica.
            </p>
          </div>
        </div>
      )}

      {/* Footer info */}
      <div className="mt-16 text-center max-w-3xl mx-auto">
        <div className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-3xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-3">🌍 Perché differenziare?</h3>
          <p className="text-lg mb-4">
            La raccolta differenziata riduce l'inquinamento, risparmia risorse naturali e protegge il nostro pianeta per le generazioni future.
          </p>
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div>
              <div className="text-4xl font-bold">80%</div>
              <div className="text-sm opacity-90">Rifiuti riciclabili</div>
            </div>
            <div>
              <div className="text-4xl font-bold">-50%</div>
              <div className="text-sm opacity-90">Emissioni CO₂</div>
            </div>
            <div>
              <div className="text-4xl font-bold">100%</div>
              <div className="text-sm opacity-90">Meglio per tutti</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WasteGuidePage;