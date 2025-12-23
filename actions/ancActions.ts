"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db/drizzle";
import { ancVisits } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getAncVisits(patientId: number) {
  return await db
    .select()
    .from(ancVisits)
    .where(eq(ancVisits.patientId, patientId))
    .orderBy(ancVisits.visitDate);
}

export async function createAncVisit(formData: FormData) {
  const patientId = Number(formData.get("patientId"));

  const riskFactorsRaw = formData.get("riskFactors") as string;
  const riskFactors = riskFactorsRaw
    ? riskFactorsRaw.split(",").map((s) => s.trim())
    : [];

  await db.insert(ancVisits).values({
    patientId,
    visitDate: formData.get("visitDate") as string,
    gestationalAge:
      formData.get("gestationalAge")
        ? Number(formData.get("gestationalAge"))
        : null,
    weight:
      formData.get("weight") ? Number(formData.get("weight")) : null,
    bpSystolic:
      formData.get("bpSystolic")
        ? Number(formData.get("bpSystolic"))
        : null,
    bpDiastolic:
      formData.get("bpDiastolic")
        ? Number(formData.get("bpDiastolic"))
        : null,
    fetalHeartRate:
      formData.get("fetalHeartRate")
        ? Number(formData.get("fetalHeartRate"))
        : null,
    riskFactors: riskFactors.length > 0 ? riskFactors : null,
    nextAppointment: (formData.get("nextAppointment") as string) || null,
    notes: (formData.get("notes") as string) || null,
  });

  revalidatePath(`/patients/${patientId}`);
}