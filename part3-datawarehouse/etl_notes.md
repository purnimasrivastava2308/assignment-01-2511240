# Foundation Specifications — `retail_transactions` Dataset

---

## Overview

This document outlines the structural and quality specifications of the `retail_transactions` dataset, serving as the **reference baseline before any ETL pipeline is executed.** The dataset contains 300 retail transaction records across 9 columns, sourced from multiple store locations across India.

---

## Schema Definition

| Column | Data Type | Constraints | Notes |
|---|---|---|---|
| `transaction_id` | `VARCHAR` | **Primary Key**, NOT NULL | Format: `TXN####` |
| `date` | `DATE` | NOT NULL | **⚠ Mixed formats — requires normalisation** |
| `store_name` | `VARCHAR` | NOT NULL | 5 distinct stores |
| `store_city` | `VARCHAR` | NOT NULL | **⚠ NULL values present** |
| `product_name` | `VARCHAR` | NOT NULL | 14 distinct products |
| `category` | `VARCHAR` | NOT NULL | **⚠ Case inconsistency + duplicate labels** |
| `units_sold` | `INT` | > 0 | Range: 1–20 |
| `unit_price` | `DECIMAL(10,2)` | > 0 | Fixed per product |
| `customer_id` | `VARCHAR` | NOT NULL | Format: `CUST###` |

---

## Known Data Quality Issues

### ⚠ Issue 1 — Mixed Date Formats
The `date` column contains **three coexisting formats**: `DD/MM/YYYY`, `DD-MM-YYYY`, and `YYYY-MM-DD`. All values must be **normalised to `YYYY-MM-DD`** before loading.

### ⚠ Issue 2 — Category Label Inconsistency
The `category` column uses **inconsistent casing and labels** across rows — `electronics` vs `Electronics`, and `Grocery` vs `Groceries`. These must be **unified to a single canonical value per category** via lookup table.

### ⚠ Issue 3 — NULL Values in `store_city`
Multiple transactions — including **TXN5033, TXN5082, TXN5094, TXN5098, TXN5100** — have a blank `store_city` despite a valid `store_name`. Since the store→city mapping is deterministic, **missing cities must be imputed from a store reference table**, not dropped.

---

## Target Warehouse Tables

Post-ETL, the cleaned data will load into three dimension tables and one fact table:
`dim_date` · `dim_product` · `dim_customer` · `fact_transactions`

---

## ETL Decisions

---

### Decision 1 — Normalising Mixed Date Formats

**Problem:** The `date` column contains **three coexisting formats** — `DD/MM/YYYY` (e.g., TXN5000: `29/08/2023`), `DD-MM-YYYY` (e.g., TXN5001: `12-12-2023`), and `YYYY-MM-DD` (e.g., TXN5002: `2023-02-05`). A warehouse querying by month or quarter cannot parse mixed formats reliably — **time-based aggregations silently break** without a consistent baseline.

**Resolution:** All date values were **standardised to `YYYY-MM-DD`** during the Transform stage. Three derived columns — `day`, `month`, and `year` — were additionally extracted and loaded into a dedicated **`dim_date` dimension table**, enabling clean time-series queries without repeated string parsing at query time.

---

### Decision 2 — Unifying Category Labels

**Problem:** The `category` column carries **two types of inconsistency** simultaneously — casing (`electronics` vs `Electronics`) and label variation (`Grocery` vs `Groceries`). Both TXN5005 and TXN5008 refer to food products yet land in different groups. Any `GROUP BY category` query would **split identical categories into separate rows**, producing wrong revenue totals.

**Resolution:** A **canonical lookup table** of three valid values — `electronics`, `clothing`, `grocery` — was created. All raw values were lowercased and mapped against it during Transform. Any unrecognised value was **flagged and quarantined** rather than loaded, preserving data integrity downstream.

---

### Decision 3 — Imputing NULL Values in `store_city`

**Problem:** Multiple transactions — **TXN5033, TXN5082, TXN5094, TXN5098, TXN5100, TXN5206** and others — have a **missing `store_city`** despite a valid `store_name`. Loading these as NULL would silently **exclude entire transactions from city-level sales reports**, skewing regional analysis.

**Resolution:** Since every `store_name` maps **deterministically to one city** throughout the dataset (e.g., `Mumbai Central` → `Mumbai`), a store reference table was built during Transform to **impute the missing city values** before loading. Any store name with no resolvable mapping was routed to a quarantine table for manual review.