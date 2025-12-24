import { Badge } from "@/components/ui/badge";
import { Baby, User, MapPin, Phone } from "lucide-react";
import Link from "next/link";

type PatientProps = {
  id: number;
  patientId: string;
  fullName: string;
  type: "mother" | "child";
  village: string | null;
  phone: string | null;
};

export default function PatientCard({ patient }: { patient: PatientProps }) {
  const isMother = patient.type === "mother";

  return (
    <div className="bg-white border border-emerald-200 rounded-xl p-5 hover:shadow-md transition">
      <div className="flex items-center gap-4 mb-4">
        <div
          className={`p-3 rounded-full ${
            isMother
              ? "bg-pink-100 text-pink-700"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          {isMother ? <Baby /> : <User />}
        </div>

        <div>
          <h3 className="font-semibold text-emerald-900">
            {patient.fullName}
          </h3>
          <Badge className="mt-1 bg-emerald-100 text-emerald-800">
            {isMother ? "Pregnant Mother" : "Child"}
          </Badge>
        </div>
      </div>

      <div className="space-y-2 text-sm text-emerald-700">
        {patient.village && (
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            {patient.village}
          </div>
        )}
        {patient.phone && (
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            {patient.phone}
          </div>
        )}
      </div>

      <Link
        href={`/patients/${patient.id}`}
        className="inline-block mt-4 text-emerald-700 font-medium hover:underline"
      >
        View Details →
      </Link>
    </div>
  );
}
