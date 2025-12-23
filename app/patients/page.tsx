import { getPatients } from "@/actions/patientActions";
import Pagination from "@/components/Pagination";
import PatientCard from "@/components/PatientCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";

const PATIENTS_PER_PAGE = 4;

export default async function PatientsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string; page?: string }>;
}) {
  const { q, type, page } = await searchParams;
  const search = q || "";
  const filterType = type || "all";
  const currentPage = Number(page) || 1;

  const allPatients = await getPatients();

  // Filter patients
  let filteredPatients = allPatients;
  if (search) {
    filteredPatients = allPatients.filter(
      (p) =>
        p.fullName.toLowerCase().includes(search.toLowerCase()) ||
        (p.village && p.village.toLowerCase().includes(search.toLowerCase())) ||
        p.patientId.toLowerCase().includes(search.toLowerCase())
    );
  }
  if (filterType !== "all") {
    filteredPatients = filteredPatients.filter((p) => p.type === filterType);
  }

  // Pagination
  const totalPatients = filteredPatients.length;
  const totalPages = Math.ceil(totalPatients / PATIENTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PATIENTS_PER_PAGE;
  const paginatedPatients = filteredPatients.slice(startIndex, startIndex + PATIENTS_PER_PAGE);

  return (
    <div className="min-h-screen bg-emerald-50 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-emerald-900">Patients Registry</h1>
          <p className="text-emerald-700 mt-1">
            {totalPatients} {totalPatients === 1 ? "patient" : "patients"} registered
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-emerald-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="search">Search by name, ID, or village</Label>
              <Input
                id="search"
                name="q"
                type="search"
                placeholder="e.g. Fatima or Namwera"
                defaultValue={search}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="type">Patient Type</Label>
              <Select name="type" defaultValue={filterType}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Patients</SelectItem>
                  <SelectItem value="mother">Pregnant Mothers</SelectItem>
                  <SelectItem value="child">Children</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-between items-center mt-6">
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium"
            >
              Apply Filters
            </button>

            <Link href="/patients/new">
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                + Register Patient
              </Button>
            </Link>
          </div>
        </div>

        {/* Patient Grid */}
        {paginatedPatients.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-emerald-100">
            <p className="text-xl font-medium text-emerald-700">No patients found</p>
            <p className="mt-2 text-emerald-600">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {paginatedPatients.map((patient) => (
                <PatientCard key={patient.id} patient={patient} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                search={search}
                filterType={filterType}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}