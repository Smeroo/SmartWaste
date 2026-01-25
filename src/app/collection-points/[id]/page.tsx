'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faMapMarkerAlt,
    faClock,
    faArrowLeft,
    faSpinner,
    faRecycle,
    faPhone,
    faEnvelope,
    faInfoCircle,
    faExclamationTriangle,
    faEdit
} from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

// Riutilizza interfacce
interface Address {
    street: string;
    number?: string;
    city: string;
    zip: string;
    country?: string;
    latitude: number;
    longitude: number;
}

interface WasteType {
    id: number;
    name: string;
    color: string;
    icon: string;
    description?: string;
    disposalInfo?: string;
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
    notes?: string;
    isAlwaysOpen: boolean;
}

interface Operator {
    organizationName?: string;
    telephone?: string;
    website?: string;
    user: {
        name: string;
        email: string;
    }
}

interface CollectionPoint {
    id: number;
    name: string;
    description?: string;
    address: Address;
    wasteTypes: WasteType[];
    schedule?: Schedule;
    accessibility: string;
    capacity?: string;
    isActive: boolean;
    images?: string;
    operator?: Operator;
}

const CollectionPointDetailsPage = () => {
    const { id } = useParams();
    const router = useRouter();
    const { data: session } = useSession();
    const [point, setPoint] = useState<CollectionPoint | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchPoint = async () => {
            try {
                const response = await fetch(`/api/collection-points/${id}`);
                if (!response.ok) {
                    if (response.status === 404) throw new Error('Punto di raccolta non trovato');
                    throw new Error('Errore nel caricamento del punto di raccolta');
                }
                const data = await response.json();
                setPoint(data);
            } catch (err) {
                console.error(err);
                setError(err instanceof Error ? err.message : 'Errore sconosciuto');
            } finally {
                setLoading(false);
            }
        };

        fetchPoint();
    }, [id]);

    // Helper per i colori dei tipi di rifiuto
    const getWasteTypeColor = (name: string) => {
        const upperName = name.toUpperCase().trim();
        if (upperName.includes('PLASTIC') || upperName.includes('PLASTICA')) return 'bg-yellow-100 text-yellow-700 border-yellow-400';
        if (upperName.includes('PAPER') || upperName.includes('CARTA')) return 'bg-blue-100 text-blue-700 border-blue-400';
        if (upperName.includes('GLASS') || upperName.includes('VETRO')) return 'bg-green-100 text-green-700 border-green-500';
        if (upperName.includes('METAL') || upperName.includes('METALLO')) return 'bg-stone-100 text-stone-700 border-stone-400';
        if (upperName.includes('ORGANIC') || upperName.includes('ORGANICO')) return 'bg-amber-100 text-amber-800 border-amber-500';
        if (upperName.includes('ELECTRON') || upperName.includes('RAEE')) return 'bg-red-100 text-red-700 border-red-400';
        return 'bg-gray-100 text-gray-700 border-gray-300';
    };

    const translateWasteType = (name: string) => {
        const upperName = name.toUpperCase().trim();
        if (upperName.includes('PLASTIC') || upperName.includes('PLASTICA')) return 'Plastica';
        if (upperName.includes('PAPER') || upperName.includes('CARTA')) return 'Carta';
        if (upperName.includes('GLASS') || upperName.includes('VETRO')) return 'Vetro';
        if (upperName.includes('METAL') || upperName.includes('METALLO')) return 'Metallo';
        if (upperName.includes('ORGANIC') || upperName.includes('ORGANICO')) return 'Organico';
        if (upperName.includes('RAEE')) return 'RAEE';
        return name;
    };

    if (loading) return (
        <div className="h-screen flex justify-center items-center text-4xl text-emerald-500">
            <FontAwesomeIcon icon={faSpinner} spin />
        </div>
    );

    if (error || !point) return (
        <div className="h-screen flex flex-col justify-center items-center gap-5 px-5">
            <FontAwesomeIcon icon={faInfoCircle} className="text-6xl text-stone-300" />
            <h1 className="text-2xl font-bold text-stone-600">{error || 'Punto di raccolta non trovato'}</h1>
            <Link href="/collection-points" className="px-5 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition">
                Torna alla mappa
            </Link>
        </div>
    );

    const images = point.images ? JSON.parse(point.images as string) : [];
    const heroImage = images.length > 0 ? images[0] : '/placeholder-image.jpg';

    return (
        <div className="min-h-screen pb-20 bg-stone-50">

            <div className="relative h-60 md:h-80 lg:h-96 w-full">
                <div className="absolute inset-0 bg-stone-300">
                    {images.length > 0 ? (
                        <img src={heroImage} alt={point.name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center">
                            <FontAwesomeIcon icon={faRecycle} className="text-9xl text-white/20" />
                        </div>
                    )}
                </div>
                <div className="absolute inset-0 bg-black/30"></div>
                <Link
                    href="/collection-points"
                    className="absolute top-24 left-5 sm:left-10 bg-white/90 p-3 rounded-full hover:bg-white transition shadow-lg text-stone-900"
                >
                    <FontAwesomeIcon icon={faArrowLeft} />
                </Link>
                <div className="absolute bottom-5 left-5 sm:left-10 text-white">
                    <h1 className="text-3xl md:text-5xl font-bold mb-2">{point.name}</h1>
                    <p className="text-lg opacity-90">{point.address.city}, {point.address.country || 'Italia'}</p>
                </div>
            </div>

            <div className="px-5 sm:px-10 md:px-20 max-w-7xl mx-auto -mt-10 relative z-10">
                <div className="bg-white rounded-3xl shadow-xl p-6 md:p-10 flex flex-col gap-10">

                    {/* Griglia Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Colonna Sinistra: Descrizione e Tipi di Rifiuto */}
                        <div className="flex flex-col gap-8">
                            <div>
                                <h2 className="text-xl font-bold mb-3 text-stone-800">Descrizione</h2>
                                <p className="text-stone-600 leading-relaxed">
                                    {point.description || 'Nessuna descrizione disponibile.'}
                                </p>
                            </div>

                            <div>
                                <h2 className="text-xl font-bold mb-3 text-stone-800">Rifiuti Accettati</h2>
                                <div className="flex flex-wrap gap-3">
                                    {point.wasteTypes.map(type => (
                                        <div key={type.id} className={`border-2 rounded-xl p-3 flex items-center gap-3 ${getWasteTypeColor(type.name)} bg-opacity-50`}>
                                            <FontAwesomeIcon icon={faRecycle} />
                                            <div>
                                                <span className="font-bold block">{translateWasteType(type.name)}</span>
                                                {/* <span className="text-xs opacity-75">{type.description}</span> */}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {point.accessibility && (
                                <div>
                                    <h2 className="text-xl font-bold mb-3 text-stone-800">Accessibilità</h2>
                                    <p className="text-stone-600">♿ {point.accessibility}</p>
                                </div>
                            )}

                            {session?.user?.role === 'USER' && (
                                <div className="mt-4 pt-4 border-t border-stone-100">
                                    <button
                                        onClick={() => alert('Funzionalità di segnalazione in arrivo!')}
                                        className="flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-xl hover:bg-amber-200 transition font-medium text-sm"
                                    >
                                        <FontAwesomeIcon icon={faExclamationTriangle} />
                                        Segnala un problema
                                    </button>
                                </div>
                            )}

                            {session?.user?.role === 'OPERATOR' && (
                                <div className="mt-4 pt-4 border-t border-stone-100">
                                    <button
                                        onClick={() => alert('Funzionalità di modifica in arrivo!')}
                                        className="flex items-center gap-2 px-4 py-2 bg-sky-100 text-sky-700 rounded-xl hover:bg-sky-200 transition font-medium text-sm"
                                    >
                                        <FontAwesomeIcon icon={faEdit} />
                                        Modifica Informazioni
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Colonna Destra: Indirizzo, Orario, Operatore */}
                        <div className="flex flex-col gap-8">
                            <div className="bg-stone-50 p-6 rounded-2xl border border-stone-100">
                                <h2 className="text-xl font-bold mb-5 text-stone-800 flex items-center gap-2">
                                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-emerald-500" />
                                    Indirizzo
                                </h2>
                                <p className="text-lg text-stone-700">{point.address.street} {point.address.number}</p>
                                <p className="text-lg text-stone-700">{point.address.zip} {point.address.city} ({point.address.country || 'IT'})</p>

                                <a
                                    href={`https://www.google.com/maps/search/?api=1&query=${point.address.latitude},${point.address.longitude}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mt-4 inline-block text-emerald-600 font-bold hover:underline"
                                >
                                    Vedi su Google Maps &rarr;
                                </a>
                            </div>

                            <div className="bg-stone-50 p-6 rounded-2xl border border-stone-100">
                                <h2 className="text-xl font-bold mb-5 text-stone-800 flex items-center gap-2">
                                    <FontAwesomeIcon icon={faClock} className="text-emerald-500" />
                                    Orari
                                </h2>
                                {point.schedule ? (
                                    <div className="flex flex-col gap-2">
                                        {point.schedule.isAlwaysOpen ? (
                                            <p className="text-green-600 font-bold">Sempre Aperto (24/7)</p>
                                        ) : (
                                            <>
                                                {point.schedule.monday && <div className="flex justify-between"><span>Lunedì</span> <span>Aperto</span></div>}
                                                {point.schedule.tuesday && <div className="flex justify-between"><span>Martedì</span> <span>Aperto</span></div>}
                                                {point.schedule.wednesday && <div className="flex justify-between"><span>Mercoledì</span> <span>Aperto</span></div>}
                                                {point.schedule.thursday && <div className="flex justify-between"><span>Giovedì</span> <span>Aperto</span></div>}
                                                {point.schedule.friday && <div className="flex justify-between"><span>Venerdì</span> <span>Aperto</span></div>}
                                                {point.schedule.saturday && <div className="flex justify-between"><span>Sabato</span> <span>Aperto</span></div>}
                                                {point.schedule.sunday && <div className="flex justify-between"><span>Domenica</span> <span>Aperto</span></div>}

                                                {(point.schedule.openingTime || point.schedule.closingTime) && (
                                                    <div className="mt-2 text-sm font-medium border-t border-stone-200 pt-2">
                                                        Orario: {point.schedule.openingTime || '?'} - {point.schedule.closingTime || '?'}
                                                    </div>
                                                )}
                                            </>
                                        )}
                                        {point.schedule.notes && <p className="text-xs text-stone-500 mt-2 italic">{point.schedule.notes}</p>}
                                    </div>
                                ) : (
                                    <p className="text-stone-500">Orari non disponibili</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Informazioni Operatore */}
                    {point.operator && (
                        <div className="border-t border-stone-100 pt-8 mt-4">
                            <h2 className="text-xl font-bold mb-5 text-stone-800">Gestito da</h2>
                            <div className="flex flex-wrap gap-10">
                                <div className="flex items-center gap-3">
                                    <div className="bg-emerald-100 w-12 h-12 rounded-full flex items-center justify-center text-emerald-600 font-bold text-xl">
                                        {point.operator.organizationName ? point.operator.organizationName.charAt(0) : 'O'}
                                    </div>
                                    <div>
                                        <p className="font-bold text-stone-900">{point.operator.organizationName || 'Operatore'}</p>
                                        <p className="text-sm text-stone-500">{point.operator.user.email}</p>
                                    </div>
                                </div>
                                {point.operator.telephone && (
                                    <div className="flex items-center gap-2 text-stone-600">
                                        <FontAwesomeIcon icon={faPhone} /> {point.operator.telephone}
                                    </div>
                                )}
                                {point.operator.website && (
                                    <div className="flex items-center gap-2">
                                        <a href={point.operator.website} target="_blank" className="text-emerald-600 hover:underline">
                                            Sito Web
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default CollectionPointDetailsPage;
