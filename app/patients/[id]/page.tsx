import { getPatient } from "@/actions/patientActions";
import { getAncVisits } from "@/actions/ancActions";
import { getImmunizations } from "@/actions/immunizationActions";
import { getGrowthRecords } from "@/actions/growthActions";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Baby, AlertTriangle, User } from "lucide-react";
import Link from "next/link";

import AncVisitsTab from "@/components/AncVisitsTab";
import ImmunizationsTab from "@/components/ImmunizationsTab";
import GrowthMonitoringTab from "@/components/GrowthMonitoringTab";
import FhirExportButton from "@/components/FhirExportButton"; 

export default async function PatientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const patientId = Number(id);

  if (isNaN(patientId)) {
    return (
      <div className="p-10 text-center text-lg text-muted-foreground">
        Invalid patient ID
      </div>
    );
  }

  const patient = await getPatient(patientId);

  if (!patient) {
    return (
      <div className="p-10 text-center text-lg text-muted-foreground">
        Patient not found
      </div>
    );
  }

  const ancVisits =
    patient.type === "mother" ? await getAncVisits(patientId) : [];
  const immunizations =
    patient.type === "child" ? await getImmunizations(patientId) : [];
  const growthRecords =
    patient.type === "child" ? await getGrowthRecords(patientId) : [];

  const hasHighRisk =
    patient.type === "mother" &&
    ancVisits.some(
      (v: any) =>
        (v.bpSystolic && v.bpSystolic >= 140) ||
        (v.bpDiastolic && v.bpDiastolic >= 90) ||
        (v.riskFactors && v.riskFactors.length > 0)
    );

  return (
    <div className="min-h-screen bg-emerald-50 text-slate-900">
      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/patients"
          className="text-emerald-700 hover:text-emerald-900 hover:underline inline-block mb-6 text-sm font-medium"
        >
          ← Back to Patients
        </Link>

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-10">
          <div className="flex items-center gap-5">
            <div
              className={`rounded-full p-4 ${
                patient.type === "mother"
                  ? "bg-pink-100 text-pink-700"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {patient.type === "mother" ? (
                <Baby className="h-12 w-12" />
              ) : (
                <User className="h-12 w-12" />
              )}
            </div>

            <div>
              <h1 className="text-4xl font-bold text-emerald-900">
                {patient.fullName}
              </h1>
              <p className="text-emerald-700 mt-1 text-lg">
                {patient.patientId} • {patient.village || "Village not recorded"}
              </p>
            </div>
          </div>

          {/* Right side: Risk Badge + Export Button */}
          <div className="flex flex-col sm:items-end gap-4">
            {patient.type === "mother" && hasHighRisk && (
              <div className="flex items-center gap-2 bg-red-50 text-red-700 px-5 py-3 rounded-xl border border-red-200">
                <AlertTriangle className="h-5 w-5" />
                <span className="font-semibold">High-Risk Pregnancy</span>
              </div>
            )}

            {/* FHIR Export Button */}
            <FhirExportButton
              patient={patient}
              ancVisits={ancVisits}
              immunizations={immunizations}
              growthRecords={growthRecords}
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs
          defaultValue={
            patient.type === "mother"
              ? "anc"
              : patient.type === "child"
              ? "immunization"
              : "anc"
          }
          className="w-full"
        >
          <TabsList className="grid grid-cols-3 w-full mb-8 bg-emerald-100">
            <TabsTrigger value="anc" disabled={patient.type !== "mother"}>
              ANC Visits
            </TabsTrigger>
            <TabsTrigger value="immunization" disabled={patient.type !== "child"}>
              Immunizations
            </TabsTrigger>
            <TabsTrigger value="growth" disabled={patient.type !== "child"}>
              Growth Monitoring
            </TabsTrigger>
          </TabsList>

          <TabsContent value="anc">
            {patient.type === "mother" && (
              <AncVisitsTab patient={patient} ancVisits={ancVisits} />
            )}
          </TabsContent>

          <TabsContent value="immunization">
            {patient.type === "child" && (
              <ImmunizationsTab patient={patient} immunizations={immunizations} />
            )}
          </TabsContent>

          <TabsContent value="growth">
            {patient.type === "child" && (
              <GrowthMonitoringTab
                patient={patient}
                growthRecords={growthRecords}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}