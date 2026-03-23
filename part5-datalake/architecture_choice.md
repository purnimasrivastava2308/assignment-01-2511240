# Architecture Choice — Storage Recommendation for a Food Delivery Startup

---

## Architecture Recommendation

---

## The Data Problem First

A fast-growing food delivery startup doesn't generate one type of data — it generates **four fundamentally different ones** simultaneously:

| Data Type | Format | Volume |
|---|---|---|
| GPS location logs | Structured coordinates | Very High |
| Customer text reviews | Unstructured text | High |
| Payment transactions | Structured, time-sensitive | High |
| Restaurant menu images | Binary / unstructured | High |

No single traditional architecture handles all four cleanly. **A Data Warehouse is too rigid. A Data Lake is too raw. The right answer is a Data Lakehouse.**

---

## Recommendation — Data Lakehouse

### Reason 1 — Mixed Data Formats Demand Flexibility

A Data Warehouse only accepts **structured, schema-defined data** — it cannot store raw images, free-form reviews, or coordinate logs without costly pre-processing. A Data Lake accepts everything but offers **no query or analytics layer**. The Lakehouse stores all four data types — structured, semi-structured, and binary — **without forcing premature transformation**, while still making them queryable when needed.

### Reason 2 — Low Storage Cost at Scale

GPS logs, images, and reviews compound fast. A Data Warehouse at that volume becomes **prohibitively expensive**. The Lakehouse inherits the **low-cost object storage model of a Data Lake** — keeping infrastructure costs manageable as the startup scales, without sacrificing analytical capability.

### Reason 3 — High-Velocity Updates for Real-Time Data

**Payment transactions and customer reviews cannot wait.** A new review should be visible to the next customer within seconds; a failed payment must sync immediately. The Lakehouse architecture supports **high-velocity ingestion and near-real-time updates** — something a traditional warehouse pipeline, with its scheduled batch loads, cannot reliably deliver.

---

## Verdict

> A Data Lakehouse gives the startup **the cost efficiency of a Data Lake, the analytical power of a Data Warehouse, and the flexibility to handle every data type it generates** — all in one architecture.