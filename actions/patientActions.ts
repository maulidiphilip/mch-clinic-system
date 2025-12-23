"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db/drizzle";
import { patients } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getPatients() {
  return await db.select().from(patients).orderBy(patients.createdAt);
}

export async function getPatient(id: number) {
  const all = await getPatients();
  return all.find((p) => p.id === id) || null;
}

export async function createPatient(formData: FormData) {
  const fullName = formData.get("fullName") as string;
  const type = formData.get("type") as "mother" | "child";

  const year = new Date().getFullYear();
  const allPatients = await getPatients();
  const seq = String(allPatients.length + 1).padStart(4, "0");
  const patientId = `MCH-${year}-${seq}`;

  await db.insert(patients).values({
    fullName,
    type,
    patientId,
    village: (formData.get("village") as string) || null,
    phone: (formData.get("phone") as string) || null,
    dateOfBirth: (formData.get("dateOfBirth") as string) || null,
    guardianName: (formData.get("guardianName") as string) || null,
  });

  revalidatePath("/patients");
}