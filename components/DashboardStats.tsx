import { Baby, Users, UserPlus } from "lucide-react";

type Props = {
  mothers: number;
  children: number;
  total: number;
};

export default function DashboardStats({ mothers, children, total }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      
      {/* Mothers */}
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm hover:shadow-md transition">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-emerald-900">
            Registered Mothers
          </h3>
          <div className="p-2 rounded-full bg-emerald-100 text-emerald-700">
            <Baby className="h-5 w-5" />
          </div>
        </div>

        <p className="text-4xl font-bold text-emerald-700 mt-4">
          {mothers}
        </p>
        <p className="text-sm text-emerald-600 mt-1">
          Receiving antenatal care (ANC)
        </p>
      </div>

      {/* Children */}
      <div className="rounded-xl border border-green-200 bg-green-50 p-6 shadow-sm hover:shadow-md transition">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-green-900">
            Registered Children
          </h3>
          <div className="p-2 rounded-full bg-green-100 text-green-700">
            <Users className="h-5 w-5" />
          </div>
        </div>

        <p className="text-4xl font-bold text-green-700 mt-4">
          {children}
        </p>
        <p className="text-sm text-green-600 mt-1">
          Immunization & growth monitoring
        </p>
      </div>

      {/* Total */}
      <div className="rounded-xl border border-teal-200 bg-teal-50 p-6 shadow-sm hover:shadow-md transition">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-teal-900">
            Total Patients
          </h3>
          <div className="p-2 rounded-full bg-teal-100 text-teal-700">
            <UserPlus className="h-5 w-5" />
          </div>
        </div>

        <p className="text-4xl font-bold text-teal-700 mt-4">
          {total}
        </p>
        <p className="text-sm text-teal-600 mt-1">
          Active in the clinic system
        </p>
      </div>
    </div>
  );
}
