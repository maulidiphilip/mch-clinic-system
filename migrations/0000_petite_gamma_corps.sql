CREATE TABLE "anc_visits" (
	"id" serial PRIMARY KEY NOT NULL,
	"patient_id" integer NOT NULL,
	"visit_date" date NOT NULL,
	"gestational_age" integer,
	"weight" integer,
	"bp_systolic" integer,
	"bp_diastolic" integer,
	"fetal_heart_rate" integer,
	"risk_factors" jsonb,
	"next_appointment" date,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "growth_records" (
	"id" serial PRIMARY KEY NOT NULL,
	"patient_id" integer NOT NULL,
	"record_date" date NOT NULL,
	"weight_kg" integer,
	"height_cm" integer
);
--> statement-breakpoint
CREATE TABLE "immunizations" (
	"id" serial PRIMARY KEY NOT NULL,
	"patient_id" integer NOT NULL,
	"vaccine" text NOT NULL,
	"dose_date" date NOT NULL,
	"next_due_date" date
);
--> statement-breakpoint
CREATE TABLE "patients" (
	"id" serial PRIMARY KEY NOT NULL,
	"patient_id" text NOT NULL,
	"full_name" text NOT NULL,
	"date_of_birth" date,
	"phone" text,
	"village" text,
	"type" text NOT NULL,
	"guardian_name" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "patients_patient_id_unique" UNIQUE("patient_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"role" text DEFAULT 'health_worker',
	"name" text,
	"facility" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "anc_visits" ADD CONSTRAINT "anc_visits_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "growth_records" ADD CONSTRAINT "growth_records_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "immunizations" ADD CONSTRAINT "immunizations_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE no action ON UPDATE no action;