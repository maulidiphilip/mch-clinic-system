"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db/drizzle";
import { immunizations } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getImmunizations(patientId: number) {
  return await db
    .select()
    .from(immunizations)
    .where(eq(immunizations.patientId, patientId))
    .orderBy(immunizations.doseDate);
}

export async function createImmunization(formData: FormData) {
  const patientId = Number(formData.get("patientId"));

  await db.insert(immunizations).values({
    patientId,
    vaccine: formData.get("vaccine") as string,
    doseDate: formData.get("doseDate") as string,
    nextDueDate: (formData.get("nextDueDate") as string) || null,
  });

  revalidatePath(`/patients/${patientId}`);
}