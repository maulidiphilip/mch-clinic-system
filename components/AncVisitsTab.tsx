"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar, Plus } from "lucide-react";
import { format } from "date-fns";
import { createAncVisit } from "@/actions/ancActions";

type Patient = { id: number; fullName: string };
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

export default function AncVisitsTab({
  patient,
  ancVisits,
}: {
  patient: Patient;
  ancVisits: AncVisit[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-emerald-900">
          ANC Visit History
          <span className="ml-2 text-sm text-emerald-600">
            ({ancVisits.length})
          </span>
        </h2>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
              <Plus className="h-4 w-4" />
              Record ANC Visit
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-emerald-900">
                Record ANC Visit – {patient.fullName}
              </DialogTitle>
            </DialogHeader>

            <form
              action={async (formData) => {
                await createAncVisit(formData);
                setOpen(false);
              }}
              className="space-y-6"
            >
              <input type="hidden" name="patientId" value={patient.id} />

              {/* Clinical Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Visit Date</Label>
                  <Input type="date" name="visitDate" required />
                </div>

                <div>
                  <Label>Gestational Age (weeks)</Label>
                  <Input type="number" name="gestationalAge" placeholder="e.g. 28" />
                </div>

                <div>
                  <Label>Weight (kg)</Label>
                  <Input type="number" step="0.1" name="weight" />
                </div>

                <div>
                  <Label>Fetal Heart Rate (bpm)</Label>
                  <Input type="number" name="fetalHeartRate" />
                </div>

                <div>
                  <Label>BP Systolic</Label>
                  <Input type="number" name="bpSystolic" />
                </div>

                <div>
                  <Label>BP Diastolic</Label>
                  <Input type="number" name="bpDiastolic" />
                </div>
              </div>

              <div>
                <Label>Risk Factors</Label>
                <Input
                  name="riskFactors"
                  placeholder="e.g. hypertension, anemia, malaria"
                />
              </div>

              <div>
                <Label>Next Appointment Date</Label>
                <Input type="date" name="nextAppointment" />
              </div>

              <div>
                <Label>Clinical Notes</Label>
                <Textarea name="notes" rows={4} />
              </div>

              <Button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Save ANC Visit
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Visit List */}
      {ancVisits.length === 0 ? (
        <Card className="border-dashed border-emerald-200">
          <CardContent className="text-center py-14 text-emerald-600">
            No ANC visits recorded yet.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {ancVisits.map((visit: any) => {
            const isHighBp =
              (visit.bpSystolic && visit.bpSystolic >= 140) ||
              (visit.bpDiastolic && visit.bpDiastolic >= 90);

            return (
              <Card
                key={visit.id}
                className={`shadow-sm ${
                  isHighBp
                    ? "border-red-300 bg-red-50"
                    : "border-emerald-200"
                }`}
              >
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <p className="text-lg font-medium text-emerald-900">
                      {format(new Date(visit.visitDate), "PPP")}
                    </p>

                    <div className="flex gap-2">
                      {isHighBp && (
                        <Badge className="bg-red-600 text-white">
                          High BP
                        </Badge>
                      )}
                      {visit.riskFactors?.length > 0 && (
                        <Badge className="bg-orange-500 text-white">
                          Risk Factors
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-emerald-900">
                  <div><span className="font-medium">GA:</span> {visit.gestationalAge || "-"} wks</div>
                  <div><span className="font-medium">Weight:</span> {visit.weight || "-"} kg</div>
                  <div><span className="font-medium">BP:</span> {visit.bpSystolic || "-"}/{visit.bpDiastolic || "-"}</div>
                  <div><span className="font-medium">FHR:</span> {visit.fetalHeartRate || "-"} bpm</div>

                  {visit.nextAppointment && (
                    <div className="col-span-2 md:col-span-4 text-emerald-700">
                      <Calendar className="inline h-4 w-4 mr-1" />
                      <span className="font-medium">Next Visit:</span>{" "}
                      {format(new Date(visit.nextAppointment), "PPP")}
                    </div>
                  )}

                  {visit.notes && (
                    <div className="col-span-2 md:col-span-4 text-emerald-700">
                      <span className="font-medium">Notes:</span> {visit.notes}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
