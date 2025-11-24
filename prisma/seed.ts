import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Inizio seeding del database...");

  // Cancella dati esistenti (ordine importante!)
  await prisma.report.deleteMany();
  await prisma.collectionSchedule.deleteMany();
  await prisma.address.deleteMany();
  await prisma.collectionPoint.deleteMany();
  await prisma.operator.deleteMany();
  await prisma.user.deleteMany();

  console.log("✅ Database pulito");

  // Crea utenti normali
  const hashedPassword = await bcrypt.hash("Password123!", 10);

  const user1 = await prisma.user.create({
    data: {
      name: "Mario",
      surname: "Rossi",
      email: "mario.rossi@example.com",
      password: hashedPassword,
      role: "USER",
      oauthProvider: "APP",
      cellphone: "+39 333 1234567",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: "Giulia",
      surname: "Verdi",
      email: "giulia.verdi@example.com",
      password: hashedPassword,
      role: "USER",
      oauthProvider: "APP",
      cellphone: "+39 333 9876543",
    },
  });

  console.log("✅ Utenti creati");

  // Crea operatore
  const operatorUser = await prisma.user.create({
    data: {
      name: "SmartWaste",
      surname: "Operator",
      email: "operatore@smartwaste.it",
      password: hashedPassword,
      role: "OPERATOR",
      oauthProvider: "APP",
      cellphone: "+39 06 1234567",
    },
  });

  const operator = await prisma.operator.create({
    data: {
      userId: operatorUser.id,
      organizationName: "SmartWaste Italia S.r.l.",
      vatNumber: "IT12345678901",
      telephone: "+39 06 1234567",
      website: "https://smartwaste.it",
    },
  });

  console.log("✅ Operatore creato");

  // Crea tipi di rifiuto
  const wasteTypes = await Promise.all([
    prisma.wasteType.create({
      data: {
        name: "PLASTIC",
        description: "Plastica e imballaggi plastici",
        color: "#FFEB3B",
        iconName: "plastic",
        disposalInfo: "Bottiglie, flaconi, vaschette",
        examples: "Bottiglie PET, flaconi shampoo, vaschette alimentari",
      },
    }),
    prisma.wasteType.create({
      data: {
        name: "PAPER",
        description: "Carta e cartone",
        color: "#2196F3",
        iconName: "paper",
        disposalInfo: "Carta pulita, cartoni, giornali",
        examples: "Giornali, scatole di cartone, quaderni",
      },
    }),
    prisma.wasteType.create({
      data: {
        name: "GLASS",
        description: "Vetro",
        color: "#4CAF50",
        iconName: "glass",
        disposalInfo: "Bottiglie e barattoli in vetro",
        examples: "Bottiglie di vino, barattoli di marmellata",
      },
    }),
    prisma.wasteType.create({
      data: {
        name: "METAL",
        description: "Metalli e lattine",
        color: "#9E9E9E",
        iconName: "metal",
        disposalInfo: "Lattine, barattoli metallici",
        examples: "Lattine bibite, scatolette conserve",
      },
    }),
    prisma.wasteType.create({
      data: {
        name: "ORGANIC",
        description: "Rifiuti organici",
        color: "#8D6E63",
        iconName: "organic",
        disposalInfo: "Scarti alimentari biodegradabili",
        examples: "Bucce di frutta, scarti verdura, fondi caffè",
      },
    }),
    prisma.wasteType.create({
      data: {
        name: "ELECTRONICS",
        description: "Apparecchiature elettroniche (RAEE)",
        color: "#F44336",
        iconName: "electronics",
        disposalInfo: "Dispositivi elettronici ed elettrici",
        examples: "Smartphone, TV, elettrodomestici",
      },
    }),
  ]);

  console.log("✅ Tipi di rifiuto creati");

  // Crea punti di raccolta con indirizzi
  
  // 1. Ancona
  const pointAncona = await prisma.collectionPoint.create({
    data: {
      name: "Centro Raccolta Ancona Nord",
      operatorId: operator.userId,
      description: "Centro principale della provincia di Ancona. Ampio parcheggio disponibile.",
      isActive: true,
      accessibility: "Accessibile ai disabili",
      capacity: "800 m³",
      wasteTypes: {
        connect: wasteTypes.map(wt => ({ id: wt.id })),
      },
    },
  });

  await prisma.address.create({
    data: {
      collectionPointId: pointAncona.id,
      street: "Via Flaminia",
      number: "260",
      city: "Ancona",
      zip: "60126",
      country: "Italy",
      latitude: 43.6373,
      longitude: 13.5158,
    },
  });

  // 2. Pesaro
  const pointPesaro = await prisma.collectionPoint.create({
    data: {
      name: "Ecocentro Pesaro",
      operatorId: operator.userId,
      description: "Punto di raccolta eco-sostenibile con area educativa.",
      isActive: true,
      accessibility: "Accessibile",
      capacity: "600 m³",
      wasteTypes: {
        connect: wasteTypes.filter(wt => 
          ["PLASTIC", "PAPER", "GLASS", "ELECTRONICS"].includes(wt.name)
        ).map(wt => ({ id: wt.id })),
      },
    },
  });

  await prisma.address.create({
    data: {
      collectionPointId: pointPesaro.id,
      street: "Via dell'Industria",
      number: "45",
      city: "Pesaro",
      zip: "61122",
      country: "Italy",
      latitude: 43.9093,
      longitude: 12.9134,
    },
  });

  // 3. Macerata
  const pointMacerata = await prisma.collectionPoint.create({
    data: {
      name: "Isola Ecologica Macerata",
      operatorId: operator.userId,
      description: "Chiuso il lunedì. Servizio di ritiro ingombranti su prenotazione.",
      isActive: true,
      accessibility: "Non accessibile",
      capacity: "450 m³",
      wasteTypes: {
        connect: wasteTypes.filter(wt => 
          ["PLASTIC", "PAPER", "GLASS", "ORGANIC"].includes(wt.name)
        ).map(wt => ({ id: wt.id })),
      },
    },
  });

  await prisma.address.create({
    data: {
      collectionPointId: pointMacerata.id,
      street: "Via dei Velini",
      number: "78",
      city: "Macerata",
      zip: "62100",
      country: "Italy",
      latitude: 43.2985,
      longitude: 13.4532,
    },
  });

  // 4. Ascoli Piceno
  const pointAscoli = await prisma.collectionPoint.create({
    data: {
      name: "Centro Riciclo Ascoli Piceno",
      operatorId: operator.userId,
      description: "Centro con tecnologie avanzate di selezione rifiuti.",
      isActive: true,
      accessibility: "Accessibile",
      capacity: "700 m³",
      wasteTypes: {
        connect: wasteTypes.map(wt => ({ id: wt.id })),
      },
    },
  });

  await prisma.address.create({
    data: {
      collectionPointId: pointAscoli.id,
      street: "Via Salaria Inferiore",
      number: "123",
      city: "Ascoli Piceno",
      zip: "63100",
      country: "Italy",
      latitude: 42.8534,
      longitude: 13.5759,
    },
  });

  // 5. Fano
  const pointFano = await prisma.collectionPoint.create({
    data: {
      name: "Punto Verde Fano",
      operatorId: operator.userId,
      description: "Centro vicino al mare, ideale per turisti. No parcheggio interno.",
      isActive: true,
      accessibility: "Accessibile",
      capacity: "350 m³",
      wasteTypes: {
        connect: wasteTypes.filter(wt => 
          ["PLASTIC", "PAPER", "GLASS", "ORGANIC"].includes(wt.name)
        ).map(wt => ({ id: wt.id })),
      },
    },
  });

  await prisma.address.create({
    data: {
      collectionPointId: pointFano.id,
      street: "Via Roma",
      number: "89",
      city: "Fano",
      zip: "61032",
      country: "Italy",
      latitude: 43.8408,
      longitude: 13.0173,
    },
  });

  // 6. Roma (Lazio)
  const pointRoma = await prisma.collectionPoint.create({
    data: {
      name: "AMA Centro Raccolta Ostia",
      operatorId: operator.userId,
      description: "Centro raccolta principale zona litoranea. Servizio gratuito per residenti.",
      isActive: true,
      accessibility: "Accessibile",
      capacity: "1000 m³",
      wasteTypes: {
        connect: wasteTypes.map(wt => ({ id: wt.id })),
      },
    },
  });

  await prisma.address.create({
    data: {
      collectionPointId: pointRoma.id,
      street: "Via delle Baleniere",
      number: "98",
      city: "Roma",
      zip: "00121",
      country: "Italy",
      latitude: 41.7308,
      longitude: 12.2904,
    },
  });

  console.log("✅ Creati 6 punti di raccolta con indirizzi");

  console.log("\n🎉 Seed completato con successo!");
  console.log("\n📋 Credenziali di accesso:");
  console.log("👤 User 1: mario.rossi@example.com / Password123!");
  console.log("👤 User 2: giulia.verdi@example.com / Password123!");
  console.log("👨‍💼 Operator: operatore@smartwaste.it / Password123!");
}

main()
  .catch((e) => {
    console.error("❌ Errore durante il seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });