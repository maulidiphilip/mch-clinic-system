"use client";

import { useState } from "react";
import { createGrowthRecord } from "@/actions/growthActions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// Removed unused Textarea import
import { AlertTriangle } from "lucide-react";
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
  weightKg: number | null;
  heightCm: number | null;
};

const approxWeightMedian = [3.3, 7.5, 9.5, 11, 12.5, 14, 15.5, 17, 18.5];
const approxHeightMedian = [50, 65, 75, 82, 88, 93, 98, 103, 108];

function approximateZScore(value: number | null, ageMonths: number, medians: number[]) {
  if (value === null) return null;
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

  const birthDate = patient.dateOfBirth ? new Date(patient.dateOfBirth) : null;

  const data = growthRecords
    .map((r) => {
      const ageMonths = birthDate ? differenceInMonths(new Date(r.recordDate), birthDate) : 0;
      const weightZ = approximateZScore(r.weightKg, ageMonths, approxWeightMedian);
      const heightZ = approximateZScore(r.heightCm, ageMonths, approxHeightMedian);

      if (r.weightKg === null && r.heightCm === null) return null;

      return {
        date: format(new Date(r.recordDate), "MMM yyyy"),
        ageMonths,
        weight: r.weightKg ?? undefined,
        height: r.heightCm ?? undefined,
        weightZ: weightZ !== null ? weightZ.toFixed(1) : "-",
        heightZ: heightZ !== null ? heightZ.toFixed(1) : "-",
        weightFlag: weightZ !== null && weightZ < -2 ? (weightZ < -3 ? "severe" : "moderate") : "normal",
        heightFlag: heightZ !== null && heightZ < -2 ? (heightZ < -3 ? "severe" : "moderate") : "normal",
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  // Fixed: No more 'any' — proper typing
  const hasMalnutrition = data.some(
    (d) => d.weightFlag !== "normal" || d.heightFlag !== "normal"
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Growth Monitoring</h2>
          {hasMalnutrition && (
            <div className="mt-2 inline-flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2 rounded-lg">
              <AlertTriangle className="h-4 w-4" />
              <span className="font-medium">Malnutrition Detected</span>
            </div>
          )}
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              Record Growth Measurement
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Record Growth – {patient.fullName}</DialogTitle>
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

              <Button type="submit" className="w-full">
                Save Measurement
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {growthRecords.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12 text-muted-foreground">
            No growth measurements recorded yet.
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-8 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Weight-for-Age Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <ReferenceLine y={-2} stroke="orange" label="Moderate" />
                    <ReferenceLine y={-3} stroke="red" label="Severe" />
                    <Line
                      type="monotone"
                      dataKey="weight"
                      stroke="#10b981"
                      strokeWidth={3}
                      dot={{ fill: "#10b981" }}
                      name="Weight (kg)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Height-for-Age Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <ReferenceLine y={-2} stroke="orange" label="Moderate" />
                    <ReferenceLine y={-3} stroke="red" label="Severe" />
                    <Line
                      type="monotone"
                      dataKey="height"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      dot={{ fill: "#3b82f6" }}
                      name="Height (cm)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Measurement History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {growthRecords.map((record) => {
                  const ageMonths = birthDate
                    ? differenceInMonths(new Date(record.recordDate), birthDate)
                    : 0;
                  const weightZ = approximateZScore(record.weightKg, ageMonths, approxWeightMedian);
                  const heightZ = approximateZScore(record.heightCm, ageMonths, approxHeightMedian);

                  return (
                    <div key={record.id} className="flex justify-between items-start border-b pb-4">
                      <div>
                        <p className="font-medium">{format(new Date(record.recordDate), "PPP")}</p>
                        <p className="text-sm text-muted-foreground">
                          Age: ~{ageMonths} months
                        </p>
                        <p>
                          Weight: {record.weightKg ?? "-"} kg | Height: {record.heightCm ?? "-"} cm
                        </p>
                      </div>
                      <div className="text-right space-y-1 text-sm">
                        <div>
                          Weight Z-score: {weightZ !== null ? weightZ.toFixed(1) : "-"}
                          {weightZ !== null && weightZ < -2 && (
                            <span className="ml-2 text-red-600 font-medium">Underweight</span>
                          )}
                        </div>
                        <div>
                          Height Z-score: {heightZ !== null ? heightZ.toFixed(1) : "-"}
                          {heightZ !== null && heightZ < -2 && (
                            <span className="ml-2 text-red-600 font-medium">Stunted</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}