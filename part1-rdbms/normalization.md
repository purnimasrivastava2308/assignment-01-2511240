# One Table, Three Problems: Why `orders_flat` Needs Normalization

Your manager calls normalization over-engineering. The `orders_flat` dataset disagrees — it **already contains all three classic data anomalies** that a flat schema produces, not as future risks, but as present reality.

---

## 1. Insert Anomaly — You Can't Add What Doesn't Exist Yet

### The Catch-22 of a Flat Schema

In `orders_flat`, product data only lives inside order rows. This means a new product — say, a Mechanical Keyboard — **cannot be added to the database until a customer orders it.** But customers can't order something that isn't in the system yet.

> **The result:** The database refuses to register a product unless it's already been sold — a deadlock caused entirely by schema design, not business logic.

---

## 2. Update Anomaly — One Fact, Stored Everywhere, Wrong Anywhere

### Repetition Is the Enemy of Accuracy

Customer **Neha Gupta (C006)** appears across **eight separate order rows**, her city repeated in each. One address change means eight updates — miss any one, and the database contradicts itself.

### It Has Already Happened in This Dataset

**Kavya Rao's (C008)** sales rep office address appears as two different values:
- `"Nariman Point"` — in most rows
- `"Nariman Pt"` — in ORD1180, ORD1174, ORD1171, and others

> **Same rep. Same office. Two strings.** The database can no longer tell us what the correct address actually is — and that is a live update anomaly, not a hypothetical one.

---

## 3. Delete Anomaly — A Routine Deletion That Destroys Unrelated Data

### When One Row Holds Too Much

**P008 (Webcam, ₹2,100)** exists in exactly **one order: ORD1185** by Amit Verma. Delete that order — for a return, a correction, or an archive — and the Webcam **vanishes from the database entirely.** No product ID. No price. No category. Gone.

> **A deletion meant to remove a transaction ends up erasing a product from existence.**

---

## The Verdict — Simple to Build, Dangerous to Maintain

Each anomaly above shares one root cause: **customers, products, reps, and orders are all crammed into a single row.** Normalization gives each entity its own table so it can be added, updated, or deleted independently — without collateral damage.

The flat table is simpler to *design once*. A normalized schema is safer to *run forever*. That's not over-engineering — **that's the whole point.**