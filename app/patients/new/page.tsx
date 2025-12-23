import { createPatient } from "@/actions/patientActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function NewPatientPage() {
  return (
    <div className="min-h-screen bg-emerald-50 text-slate-900">
  <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-emerald-900 mb-8">
          Register New Patient
        </h1>

        <form
          action={createPatient}
          className="bg-white border border-emerald-200 rounded-2xl p-8 space-y-6 shadow-sm"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div>
              <Label className="text-slate-700">Patient Type</Label>
              <select
                name="type"
                required
                className="mt-1 w-full px-4 py-3 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">Select type</option>
                <option value="mother">Pregnant Mother (ANC)</option>
                <option value="child">Child (Immunization & Growth)</option>
              </select>
            </div>

            <div>
              <Label className="text-slate-700">Full Name</Label>
              <Input name="fullName" required className="bg-white" />
            </div>

            <div>
              <Label className="text-slate-700">Village / TA</Label>
              <Input name="village" className="bg-white" />
            </div>

            <div>
              <Label className="text-slate-700">Phone Number</Label>
              <Input name="phone" className="bg-white" />
            </div>

            <div>
              <Label className="text-slate-700">Date of Birth</Label>
              <Input name="dateOfBirth" type="date" className="bg-white" />
            </div>

            <div>
              <Label className="text-slate-700">
                Guardian Name <span className="text-xs">(for children)</span>
              </Label>
              <Input name="guardianName" className="bg-white" />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
              Register Patient
            </Button>

            <Link href="/patients">
              <Button
                type="button"
                variant="outline"
                className="border-emerald-300 text-emerald-700"
              >
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
