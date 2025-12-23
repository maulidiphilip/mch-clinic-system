"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db/drizzle";
import { growthRecords } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getGrowthRecords(patientId: number) {
  return await db
    .select()
    .from(growthRecords)
    .where(eq(growthRecords.patientId, patientId))
    .orderBy(growthRecords.recordDate);
}

export async function createGrowthRecord(formData: FormData) {
  const patientId = Number(formData.get("patientId"));

  await db.insert(growthRecords).values({
    patientId,
    recordDate: formData.get("recordDate") as string,
    weightKg: Number(formData.get("weightKg")),
    heightCm: Number(formData.get("heightCm")),
    // Removed 'notes' — not in schema
  });

  revalidatePath(`/patients/${patientId}`);
}