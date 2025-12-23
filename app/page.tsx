import { getPatients } from "@/actions/patientActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Baby, Users, UserPlus } from "lucide-react";
import Link from "next/link";

export default async function Home() {
  const patients = await getPatients();

  const mothers = patients.filter((p) => p.type === "mother").length;
  const children = patients.filter((p) => p.type === "child").length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        
        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-emerald-900 tracking-tight">
            MCH Clinic Dashboard 🇲🇼
          </h1>
          <p className="text-emerald-700 mt-2 max-w-2xl">
            Digitally managing maternal and child health services for improved
            care, follow-up, and reporting.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-3 mb-14">
          
          {/* Mothers */}
          <Card className="border-emerald-200 shadow-sm hover:shadow-md transition">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-emerald-800">
                Registered Mothers
              </CardTitle>
              <div className="p-2 rounded-full bg-emerald-100 text-emerald-700">
                <Baby className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-900">
                {mothers}
              </div>
              <p className="text-xs text-emerald-600 mt-1">
                Receiving antenatal care (ANC)
              </p>
            </CardContent>
          </Card>

          {/* Children */}
          <Card className="border-emerald-200 shadow-sm hover:shadow-md transition">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-emerald-800">
                Registered Children
              </CardTitle>
              <div className="p-2 rounded-full bg-green-100 text-green-700">
                <Users className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-900">
                {children}
              </div>
              <p className="text-xs text-emerald-600 mt-1">
                Immunization & growth monitoring
              </p>
            </CardContent>
          </Card>

          {/* Total */}
          <Card className="border-emerald-200 shadow-sm hover:shadow-md transition">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-emerald-800">
                Total Patients
              </CardTitle>
              <div className="p-2 rounded-full bg-teal-100 text-teal-700">
                <UserPlus className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-900">
                {patients.length}
              </div>
              <p className="text-xs text-emerald-600 mt-1">
                Active in the clinic system
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="flex justify-center">
          <Link href="/patients">
            <Button
              size="lg"
              className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
            >
              <UserPlus className="h-5 w-5" />
              Manage Patients
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
}
