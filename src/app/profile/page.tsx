'use client';

import React, { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faEnvelope, 
  faCalendar, 
  faSignOutAlt, 
  faLeaf,
  faMapMarkerAlt,
  faBell,
  faEdit
} from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

const ProfilePage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/profile');
        const data = await response.json();
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated') {
      fetchProfile();
    }
  }, [status]);

  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center pt-28">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-emerald-500"></div>
          <p className="mt-5 text-xl text-stone-600">Caricamento profilo...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-28">
        <div className="text-center">
          <p className="text-xl text-red-600">Errore nel caricamento del profilo</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-10 px-5 sm:px-10 md:px-15 lg:px-20">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl md:text-6xl font-bold mb-3">
          Il Tuo <span className="text-emerald-500">Profilo</span>
        </h1>
        <p className="text-xl text-stone-600">
          Gestisci le tue informazioni e attività
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonna Sinistra - Info Profilo */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card Info Personali */}
          <div className="bg-stone-100 rounded-3xl p-8 shadow-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <FontAwesomeIcon icon={faUser} className="text-emerald-500" />
                Informazioni Personali
              </h2>
              <button className="px-4 py-2 bg-emerald-500 text-white rounded-2xl hover:bg-emerald-600 transition">
                <FontAwesomeIcon icon={faEdit} className="mr-2" />
                Modifica
              </button>
            </div>

            <div className="space-y-4">
              {/* Nome */}
              <div className="flex items-center gap-4 p-4 bg-white rounded-2xl">
                <div className="bg-emerald-100 p-3 rounded-full">
                  <FontAwesomeIcon icon={faUser} className="text-emerald-600 text-xl" />
                </div>
                <div>
                  <p className="text-sm text-stone-500">Nome completo</p>
                  <p className="text-lg font-semibold text-stone-900">{profile.name}</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-4 p-4 bg-white rounded-2xl">
                <div className="bg-blue-100 p-3 rounded-full">
                  <FontAwesomeIcon icon={faEnvelope} className="text-blue-600 text-xl" />
                </div>
                <div>
                  <p className="text-sm text-stone-500">Email</p>
                  <p className="text-lg font-semibold text-stone-900">{profile.email}</p>
                </div>
              </div>

              {/* Ruolo */}
              <div className="flex items-center gap-4 p-4 bg-white rounded-2xl">
                <div className="bg-purple-100 p-3 rounded-full">
                  <FontAwesomeIcon icon={faLeaf} className="text-purple-600 text-xl" />
                </div>
                <div>
                  <p className="text-sm text-stone-500">Ruolo</p>
                  <p className="text-lg font-semibold text-stone-900">
                    {profile.role === 'USER' ? 'Cittadino' : 'Operatore'}
                  </p>
                </div>
              </div>

              {/* Data Registrazione */}
              <div className="flex items-center gap-4 p-4 bg-white rounded-2xl">
                <div className="bg-yellow-100 p-3 rounded-full">
                  <FontAwesomeIcon icon={faCalendar} className="text-yellow-600 text-xl" />
                </div>
                <div>
                  <p className="text-sm text-stone-500">Membro dal</p>
                  <p className="text-lg font-semibold text-stone-900">
                    {new Date(profile.createdAt).toLocaleDateString('it-IT', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Card Statistiche (placeholder) */}
          <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-3xl p-8 shadow-md text-white">
            <h2 className="text-2xl font-bold mb-6">Le Tue Statistiche</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">0</div>
                <p className="text-sm opacity-90">Segnalazioni</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">0</div>
                <p className="text-sm opacity-90">Punti Visitati</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">0</div>
                <p className="text-sm opacity-90">Contributi</p>
              </div>
            </div>
          </div>
        </div>

        {/* Colonna Destra - Azioni Rapide */}
        <div className="space-y-6">
          {/* Card Azioni */}
          <div className="bg-stone-100 rounded-3xl p-6 shadow-md">
            <h2 className="text-xl font-bold mb-4">Azioni Rapide</h2>
            <div className="space-y-3">
              <Link
                href="/collection-points"
                className="flex items-center gap-3 p-4 bg-white rounded-2xl hover:bg-emerald-50 transition group"
              >
                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-emerald-500 text-xl group-hover:scale-110 transition" />
                <span className="font-medium">Trova Punti Raccolta</span>
              </Link>

              <Link
                href="/waste-guide"
                className="flex items-center gap-3 p-4 bg-white rounded-2xl hover:bg-blue-50 transition group"
              >
                <FontAwesomeIcon icon={faLeaf} className="text-blue-500 text-xl group-hover:scale-110 transition" />
                <span className="font-medium">Guida Rifiuti</span>
              </Link>

              <button className="flex items-center gap-3 p-4 bg-white rounded-2xl hover:bg-yellow-50 transition group w-full text-left">
                <FontAwesomeIcon icon={faBell} className="text-yellow-500 text-xl group-hover:scale-110 transition" />
                <span className="font-medium">Notifiche (0)</span>
              </button>
            </div>
          </div>

          {/* Card Logout */}
          <div className="bg-stone-100 rounded-3xl p-6 shadow-md">
            <h2 className="text-xl font-bold mb-4">Account</h2>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-3 w-full p-4 bg-red-500 text-white rounded-2xl 
                       hover:bg-red-600 transition-all duration-300 hover:scale-105 active:scale-95 font-semibold"
            >
              <FontAwesomeIcon icon={faSignOutAlt} />
              Disconnetti
            </button>
          </div>

          {/* Card Info */}
          <div className="bg-emerald-50 border-2 border-emerald-200 rounded-3xl p-6">
            <h3 className="font-bold text-emerald-900 mb-2">💡 Suggerimento</h3>
            <p className="text-sm text-emerald-800">
              Completa il tuo profilo per sbloccare funzionalità esclusive e contribuire alla community!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;