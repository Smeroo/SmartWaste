'use client';

import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMapMarkerAlt,
  faClock,
  faRecycle,
  faSearch,
  faFilter,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

interface Address {
  street: string;
  number?: string;
  city: string;
  zip: string;
  latitude: number;
  longitude: number;
}

interface WasteType {
  id: number;
  name: string;
  color: string;
  icon: string;
}

interface Schedule {
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
  openingTime?: string;
  closingTime?: string;
  isAlwaysOpen: boolean;
}

interface CollectionPoint {
  id: number;
  name: string;
  description?: string;
  address: Address;
  wasteTypes: WasteType[];
  schedule?: Schedule;
  accessibility: string;
  isActive: boolean;
}

const CollectionPointsPage = () => {
  const [collectionPoints, setCollectionPoints] = useState<CollectionPoint[]>([]);
  const [filteredPoints, setFilteredPoints] = useState<CollectionPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWasteType, setSelectedWasteType] = useState<string>('all');

  // Recupera punti di raccolta
  useEffect(() => {
    const fetchCollectionPoints = async () => {
      try {
        const response = await fetch('/api/collection-points');
        const data = await response.json();
        setCollectionPoints(data);
        setFilteredPoints(data);
      } catch (error) {
        console.error('Error fetching collection points:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollectionPoints();
  }, []);

  // Filtra punti di raccolta
  useEffect(() => {
    let filtered = collectionPoints;

    // Filtra per query di ricerca
    if (searchQuery) {
      filtered = filtered.filter(point =>
        point.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        point.address.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        point.address.street.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filtra per tipo di rifiuto
    if (selectedWasteType !== 'all') {
      filtered = filtered.filter(point =>
        point.wasteTypes.some(type => {
          const upperName = type.name.toUpperCase();
          const upperFilter = selectedWasteType.toUpperCase();

          if (upperFilter === 'PLASTICA') return upperName.includes('PLASTIC') || upperName.includes('PLASTICA');
          if (upperFilter === 'CARTA') return upperName.includes('PAPER') || upperName.includes('CARTA');
          if (upperFilter === 'VETRO') return upperName.includes('GLASS') || upperName.includes('VETRO');
          if (upperFilter === 'ORGANICO') return upperName.includes('ORGANIC') || upperName.includes('ORGANICO');
          if (upperFilter === 'METALLO') return upperName.includes('METAL') || upperName.includes('METALLO');
          if (upperFilter === 'RAEE') return upperName.includes('ELECTRON') || upperName.includes('RAEE');

          return false;
        })
      );
    }

    setFilteredPoints(filtered);
  }, [searchQuery, selectedWasteType, collectionPoints]);

  // Ottieni colore tipo rifiuto e traduci in Italiano
  const getWasteTypeColor = (name: string) => {
    const upperName = name.toUpperCase().trim();

    // Plastica
    if (upperName.includes('PLASTIC') || upperName.includes('PLASTICA')) {
      return 'bg-yellow-100 text-yellow-700 border-2 border-yellow-400';
    }
    // Carta
    if (upperName.includes('PAPER') || upperName.includes('CARTA') || upperName.includes('CARDBOARD')) {
      return 'bg-blue-100 text-blue-700 border-2 border-blue-400';
    }
    // Vetro
    if (upperName.includes('GLASS') || upperName.includes('VETRO')) {
      return 'bg-green-100 text-green-700 border-2 border-green-500';
    }
    // Metallo
    if (upperName.includes('METAL') || upperName.includes('METALLO') || upperName.includes('ALLUMINIO') || upperName.includes('ALUMINUM')) {
      return 'bg-stone-100 text-stone-700 border-2 border-stone-400';
    }
    // Organico
    if (upperName.includes('ORGANIC') || upperName.includes('ORGANICO') || upperName.includes('BIO')) {
      return 'bg-amber-100 text-amber-800 border-2 border-amber-500';
    }
    // Elettronica / RAEE
    if (upperName.includes('ELECTRON') || upperName.includes('RAEE') || upperName.includes('WEEE')) {
      return 'bg-red-100 text-red-700 border-2 border-red-400';
    }
    // Indifferenziato
    if (upperName.includes('UNSORTED') || upperName.includes('INDIFFERENZIATO') || upperName.includes('RESIDUAL')) {
      return 'bg-stone-200 text-stone-700 border-2 border-stone-400';
    }

    // Default (grigio)
    return 'bg-gray-100 text-gray-700 border-2 border-gray-300';
  };

  // Traduci nome tipo rifiuto in Italiano
  const translateWasteType = (name: string) => {
    const upperName = name.toUpperCase().trim();

    if (upperName.includes('PLASTIC') || upperName.includes('PLASTICA')) return 'Plastica';
    if (upperName.includes('PAPER') || upperName.includes('CARTA')) return 'Carta';
    if (upperName.includes('GLASS') || upperName.includes('VETRO')) return 'Vetro';
    if (upperName.includes('METAL') || upperName.includes('METALLO')) return 'Metallo';
    if (upperName.includes('ORGANIC') || upperName.includes('ORGANICO')) return 'Organico';
    if (upperName.includes('ELECTRON') || upperName.includes('RAEE')) return 'RAEE';
    if (upperName.includes('UNSORTED') || upperName.includes('INDIFFERENZIATO')) return 'Indifferenziato';

    return name; // Ritorna il nome originale se non trova corrispondenza
  };

  // Formatta orario
  const formatSchedule = (schedule?: Schedule) => {
    if (!schedule) return 'Orari non disponibili';
    if (schedule.isAlwaysOpen) return 'Sempre aperto';

    const days = [];
    if (schedule.monday) days.push('Lun');
    if (schedule.tuesday) days.push('Mar');
    if (schedule.wednesday) days.push('Mer');
    if (schedule.thursday) days.push('Gio');
    if (schedule.friday) days.push('Ven');
    if (schedule.saturday) days.push('Sab');
    if (schedule.sunday) days.push('Dom');

    const timeRange = schedule.openingTime && schedule.closingTime
      ? ` ${schedule.openingTime} - ${schedule.closingTime}`
      : '';

    return days.length > 0 ? `${days.join(', ')}${timeRange}` : 'Chiuso';
  };

  return (
    <div className="min-h-screen pt-28 pb-10 px-5 sm:px-10 md:px-15 lg:px-20">
      {/* Intestazione */}
      <div className="mb-10">
        <h1 className="text-4xl md:text-6xl font-bold mb-5">
          Punti di <span className="text-emerald-500">Raccolta</span>
        </h1>
        <p className="text-xl text-stone-600">
          Trova il punto di raccolta differenziata più vicino a te
        </p>
      </div>

      {/* Ricerca e Filtri */}
      <div className="bg-stone-100 p-5 rounded-3xl mb-10 shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Barra di Ricerca */}
          <div className="relative">
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400"
            />
            <input
              type="text"
              id="search-collection-points"
              name="search"
              placeholder="Cerca per città, via o nome..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-stone-300 
                       focus:border-emerald-500 focus:outline-none transition"
            />
          </div>

          {/* Filtro Tipo Rifiuto */}
          <div className="relative">
            <FontAwesomeIcon
              icon={faFilter}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400"
            />
            <select
              id="waste-type-filter"
              name="waste-type"
              value={selectedWasteType}
              onChange={(e) => setSelectedWasteType(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-stone-300 
                       focus:border-emerald-500 focus:outline-none transition appearance-none cursor-pointer"
            >
              <option value="all">Tutti i tipi di rifiuto</option>
              <option value="plastica">Plastica</option>
              <option value="carta">Carta</option>
              <option value="vetro">Vetro</option>
              <option value="organico">Organico</option>
              <option value="metallo">Metallo</option>
              <option value="raee">RAEE</option>
            </select>
          </div>
        </div>
      </div>

      {/* Conteggio Risultati */}
      <div className="mb-5 text-stone-600">
        {loading ? (
          <p>Caricamento...</p>
        ) : (
          <p>
            <span className="font-bold text-emerald-600">{filteredPoints.length}</span> {filteredPoints.length === 1 ? 'punto trovato' : 'punti trovati'}
          </p>
        )}
      </div>

      {/* Griglia Punti di Raccolta */}
      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-emerald-500"></div>
          <p className="mt-5 text-xl text-stone-600">Caricamento punti di raccolta...</p>
        </div>
      ) : filteredPoints.length === 0 ? (
        <div className="text-center py-20">
          <FontAwesomeIcon icon={faRecycle} className="text-8xl text-stone-300 mb-5" />
          <p className="text-2xl text-stone-600">Nessun punto di raccolta trovato</p>
          <p className="text-stone-500 mt-2">Prova a modificare i filtri di ricerca</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPoints.map((point) => (
            <div
              key={point.id}
              className="bg-stone-100 rounded-3xl p-6 shadow-md hover:shadow-xl 
                       transition-all duration-300 hover:-translate-y-2 group"
            >
              {/* Nome Punto */}
              <h3 className="text-2xl font-bold mb-3 group-hover:text-emerald-500 transition">
                {point.name}
              </h3>

              {/* Indirizzo */}
              <div className="flex items-start gap-3 mb-3 text-stone-600">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="mt-1 text-emerald-500" />
                <div>
                  <p>{point.address.street} {point.address.number}</p>
                  <p>{point.address.zip} {point.address.city}</p>
                </div>
              </div>

              {/* Orario */}
              <div className="flex items-center gap-3 mb-4 text-stone-600">
                <FontAwesomeIcon icon={faClock} className="text-emerald-500" />
                <p className="text-sm">{formatSchedule(point.schedule)}</p>
              </div>

              {/* Tipi di Rifiuto */}
              <div className="mb-4">
                <p className="text-sm font-semibold text-stone-700 mb-2">Rifiuti accettati:</p>
                <div className="flex flex-wrap gap-2">
                  {point.wasteTypes.map((type) => (
                    <span
                      key={type.id}
                      className={`${getWasteTypeColor(type.name)} px-3 py-1.5 rounded-full 
                               text-xs font-bold shadow-sm`}
                    >
                      {translateWasteType(type.name)}
                    </span>
                  ))}
                </div>
              </div>

              {/* Accessibilità */}
              {point.accessibility && (
                <p className="text-sm text-stone-600 mb-4">
                  ♿ {point.accessibility}
                </p>
              )}

              {/* Pulsante Vedi Dettagli */}
              <Link
                href={`/collection-points/${point.id}`}
                className="flex items-center justify-between w-full px-4 py-3 
                         bg-emerald-500 text-stone-100 rounded-2xl font-semibold
                         hover:bg-emerald-600 transition-all duration-300
                         group-hover:scale-105"
              >
                <span>Dettagli</span>
                <FontAwesomeIcon icon={faChevronRight} />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CollectionPointsPage;