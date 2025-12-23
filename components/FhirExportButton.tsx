"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

type PatientFull = {
  id: number;
  patientId: string;
  fullName: string;
  dateOfBirth: string | null;
  phone: string | null;
  village: string | null;
  type: "mother" | "child";
};

type AncVisit = {
  id: number;
  visitDate: string;
  gestationalAge: number | null;
  weight: number | null;
  bpSystolic: number | null;
  bpDiastolic: number | null;
  fetalHeartRate: number | null;
  riskFactors: string[] | null;
  notes: string | null;
};

type Immunization = {
  id: number;
  vaccine: string;
  doseDate: string;
};

type GrowthRecord = {
  id: number;
  recordDate: string;
  weightKg: number | null;
  heightCm: number | null;
};

type Props = {
  patient: PatientFull;
  ancVisits: AncVisit[];
  immunizations: Immunization[];
  growthRecords: GrowthRecord[];
};

export default function FhirExportButton({
  patient,
  ancVisits,
  immunizations,
  growthRecords,
}: Props) {
  const generateFhirBundle = () => {
    const entries: any[] = [];

    // 1. Patient Resource
    entries.push({
      fullUrl: `Patient/${patient.patientId}`,
      resource: {
        resourceType: "Patient",
        id: patient.patientId,
        identifier: [
          { system: "http://moh.mw/mchis/id", value: patient.patientId },
        ],
        name: [{ text: patient.fullName }],
        birthDate: patient.dateOfBirth || undefined,
        telecom: patient.phone
          ? [{ system: "phone", value: patient.phone }]
          : [],
        address: patient.village ? [{ text: patient.village }] : [],
      },
    });

    // 2. ANC Encounters & Observations (mothers only)
    if (patient.type === "mother") {
      ancVisits.forEach((visit) => {
        const encounterId = `anc-encounter-${visit.id}`;
        entries.push({
          fullUrl: `Encounter/${encounterId}`,
          resource: {
            resourceType: "Encounter",
            id: encounterId,
            status: "finished",
            class: { code: "AMB", display: "ambulatory" },
            type: [{ text: "Antenatal Care Visit" }],
            subject: { reference: `Patient/${patient.patientId}` },
            period: { start: visit.visitDate },
          },
        });

        // Vital signs as Observations
        const addObs = (
          loinc: string,
          display: string,
          value?: number,
          unit?: string
        ) => {
          if (value !== null && value !== undefined) {
            entries.push({
              fullUrl: `Observation/anc-${loinc}-${visit.id}`,
              resource: {
                resourceType: "Observation",
                status: "final",
                code: {
                  coding: [
                    { system: "http://loinc.org", code: loinc, display },
                  ],
                },
                subject: { reference: `Patient/${patient.patientId}` },
                encounter: { reference: `Encounter/${encounterId}` },
                effectiveDateTime: visit.visitDate,
                valueQuantity: unit
                  ? { value, unit, system: "http://unitsofmeasure.org" }
                  : undefined,
              },
            });
          }
        };

        addObs("29463-7", "Body weight", visit.weight ?? undefined, "kg");
        addObs(
          "8480-6",
          "Systolic blood pressure",
          visit.bpSystolic ?? undefined,
          "mm[Hg]"
        );
        addObs(
          "8462-4",
          "Diastolic blood pressure",
          visit.bpDiastolic ?? undefined,
          "mm[Hg]"
        );
        addObs(
          "9279-1",
          "Fetal heart rate",
          visit.fetalHeartRate ?? undefined,
          "/min"
        );
        if (visit.gestationalAge) {
          addObs("11884-4", "Gestational age", visit.gestationalAge, "wk");
        }

        // Risk factors as Conditions
        if (visit.riskFactors?.length) {
          visit.riskFactors.forEach((risk, idx) => {
            entries.push({
              fullUrl: `Condition/risk-${visit.id}-${idx}`,
              resource: {
                resourceType: "Condition",
                clinicalStatus: { coding: [{ code: "active" }] },
                code: { text: risk },
                subject: { reference: `Patient/${patient.patientId}` },
                recordedDate: visit.visitDate,
              },
            });
          });
        }
      });
    }

    // 3. Immunizations (children only)
    immunizations.forEach((imm) => {
      entries.push({
        fullUrl: `Immunization/${imm.id}`,
        resource: {
          resourceType: "Immunization",
          status: "completed",
          vaccineCode: { text: imm.vaccine },
          patient: { reference: `Patient/${patient.patientId}` },
          occurrenceDateTime: imm.doseDate,
        },
      });
    });

    // 4. Growth measurements (children only)
    growthRecords.forEach((growth) => {
      entries.push({
        fullUrl: `Observation/weight-${growth.id}`,
        resource: {
          resourceType: "Observation",
          status: "final",
          code: {
            coding: [
              {
                system: "http://loinc.org",
                code: "29463-7",
                display: "Body weight",
              },
            ],
          },
          subject: { reference: `Patient/${patient.patientId}` },
          effectiveDateTime: growth.recordDate,
          valueQuantity: { value: growth.weightKg ?? 0, unit: "kg" },
        },
      });
      entries.push({
        fullUrl: `Observation/height-${growth.id}`,
        resource: {
          resourceType: "Observation",
          status: "final",
          code: {
            coding: [
              {
                system: "http://loinc.org",
                code: "8302-2",
                display: "Body height",
              },
            ],
          },
          subject: { reference: `Patient/${patient.patientId}` },
          effectiveDateTime: growth.recordDate,
          valueQuantity: { value: growth.heightCm, unit: "cm" },
        },
      });
    });

    const bundle = {
      resourceType: "Bundle",
      type: "collection",
      timestamp: new Date().toISOString(),
      entry: entries,
    };

    const jsonString = JSON.stringify(bundle, null, 2);
    const blob = new Blob([jsonString], { type: "application/fhir+json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${patient.fullName.replace(/\s+/g, "_")}_FHIR_Bundle.json`;
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <Button onClick={generateFhirBundle} size="lg" className="gap-3">
      <Download className="h-5 w-5" />
      Export as FHIR Bundle
    </Button>
  );
}
