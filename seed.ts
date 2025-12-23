import { db } from "./db/drizzle";
import { patients } from "./db/schema";

const malawianNames = [
  "Fatima Selemani",
  "Chifundo Banda",
  "Aisha Kamwendo",
  "Yamikani Phiri",
  "Tadala Mbewe",
  "Mirriam Chirwa",
  "Patricia Moyo",
  "Linda Kumwenda",
  "Grace Nkhoma",
  "Mercy Mkandawire",
  "Precious Gondwe",
  "Stella Botha",
];

const childNames = [
  "Blessings Chimwala",
  "Joseph Kazembe",
  "Hope Nyirenda",
  "Prince Mhango",
  "Innocent Chavula",
  "Gift Msukwa",
  "Miracle Longwe",
  "Victory Zulu",
];

const villages = [
  "Namwera",
  "Zomba",
  "Chikwawa",
  "Mulanje",
  "Balaka",
  "Nkhata Bay",
  "Kasungu",
  "Dowa",
  "Machinga",
  "Ntcheu",
];

async function seed() {
  for (let i = 0; i < 30; i++) {
    const isMother = Math.random() > 0.5;
    await db.insert(patients).values({
      fullName: isMother
        ? malawianNames[Math.floor(Math.random() * malawianNames.length)]
        : childNames[Math.floor(Math.random() * childNames.length)],
      type: isMother ? "mother" : "child",
      village: villages[Math.floor(Math.random() * villages.length)],
      phone:
        Math.random() > 0.5
          ? `0999${Math.floor(1000000 + Math.random() * 9000000)}`
          : null,
      guardianName: isMother ? null : "Parent/Guardian",
      patientId: `MCH-2025-${String(i + 1).padStart(4, "0")}`,
    });
  }
  console.log("Seeded 30 patients!");
  process.exit(0);
}

seed();
