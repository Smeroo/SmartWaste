'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faLeaf } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

const RegisterPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validazione
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Compila tutti i campi');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Le password non corrispondono');
      return;
    }

    if (formData.password.length < 8) {
      toast.error('La password deve essere di almeno 8 caratteri');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: 'USER', // Sempre USER
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Registrazione completata! Effettua il login');
        router.push('/login');
      } else {
        toast.error(data.error || 'Errore durante la registrazione');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Errore di connessione. Riprova più tardi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-28 bg-gradient-to-br from-emerald-500 to-green-700">
      <div className="bg-stone-100 rounded-3xl shadow-2xl p-8 md:p-12 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block bg-emerald-500 p-4 rounded-full mb-4">
            <FontAwesomeIcon icon={faLeaf} className="text-4xl text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-2">
            Unisciti a <span className="text-emerald-500">SmartWaste</span>
          </h1>
          <p className="text-stone-600">Crea il tuo account gratuito</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nome */}
          <div className="relative">
            <FontAwesomeIcon 
              icon={faUser} 
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400"
            />
            <input
              type="text"
              name="name"
              placeholder="Nome completo"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-stone-300 
                       focus:border-emerald-500 focus:outline-none transition text-stone-900"
            />
          </div>

          {/* Email */}
          <div className="relative">
            <FontAwesomeIcon 
              icon={faEnvelope} 
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-stone-300 
                       focus:border-emerald-500 focus:outline-none transition text-stone-900"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <FontAwesomeIcon 
              icon={faLock} 
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400"
            />
            <input
              type="password"
              name="password"
              placeholder="Password (min. 8 caratteri)"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={8}
              className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-stone-300 
                       focus:border-emerald-500 focus:outline-none transition text-stone-900"
            />
          </div>

          {/* Conferma Password */}
          <div className="relative">
            <FontAwesomeIcon 
              icon={faLock} 
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400"
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Conferma password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-stone-300 
                       focus:border-emerald-500 focus:outline-none transition text-stone-900"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-2xl font-bold text-lg text-white
                     transition-all duration-300 shadow-lg
                     ${loading 
                       ? 'bg-stone-400 cursor-not-allowed' 
                       : 'bg-emerald-500 hover:bg-emerald-600 hover:scale-105 active:scale-95'
                     }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                Registrazione...
              </span>
            ) : (
              'Registrati'
            )}
          </button>
        </form>

        {/* Privacy Notice */}
        <p className="text-xs text-stone-500 text-center mt-5">
          Registrandoti accetti i nostri{' '}
          <Link href="/terms" className="text-emerald-500 hover:underline">
            Termini di Servizio
          </Link>{' '}
          e la{' '}
          <Link href="/privacy" className="text-emerald-500 hover:underline">
            Privacy Policy
          </Link>
        </p>

        {/* Login Link */}
        <div className="text-center mt-6">
          <p className="text-stone-600">
            Hai già un account?{' '}
            <Link href="/login" className="text-emerald-500 font-bold hover:underline">
              Accedi
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;