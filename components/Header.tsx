import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Users } from "lucide-react";

export default function Header() {
  return (
    <header className="border-b border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo & Title */}
          <Link href="/" className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-lg shadow-sm">
              <Image
                src="/Coat_of_arms_of_Malawi.svg"
                alt="MCH Clinic Logo"
                width={40}
                height={40}
              />
            </div>

            <div className="leading-tight">
              <h1 className="text-lg font-semibold text-emerald-900">
                MCH Clinic System
              </h1>
              <p className="text-xs text-emerald-700">
                Maternal & Child Health • Malawi 🇲🇼
              </p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm font-medium text-emerald-800 hover:text-emerald-600 transition"
            >
              <Home className="h-4 w-4" />
              Dashboard
            </Link>

            <Link
              href="/patients"
              className="flex items-center gap-2 text-sm font-medium text-emerald-800 hover:text-emerald-600 transition"
            >
              <Users className="h-4 w-4" />
              Patients
            </Link>
          </nav>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Button
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Menu
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
