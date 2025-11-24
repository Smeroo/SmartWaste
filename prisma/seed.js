const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Inizio seeding del database...");

  // Cancella dati esistenti
  await prisma.collectionPoint.deleteMany();
  await prisma.user.deleteMany();

  console.log("✅ Database pulito");

  // Crea utenti di test
  const hashedPassword = await bcrypt.hash("Password123!", 10);

  await prisma.user.create({
    data: {
      name: "Mario Rossi",
      email: "mario.rossi@example.com",
      password: hashedPassword,
      role: "USER",
    },
  });

  await prisma.user.create({
    data: {
      name: "Giulia Verdi",
      email: "giulia.verdi@example.com",
      password: hashedPassword,
      role: "USER",
    },
  });

  console.log("✅ Utenti creati");

  // Punti di raccolta
  const collectionPointsData = [
    // MARCHE - Ancona
    {
      name: "Centro Raccolta Ancona Nord",
      address: "Via Flaminia, 260, 60126 Ancona AN",
      city: "Ancona",
      province: "AN",
      region: "Marche",
      postalCode: "60126",
      latitude: 43.6373,
      longitude: 13.5158,
      phone: "+39 071 2801234",
      email: "raccolta.ancona@smartwaste.it",
      openingHours: "Lunedì-Sabato: 8:00-18:00",
      wasteTypes: ["PLASTIC", "PAPER", "GLASS", "METAL", "ORGANIC", "ELECTRONICS"],
      capacity: 800,
      currentLoad: 340,
      isActive: true,
      hasParking: true,
      isAccessible: true,
      notes: "Centro principale della provincia di Ancona. Ampio parcheggio disponibile.",
    },
    // MARCHE - Pesaro
    {
      name: "Ecocentro Pesaro",
      address: "Via dell'Industria, 45, 61122 Pesaro PU",
      city: "Pesaro",
      province: "PU",
      region: "Marche",
      postalCode: "61122",
      latitude: 43.9093,
      longitude: 12.9134,
      phone: "+39 0721 387654",
      email: "ecocentro.pesaro@smartwaste.it",
      openingHours: "Lunedì-Venerdì: 8:00-17:00, Sabato: 8:00-13:00",
      wasteTypes: ["PLASTIC", "PAPER", "GLASS", "ELECTRONICS", "BULKY"],
      capacity: 600,
      currentLoad: 280,
      isActive: true,
      hasParking: true,
      isAccessible: true,
      notes: "Punto di raccolta eco-sostenibile con area educativa.",
    },
    // MARCHE - Macerata
    {
      name: "Isola Ecologica Macerata",
      address: "Via dei Velini, 78, 62100 Macerata MC",
      city: "Macerata",
      province: "MC",
      region: "Marche",
      postalCode: "62100",
      latitude: 43.2985,
      longitude: 13.4532,
      phone: "+39 0733 234567",
      email: "isola.macerata@smartwaste.it",
      openingHours: "Martedì-Domenica: 9:00-18:00",
      wasteTypes: ["PLASTIC", "PAPER", "GLASS", "ORGANIC", "HAZARDOUS"],
      capacity: 450,
      currentLoad: 190,
      isActive: true,
      hasParking: true,
      isAccessible: false,
      notes: "Chiuso il lunedì. Servizio di ritiro ingombranti su prenotazione.",
    },
    // MARCHE - Ascoli Piceno
    {
      name: "Centro Riciclo Ascoli Piceno",
      address: "Via Salaria Inferiore, 123, 63100 Ascoli Piceno AP",
      city: "Ascoli Piceno",
      province: "AP",
      region: "Marche",
      postalCode: "63100",
      latitude: 42.8534,
      longitude: 13.5759,
      phone: "+39 0736 345678",
      email: "riciclo.ascoli@smartwaste.it",
      openingHours: "Lunedì-Sabato: 7:30-19:00",
      wasteTypes: ["PLASTIC", "PAPER", "GLASS", "METAL", "ELECTRONICS", "BATTERIES"],
      capacity: 700,
      currentLoad: 420,
      isActive: true,
      hasParking: true,
      isAccessible: true,
      notes: "Centro con tecnologie avanzate di selezione rifiuti.",
    },
    // MARCHE - Fano
    {
      name: "Punto Verde Fano",
      address: "Via Roma, 89, 61032 Fano PU",
      city: "Fano",
      province: "PU",
      region: "Marche",
      postalCode: "61032",
      latitude: 43.8408,
      longitude: 13.0173,
      phone: "+39 0721 456789",
      email: "puntoverde.fano@smartwaste.it",
      openingHours: "Lunedì-Venerdì: 8:30-17:30, Sabato: 9:00-13:00",
      wasteTypes: ["PLASTIC", "PAPER", "GLASS", "ORGANIC"],
      capacity: 350,
      currentLoad: 150,
      isActive: true,
      hasParking: false,
      isAccessible: true,
      notes: "Centro vicino al mare, ideale per turisti. No parcheggio interno.",
    },
    // LAZIO - Roma
    {
      name: "AMA Centro Raccolta Ostia",
      address: "Via delle Baleniere, 98, 00121 Roma RM",
      city: "Roma",
      province: "RM",
      region: "Lazio",
      postalCode: "00121",
      latitude: 41.7308,
      longitude: 12.2904,
      phone: "+39 06 51691234",
      email: "ostia@amaroma.it",
      openingHours: "Lunedì-Sabato: 7:00-19:00",
      wasteTypes: ["PLASTIC", "PAPER", "GLASS", "METAL", "ELECTRONICS", "BULKY"],
      capacity: 1000,
      currentLoad: 650,
      isActive: true,
      hasParking: true,
      isAccessible: true,
      notes: "Centro raccolta principale zona litoranea. Servizio gratuito per residenti.",
    },
    // TOSCANA - Firenze
    {
      name: "Alia Centro Raccolta Firenze Sud",
      address: "Via Baccio da Montelupo, 52, 50142 Firenze FI",
      city: "Firenze",
      province: "FI",
      region: "Toscana",
      postalCode: "50142",
      latitude: 43.7376,
      longitude: 11.2384,
      phone: "+39 055 4291234",
      email: "firenze.sud@aliaserviziambientali.it",
      openingHours: "Martedì-Domenica: 8:00-18:00",
      wasteTypes: ["PLASTIC", "PAPER", "GLASS", "ORGANIC", "ELECTRONICS", "HAZARDOUS"],
      capacity: 850,
      currentLoad: 520,
      isActive: true,
      hasParking: true,
      isAccessible: true,
      notes: "Chiuso il lunedì. Area dedicata a rifiuti pericolosi.",
    },
  ];

  // Crea i punti di raccolta
  await prisma.collectionPoint.createMany({
    data: collectionPointsData,
  });

  console.log(`✅ Creati ${collectionPointsData.length} punti di raccolta`);
  console.log("🎉 Seed completato con successo!");
}

main()
  .catch((e) => {
    console.error("❌ Errore durante il seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });