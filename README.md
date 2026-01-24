# SmartWaste - Gestione Intelligente dei Rifiuti 🌱♻️

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-15.2-black?style=for-the-badge&logo=next.js" alt="Next.js"/>
  <img src="https://img.shields.io/badge/TypeScript-5.8-blue?style=for-the-badge&logo=typescript" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Prisma-6.5-2D3748?style=for-the-badge&logo=prisma" alt="Prisma"/>
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License"/>
</div>

## 📱 Cos'è SmartWaste?

SmartWaste è un'applicazione web e mobile che aiuta i cittadini a localizzare i punti di raccolta differenziata più vicini e fornisce informazioni dettagliate su come smaltire correttamente ogni tipo di rifiuto.

## 🌱 Funzionalità principali

### Per Cittadini 👥
- 🔍 **Ricerca Intelligente**: "Dove butto le batterie?" - trova subito il punto più vicino
- 🗺️ **Mappa Interattiva**: Visualizza tutti i punti di raccolta con codifica colori
- ♻️ **Guide allo Smaltimento**: Istruzioni dettagliate per ogni tipo di rifiuto
- 📅 **Orari di Raccolta**: Consulta quando sono aperti i centri di raccolta
- 🚨 **Segnalazioni**: Cassonetti pieni? Danni? Segnala in un tap
- 📍 **Geolocalizzazione**: Trova automaticamente i punti più vicini a te

### Per Operatori/Comuni 🏛️
- ➕ **Gestione Punti**: Aggiungi e modifica i punti di raccolta
- 📊 **Dashboard Segnalazioni**: Monitora e gestisci le segnalazioni dei cittadini
- ✏️ **Aggiornamenti Real-time**: Modifica orari e disponibilità
- 📈 **Statistiche**: Analizza l'utilizzo del servizio

## 🛠️ Stack Tecnologico

### Frontend
- **Next.js 15** - Framework React con App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling moderno e responsive
- **Leaflet** - Mappe interattive OpenStreetMap
- **Font Awesome** - Iconografia ricca
- **React Hook Form + Zod** - Gestione form e validazione
- **React Toastify** - Notifiche eleganti

### Backend
- **Next.js API Routes** - RESTful API
- **Prisma ORM** - Type-safe database queries
- **SQLite** - Database (sviluppo) / PostgreSQL (produzione)
- **Auth.js (NextAuth)** - Autenticazione completa
  - OAuth (Google, GitHub)
  - Credenziali con bcrypt
- **Nominatim API** - Geocoding e ricerca indirizzi

### PWA & Mobile
- **Progressive Web App** - Installabile su tutti i dispositivi
- **Service Worker** - Funzionalità offline
- **Capacitor** - Build native iOS/Android

## 📁 Struttura del Progetto

```
SmartWaste/
├── prisma/
│   ├── schema.prisma       # Schema del Database
│   └── seed.ts             # Script di popolamento iniziale
├── public/                 # Asset statici (immagini, icone)
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── api/            # API Endpoints
│   │   ├── collection-points/ # Punti di raccolta
│   │   ├── login/          # Login
│   │   ├── register/       # Registrazione
│   │   ├── profile/        # Profilo utente
│   │   ├── spaces/         # Gestione spazi
│   │   ├── layout.tsx      # Layout principale
│   │   └── page.tsx        # Homepage
│   ├── components/         # Componenti React riutilizzabili
│   ├── lib/                # Utility (db, auth, zed, ecc.)
│   ├── services/           # Logica di business
│   ├── types/              # Definizioni TypeScript
│   ├── auth.ts             # Configurazione NextAuth
│   └── middleware.ts       # Middleware di protezione
├── .env                    # Variabili d'ambiente
├── next.config.ts          # Configurazione Next.js
├── package.json            # Dipendenze e script
└── tsconfig.json           # Configurazione TypeScript
```
