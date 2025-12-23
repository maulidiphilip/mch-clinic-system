"use client";

import { useState } from "react";
import { createGrowthRecord } from "@/actions/growthActions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Ruler, Scale, AlertTriangle, Plus } from "lucide-react";
import { format, differenceInMonths } from "date-fns";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

type Patient = { id: number; fullName: string; dateOfBirth: string | null };
type GrowthRecord = {
  id: number;
  recordDate: string;
  weightKg: number;
  heightCm: number;
  notes?: string | null;
};

// WHO demo medians
const approxWeightMedian = [3.3, 7.5, 9.5, 11, 12.5, 14, 15.5, 17, 18.5];
const approxHeightMedian = [50, 65, 75, 82, 88, 93, 98, 103, 108];

function approximateZScore(value: number, ageMonths: number, medians: number[]) {
  const index = Math.min(Math.floor(ageMonths / 6), medians.length - 1);
  const median = medians[index];
  const sdApprox = median * 0.12;
  return (value - median) / sdApprox;
}

export default function GrowthMonitoringTab({
  patient,
  growthRecords,
}: {
  patient: Patient;
  growthRecords: GrowthRecord[];
}) {
  const [open, setOpen] = useState(false);
  const birthDate = patient.dateOfBirth
    ? new Date(patient.dateOfBirth)
    : null;

  const data = growthRecords.map((r) => {
    const ageMonths = birthDate
      ? differenceInMonths(new Date(r.recordDate), birthDate)
      : 0;

    const weightZ = approximateZScore(
      r.weightKg,
      ageMonths,
      approxWeightMedian
    );
    const heightZ = approximateZScore(
      r.heightCm,
      ageMonths,
      approxHeightMedian
    );

    return {
      date: format(new Date(r.recordDate), "MMM yyyy"),
      weight: r.weightKg,
      height: r.heightCm,
      weightZ,
      heightZ,
    };
  });

  const hasMalnutrition = data.some(
    (d) => d.weightZ < -2 || d.heightZ < -2
  );

  return (
    <div className="space-y-10">

      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-semibold text-emerald-900">
            Growth Monitoring
          </h2>

          {hasMalnutrition && (
            <div className="mt-2 flex items-center gap-2 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
              <AlertTriangle className="h-4 w-4" />
              Signs of malnutrition detected — clinical follow-up required
            </div>
          )}
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
              <Plus className="h-4 w-4" />
              Record Measurement
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-emerald-900">
                Record Growth – {patient.fullName}
              </DialogTitle>
            </DialogHeader>

            <form
              action={async (formData) => {
                await createGrowthRecord(formData);
                setOpen(false);
              }}
              className="space-y-4"
            >
              <input type="hidden" name="patientId" value={patient.id} />

              <div>
                <Label>Measurement Date</Label>
                <Input type="date" name="recordDate" required />
              </div>

              <div>
                <Label>Weight (kg)</Label>
                <Input type="number" step="0.1" name="weightKg" required />
              </div>

              <div>
                <Label>Height (cm)</Label>
                <Input type="number" step="0.1" name="heightCm" required />
              </div>

              <div>
                <Label>Notes</Label>
                <Textarea name="notes" rows={3} />
              </div>

              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                Save Measurement
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Charts */}
      {growthRecords.length === 0 ? (
        <Card className="border-dashed border-emerald-200">
          <CardContent className="text-center py-14 text-emerald-600">
            No growth measurements recorded yet.
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-8 md:grid-cols-2">
            <Card className="border-emerald-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-emerald-900">
                  <Scale className="h-5 w-5" />
                  Weight-for-Age Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <ReferenceLine y={-2} stroke="#f59e0b" />
                    <ReferenceLine y={-3} stroke="#dc2626" />
                    <Line
                      type="monotone"
                      dataKey="weight"
                      stroke="#10b981"
                      strokeWidth={3}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-emerald-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-emerald-900">
                  <Ruler className="h-5 w-5" />
                  Height-for-Age Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <ReferenceLine y={-2} stroke="#f59e0b" />
                    <ReferenceLine y={-3} stroke="#dc2626" />
                    <Line
                      type="monotone"
                      dataKey="height"
                      stroke="#2563eb"
                      strokeWidth={3}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* History */}
          <Card className="border-emerald-200">
            <CardHeader>
              <CardTitle className="text-emerald-900">
                Measurement History
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {growthRecords.map((record) => {
                const ageMonths = birthDate
                  ? differenceInMonths(
                      new Date(record.recordDate),
                      birthDate
                    )
                  : 0;

                return (
                  <div
                    key={record.id}
                    className="flex justify-between border-b pb-4 text-sm"
                  >
                    <div>
                      <p className="font-medium">
                        {format(new Date(record.recordDate), "PPP")}
                      </p>
                      <p className="text-emerald-600">
                        Age: ~{ageMonths} months
                      </p>
                      <p>
                        Weight: {record.weightKg} kg | Height:{" "}
                        {record.heightCm} cm
                      </p>
                      {record.notes && (
                        <p className="text-emerald-700 mt-1">
                          {record.notes}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
