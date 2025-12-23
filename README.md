# Maternal and Child Health (MCH) Clinic Management System 🇲🇼

**A full-stack digital health application** designed to support frontline health workers in Malawi by digitizing antenatal care (ANC), immunization tracking, and child growth monitoring at the clinic level.

**Live Demo**: [Deploy on Vercel](https://your-project-name.vercel.app) *(replace with your actual link)*  
**GitHub Repository**: [github.com/maulidiphilip/mch-clinic-system](https://github.com/maulidiphilip/mch-clinic-system) *(update if needed)*  
**Portfolio**: [philip-maulidi-wqoz.vercel.app](https://philip-maulidi-wqoz.vercel.app)

## Project Overview

This standalone clinic management system addresses real challenges faced by rural and urban health facilities in Malawi:
- Paper-based registers leading to data loss and delays
- Difficulty tracking high-risk pregnancies and immunization defaulters
- Limited use of growth data for early malnutrition detection

The application provides a clean, intuitive digital alternative that empowers nurses, midwives, and Health Surveillance Assistants (HSAs) with tools for better patient care and reporting.

### Core Features
- **Patient Registration** with unique clinic IDs (e.g., MCH-2025-0001)
- **Antenatal Care (ANC)** module with clinical data capture and automatic high-risk flagging (hypertension, anemia, etc.)
- **Immunization Registry** following the full **Malawi EPI schedule** with age-based overdue and due-soon alerts
- **Growth Monitoring** with weight/height tracking, trend charts, and malnutrition detection (underweight/stunting)
- **FHIR R4 Interoperability** – One-click export of complete patient record as a standard **FHIR Bundle** (Patient, Encounter, Observation, Immunization, Condition)
- Search, filter, and pagination for scalable patient management (1000+ patients supported)
- Responsive, professional UI with Malawi health-sector green + white theme
- Built with modern, maintainable technologies

## Interoperability & Alignment with Malawi Digital Health Strategy

This project is intentionally designed with **national digital health priorities** in mind and directly supports the **Malawi Digital Health Strategy 2020–2025** and **Health Sector Strategic Plan III (2023–2030)**.

### Key Alignment Points:
- **Point-of-care data capture** for continuity of care
- **Structured clinical data** using international standards
- **FHIR R4 Bundle export** enables future integration with:
  - MaHIS Shared Health Record (SHR)
  - Master Patient Index (MPI)
  - National Electronic Immunization Registry (EIR)
  - OpenHIM-mediated exchange with DHIS2, OpenLMIS, laboratory/pharmacy systems
- Supports presidential priorities on maternal health and child survival through risk alerts and defaulter tracing

> **FHIR Export Feature**: Health workers can download a patient's full record as a standard FHIR JSON bundle — ready for submission to or integration with national systems via the interoperability layer.

## Social Impact

Malawi continues to face challenges in maternal and child health:
- Maternal mortality ratio: ~381 per 100,000 live births
- High rates of stunting and underweight in children under 5
- Immunization dropout and defaulter rates in rural areas

This system helps frontline workers:
- Identify high-risk pregnancies early
- Track immunization status and prevent dropouts
- Detect malnutrition through visual growth charts
- Generate cleaner, timely data for district and national reporting

By improving data quality and clinical decision-making at the facility level, this tool contributes to **SDG 3 (Good Health and Well-being)** and national efforts to achieve universal health coverage.

## Tech Stack
- **Framework**: Next.js 16 (App Router) with TypeScript
- **UI**: Tailwind CSS + shadcn/ui (accessible, beautiful components)
- **Database**: Neon Serverless PostgreSQL
- **ORM**: Drizzle ORM
- **Charts**: Recharts
- **State Management**: Server Actions + TanStack Query
- **Deployment**: Vercel
- **Interoperability**: Manual FHIR R4 Bundle export (no external dependencies)

## Screenshots
*(Add these after deployment)*
- Dashboard with clinic statistics
- Patient list with search and filters
- Detailed patient view with tabs and FHIR export button
- Immunization card with overdue alerts
- Growth monitoring charts

## Future Enhancements (Ready for Real-World Scale)
- Integration with national MaHIS via OpenHIM and FHIR APIs
- Offline PWA support for low-connectivity areas
- SMS reminders using local gateways (e.g., Africa's Talking)
- Aggregate reporting export in ADX format for DHIS2
- Role-based access (admin, nurse, HSA)

## Author

**Philip Maulidi**  
Full-Stack Developer | Digital Health Enthusiast | Zomba, Malawi

- GitHub: [github.com/maulidiphilip](https://github.com/maulidiphilip)
- Portfolio: [philip-maulidi-wqoz.vercel.app](https://philip-maulidi-wqoz.vercel.app)
- Email: maulidiphilip@gmail.com
- Phone: +265 991 103 578

> This project was built as a portfolio demonstration of real-world problem-solving in digital health, with direct relevance to Malawi's national health information system (MaHIS) and the work of the Digital Health Division at the Ministry of Health.

**Ready to contribute to Malawi's digital health transformation.**