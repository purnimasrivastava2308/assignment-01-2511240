# Design Justification — AI-Powered Hospital Network Data System

---

## Storage Systems

### Mapping Each Goal to the Right Architecture

The hospital network has four distinct goals, each demanding a different storage strategy.

**Goal 1 — Predict Patient Readmission Risk**
Historical treatment data is structured, voluminous, and read-heavy — a classic OLAP workload. A **Data Warehouse** is the right fit: it stores clean, schema-defined records of past diagnoses, medications, and admissions, and supports the complex aggregation queries that feed a readmission prediction model. Since this data is historical and rarely updated, the warehouse's **optimised read performance** is exactly what ML pipelines need.

**Goal 2 — Allow Doctors to Query Patient History in Plain English**
Doctors won't search by patient ID or field names — they'll ask questions like *"What treatments did this patient receive for hypertension in 2022?"* A **Vector Database** is the right architecture here. Medical notes, discharge summaries, and treatment records are embedded as semantic vectors, enabling **similarity-based retrieval** that matches the meaning of a query, not just the exact keywords.

**Goal 3 — Generate Monthly Management Reports**
Bed occupancy, department-wise costs, and utilisation trends involve **bulk, mixed-format data** — structured billing records alongside semi-structured operational logs. A **Data Lakehouse** provides low-cost storage with enough structure for periodic analytical reporting, making it the practical choice for management dashboards without the high cost of a full Data Warehouse.

**Goal 4 — Stream and Store Real-Time Patient Vitals**
Live vitals — heart rate, blood pressure, oxygen levels — must be captured **instantly and without data loss**. This is a pure **OLTP** workload: high-frequency, low-latency writes with strict transactional integrity. Any delay or missed write here carries direct clinical risk.

---

## OLTP vs OLAP Boundary

### Where Transactions End and Analysis Begins

The **boundary sits between data capture and data use.**

The **OLTP layer** — handling real-time vitals and active patient records — is optimised for fast, consistent writes. It is deliberately kept separate from any analytical workload. Running complex queries directly against the OLTP system causes **lock contention, performance degradation, and latency spikes** — in a live hospital setting, that translates to delayed vital sign updates, which is unacceptable.

Once data is stable and no longer actively written, it is **extracted and loaded into the OLAP layer** — the Data Warehouse and Data Lakehouse — where it is structured and made available for reporting, trend analysis, and model training. This clean separation ensures **neither system degrades the other's performance.**

---

## Trade-offs

### The CAP Dilemma — Consistency vs Availability

The most significant trade-off is rooted in the **CAP theorem**. A hospital system cannot tolerate inconsistent data — a doctor reading a stale medication record or an outdated allergy flag could cause direct patient harm. **Consistency is therefore non-negotiable.**

The design prioritises **Consistency + Partition Tolerance (CP)**, which means accepting that during a rare network partition, the system may become **briefly unavailable rather than serve potentially outdated data.** Availability is the deliberate sacrifice.