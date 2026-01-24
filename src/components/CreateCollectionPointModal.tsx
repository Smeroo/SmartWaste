import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faTimes, faImage, faInfoCircle, faCheck, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface WasteType {
    id: number;
    name: string;
}

const CreateCollectionPointModal: React.FC<{ isOpen: boolean; onClose: () => void, onSuccess: () => void }> = ({ isOpen, onClose, onSuccess }) => {
    const { data: session } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [wasteTypes, setWasteTypes] = useState<WasteType[]>([]);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        accessibility: 'Public',
        capacity: '',
        address: {
            street: '',
            number: '',
            city: '',
            zip: '',
            country: 'Italy',
            latitude: 0,
            longitude: 0
        },
        wasteTypeIds: [] as number[],
        schedule: {
            isAlwaysOpen: false,
            monday: false,
            tuesday: false,
            wednesday: false,
            thursday: false,
            friday: false,
            saturday: false,
            sunday: false,
            openingTime: '',
            closingTime: '',
            notes: ''
        }
    });

    const [addressQuery, setAddressQuery] = useState('');
    const [addressSuggestions, setAddressSuggestions] = useState<any[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchWasteTypes();
        }
    }, [isOpen]);

    const fetchWasteTypes = async () => {
        try {
            const res = await fetch('/api/services'); // Idealmente rinominare anche questo endpoint, ma attenersi al piano
            if (res.ok) {
                const data = await res.json();
                setWasteTypes(data);
            }
        } catch (error) {
            console.error('Failed to fetch waste types', error);
        }
    };

    const handleAddressSearch = async (query: string) => {
        setAddressQuery(query);
        if (query.length > 2) {
            try {
                const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=it&limit=5`);
                const data = await res.json();
                setAddressSuggestions(data);
                setShowSuggestions(true);
            } catch (error) {
                console.error('Nominatim error', error);
            }
        } else {
            setAddressSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const selectAddress = (suggestion: any) => {
        const address = suggestion.address;
        setFormData(prev => ({
            ...prev,
            address: {
                street: address.road || address.pedestrian || '',
                number: address.house_number || '',
                city: address.city || address.town || address.village || '',
                zip: address.postcode || '',
                country: 'Italy',
                latitude: parseFloat(suggestion.lat),
                longitude: parseFloat(suggestion.lon)
            }
        }));
        setAddressQuery(suggestion.display_name);
        setShowSuggestions(false);
    };

    const toggleWasteType = (id: number) => {
        setFormData(prev => {
            const current = prev.wasteTypeIds;
            if (current.includes(id)) {
                return { ...prev, wasteTypeIds: current.filter(cid => cid !== id) };
            } else {
                return { ...prev, wasteTypeIds: [...current, id] };
            }
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Necessario ottenere l'ID Operatore dalla sessione. Assumendo che session.user.id sia lo userId che è anche operatorId
            const operatorId = session?.user?.id;

            if (!operatorId) {
                alert('User not authenticated');
                return;
            }

            const payload = {
                ...formData,
                operatorId
            };

            const res = await fetch('/api/collection-points', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                onSuccess();
                onClose();
            } else {
                const err = await res.json();
                alert(err.error || 'Failed to create collection point');
            }
        } catch (error) {
            console.error(error);
            alert('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 backdrop-blur-sm p-5">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50">
                    <h2 className="text-2xl font-bold text-stone-800">Nuovo Punto di Raccolta</h2>
                    <button onClick={onClose} className="text-stone-400 hover:text-red-500 transition text-xl">
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>

                <div className="overflow-y-auto p-6 flex-1">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-8">

                        {/* Informazioni Base */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="font-semibold text-stone-700">Nome Punto di Raccolta</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="p-3 border rounded-xl bg-stone-50 focus:ring-2 focus:ring-emerald-500 outline-none"
                                    placeholder="Es. Isola Ecologica Centro"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="font-semibold text-stone-700">Accessibilità</label>
                                <select
                                    value={formData.accessibility}
                                    onChange={e => setFormData({ ...formData, accessibility: e.target.value })}
                                    className="p-3 border rounded-xl bg-stone-50 focus:ring-2 focus:ring-emerald-500 outline-none"
                                >
                                    <option value="Privato">Privato</option>
                                    <option value="Pubblico">Pubblico</option>
                                    <option value="Riservato ai residenti">Riservato ai residenti</option>
                                </select>
                            </div>
                        </div>

                        {/* Ricerca Indirizzo */}
                        <div className="flex flex-col gap-2 relative">
                            <label className="font-semibold text-stone-700">Indirizzo (Cerca e Seleziona)</label>
                            <input
                                type="text"
                                value={addressQuery}
                                onChange={e => handleAddressSearch(e.target.value)}
                                className="p-3 border rounded-xl bg-stone-50 focus:ring-2 focus:ring-emerald-500 outline-none"
                                placeholder="Via Roma, 1, Milano..."
                            />
                            {showSuggestions && addressSuggestions.length > 0 && (
                                <ul className="absolute top-full left-0 right-0 bg-white border rounded-xl shadow-lg mt-1 z-10 max-h-60 overflow-y-auto">
                                    {addressSuggestions.map((s, i) => (
                                        <li
                                            key={i}
                                            onClick={() => selectAddress(s)}
                                            className="p-3 hover:bg-emerald-50 cursor-pointer border-b last:border-b-0 text-sm"
                                        >
                                            {s.display_name}
                                        </li>
                                    ))}
                                </ul>
                            )}
                            <div className="text-xs text-stone-500">
                                Lat: {formData.address.latitude}, Lon: {formData.address.longitude} ({formData.address.city})
                            </div>
                        </div>

                        {/* Descrizione */}
                        <div className="flex flex-col gap-2">
                            <label className="font-semibold text-stone-700">Descrizione</label>
                            <textarea
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                className="p-3 border rounded-xl bg-stone-50 focus:ring-2 focus:ring-emerald-500 outline-none h-24 resize-none"
                                placeholder="Descrivi il punto di raccolta, limitazioni, ecc."
                            />
                        </div>

                        {/* Tipi di Rifiuto */}
                        <div className="flex flex-col gap-2">
                            <label className="font-semibold text-stone-700">Rifiuti Accettati</label>
                            <div className="flex flex-wrap gap-2 bg-stone-50 p-4 rounded-xl border">
                                {wasteTypes.map(type => (
                                    <button
                                        key={type.id}
                                        type="button"
                                        onClick={() => toggleWasteType(type.id)}
                                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition
                                            ${formData.wasteTypeIds.includes(type.id)
                                                ? 'bg-emerald-500 text-white shadow-md transform scale-105'
                                                : 'bg-white border text-stone-600 hover:bg-stone-100'}`}
                                    >
                                        {type.name}
                                        {formData.wasteTypeIds.includes(type.id) && <FontAwesomeIcon icon={faCheck} className="ml-2" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Orario (Semplificato) */}
                        <div className="flex flex-col gap-4 border-t pt-4">
                            <div className="flex items-center gap-3">
                                <label className="font-semibold text-stone-700">Sempre Aperto (24/7)</label>
                                <input
                                    type="checkbox"
                                    checked={formData.schedule.isAlwaysOpen}
                                    onChange={e => setFormData({
                                        ...formData,
                                        schedule: { ...formData.schedule, isAlwaysOpen: e.target.checked }
                                    })}
                                    className="w-5 h-5 accent-emerald-500"
                                />
                            </div>

                            {!formData.schedule.isAlwaysOpen && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium">Apertura</label>
                                        <input
                                            type="time"
                                            value={formData.schedule.openingTime}
                                            onChange={e => setFormData({
                                                ...formData,
                                                schedule: { ...formData.schedule, openingTime: e.target.value }
                                            })}
                                            className="p-2 border rounded-lg"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium">Chiusura</label>
                                        <input
                                            type="time"
                                            value={formData.schedule.closingTime}
                                            onChange={e => setFormData({
                                                ...formData,
                                                schedule: { ...formData.schedule, closingTime: e.target.value }
                                            })}
                                            className="p-2 border rounded-lg"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <div className="flex flex-wrap gap-3">
                                            {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
                                                <label key={day} className="flex items-center gap-2 text-sm capitalize">
                                                    <input
                                                        type="checkbox"
                                                        // @ts-ignore
                                                        checked={formData.schedule[day]}
                                                        // @ts-ignore
                                                        onChange={e => setFormData({
                                                            ...formData,
                                                            schedule: { ...formData.schedule, [day]: e.target.checked }
                                                        })}
                                                        className="accent-emerald-500"
                                                    />
                                                    {day.slice(0, 3)}
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                    </form>
                </div>

                <div className="p-6 border-t border-stone-100 bg-stone-50 flex justify-end gap-4">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 rounded-xl text-stone-600 font-bold hover:bg-stone-200 transition"
                    >
                        Annulla
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-6 py-2 rounded-xl bg-emerald-500 text-white font-bold hover:bg-emerald-600 transition shadow-lg flex items-center gap-2"
                    >
                        {loading && <FontAwesomeIcon icon={faSpinner} spin />}
                        Crea Punto Raccolta
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateCollectionPointModal;
