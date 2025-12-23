"use client";

import { useState } from "react";
import { createImmunization } from "@/actions/immunizationActions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Syringe,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { format, differenceInDays } from "date-fns";

type Patient = {
  id: number;
  fullName: string;
  dateOfBirth: string | null;
};

type Immunization = {
  id: number;
  vaccine: string;
  doseDate: string;
  nextDueDate: string | null;
};

// Malawi EPI Schedule
const epiSchedule = [
  { ageDays: 0, label: "At Birth", vaccines: ["BCG", "OPV 0"] },
  { ageDays: 42, label: "6 Weeks", vaccines: ["Penta 1", "OPV 1", "PCV 1", "Rota 1"] },
  { ageDays: 70, label: "10 Weeks", vaccines: ["Penta 2", "OPV 2", "PCV 2", "Rota 2"] },
  { ageDays: 98, label: "14 Weeks", vaccines: ["Penta 3", "OPV 3", "PCV 3"] },
  { ageDays: 270, label: "9 Months", vaccines: ["MR 1"] },
  { ageDays: 547, label: "15–18 Months", vaccines: ["MR 2"] },
];

const allVaccines = epiSchedule.flatMap(s => s.vaccines);

export default function ImmunizationsTab({
  patient,
  immunizations,
}: {
  patient: Patient;
  immunizations: Immunization[];
}) {
  const [open, setOpen] = useState(false);

  const today = new Date();
  const birthDate = patient.dateOfBirth
    ? new Date(patient.dateOfBirth)
    : null;
  const childAgeDays = birthDate
    ? differenceInDays(today, birthDate)
    : null;

  const recordedMap = new Map<string, string>();
  immunizations.forEach(i =>
    recordedMap.set(i.vaccine, i.doseDate)
  );

  const getVaccineStatus = (vaccine: string, targetAgeDays: number) => {
    if (!childAgeDays) return "unknown";
    if (recordedMap.has(vaccine)) return "complete";
    if (childAgeDays >= targetAgeDays - 7 && childAgeDays < targetAgeDays + 30)
      return "due-soon";
    if (childAgeDays >= targetAgeDays + 30) return "overdue";
    return "pending";
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-green-800">
            Immunization Record
          </h2>
          {birthDate && (
            <p className="text-sm text-green-700 mt-1">
              Age: {Math.floor(childAgeDays! / 30)} months ({childAgeDays} days)
            </p>
          )}
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <Syringe className="h-4 w-4 mr-2" />
              Record Vaccine Dose
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                Record Vaccine – {patient.fullName}
              </DialogTitle>
            </DialogHeader>

            <form
              action={async formData => {
                await createImmunization(formData);
                setOpen(false);
              }}
              className="space-y-4"
            >
              <input type="hidden" name="patientId" value={patient.id} />

              <div className="space-y-1">
                <Label>Vaccine</Label>
                <select
                  name="vaccine"
                  required
                  className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-green-600"
                >
                  <option value="">Select vaccine</option>
                  {allVaccines.map(v => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <Label>Date Given</Label>
                <Input
                  type="date"
                  name="doseDate"
                  max={format(today, "yyyy-MM-dd")}
                  required
                />
              </div>

              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                Save Dose
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Schedule Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {epiSchedule.map(slot => {
          const statuses = slot.vaccines.map(v =>
            getVaccineStatus(v, slot.ageDays)
          );

          const hasOverdue = statuses.includes("overdue");
          const hasDueSoon = statuses.includes("due-soon");
          const allComplete = statuses.every(s => s === "complete");

          return (
            <Card
              key={slot.label}
              className={`rounded-2xl shadow-sm
                ${hasOverdue && "border-red-400"}
                ${hasDueSoon && "border-yellow-400"}
                ${allComplete && "border-green-500"}
              `}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-lg">
                  <span>{slot.label}</span>

                  {hasOverdue ? (
                    <Badge variant="destructive" className="gap-1">
                      <AlertCircle className="h-3 w-3" />
                      Overdue
                    </Badge>
                  ) : hasDueSoon ? (
                    <Badge className="bg-yellow-500 text-white">
                      Due Soon
                    </Badge>
                  ) : allComplete ? (
                    <Badge className="bg-green-600 text-white gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Complete
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Pending</Badge>
                  )}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-3">
                {slot.vaccines.map(vaccine => {
                  const doseDate = recordedMap.get(vaccine);
                  const status = getVaccineStatus(vaccine, slot.ageDays);

                  return (
                    <div
                      key={vaccine}
                      className="flex justify-between items-center text-sm"
                    >
                      <span>{vaccine}</span>

                      {doseDate ? (
                        <span className="text-green-700 font-medium">
                          {format(new Date(doseDate), "dd MMM yyyy")}
                        </span>
                      ) : status === "overdue" ? (
                        <span className="text-red-600 font-medium">
                          Overdue
                        </span>
                      ) : status === "due-soon" ? (
                        <span className="text-yellow-600 font-medium">
                          Due Soon
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Full History */}
      {immunizations.length > 0 && (
        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle>All Recorded Doses</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {immunizations.map(dose => (
              <div
                key={dose.id}
                className="flex justify-between text-sm border-b pb-2"
              >
                <span className="font-medium">{dose.vaccine}</span>
                <span>{format(new Date(dose.doseDate), "PPP")}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
