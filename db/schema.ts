import { pgTable, serial, text, timestamp, date, integer, boolean, jsonb } from "drizzle-orm/pg-core";

// Users table - linked to Clerk later, but minimal for now
export const users = pgTable("users", {
  id: text("id").primaryKey(), // Clerk userId
  role: text("role").$type<"admin" | "health_worker">().default("health_worker"),
  name: text("name"),
  facility: text("facility"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Patients
export const patients = pgTable("patients", {
  id: serial("id").primaryKey(),
  patientId: text("patient_id").unique().notNull(), // e.g., MCH-2025-0001
  fullName: text("full_name").notNull(),
  dateOfBirth: date("date_of_birth"),
  phone: text("phone"),
  village: text("village"),
  type: text("type").$type<"mother" | "child">().notNull(), // mother = ANC, child = immunization/growth
  guardianName: text("guardian_name"), // for children
  createdAt: timestamp("created_at").defaultNow(),
});

// ANC Visits
export const ancVisits = pgTable("anc_visits", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").references(() => patients.id).notNull(),
  visitDate: date("visit_date").notNull(),
  gestationalAge: integer("gestational_age"), // weeks
  weight: integer("weight"), // kg
  bpSystolic: integer("bp_systolic"),
  bpDiastolic: integer("bp_diastolic"),
  fetalHeartRate: integer("fetal_heart_rate"),
  riskFactors: jsonb("risk_factors").$type<string[]>(),
  nextAppointment: date("next_appointment"),
  notes: text("notes"),
});

// Immunizations
export const immunizations = pgTable("immunizations", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").references(() => patients.id).notNull(),
  vaccine: text("vaccine").notNull(), // "BCG", "OPV 0", "Penta 1", etc.
  doseDate: date("dose_date").notNull(),
  nextDueDate: date("next_due_date"),
});

// Growth Records
export const growthRecords = pgTable("growth_records", {
  id: serial("id").primaryKey(),
  patientId: integer("patient_id").references(() => patients.id).notNull(),
  recordDate: date("record_date").notNull(),
  weightKg: integer("weight_kg"),
  heightCm: integer("height_cm"),
});