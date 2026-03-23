# RDBMS vs NoSQL — Choosing the Right Database

## Database Recommendation

---

## Part 1 — Patient Management System

### Why ACID Cannot Be Compromised in Healthcare

For a patient management system, the clear recommendation is **MySQL (RDBMS).**

MySQL is built on **ACID** — **A**tomicity, **C**onsistency, **I**solation, **D**urability. Every transaction either completes fully or rolls back entirely. **No partial, corrupted record is ever saved.**

MongoDB runs on **BASE** — **B**asically Available, **S**oft state, **E**ventually Consistent. "Eventually consistent" is acceptable for social feeds. It is **not acceptable when a patient's medication or diagnosis could briefly reflect the wrong value.** That is not a UX bug — it is a **clinical and legal liability.**

### CAP Theorem Perspective

MySQL prioritises **Consistency + Availability (CA).** A brief outage from sacrificing partition tolerance is a far safer trade-off than **inconsistent data driving a wrong treatment decision.**

>  **Verdict: MySQL.** When lives depend on the data, consistency is non-negotiable.

---

## Part 2 — Adding a Fraud Detection Module

### When Speed and Scale Matter More Than Strict Accuracy

Fraud detection **flips the priorities.** The system must process **high-velocity, unstructured event streams** — transaction patterns, login anomalies, behavioural signals — in near real-time. Rigid structure becomes a bottleneck.

**MongoDB is the right fit here.** Its flexible document model handles varied schemas without migrations, and it scales horizontally for the required volume.

For CAP, the trade-off shifts to **Availability + Partition Tolerance (AP).** Eventual consistency is tolerable because fraud flags trigger **human review**, not an immediate automated action.

>  **Verdict: MongoDB.** Speed and flexibility outweigh the need for strict consistency.

---

## Final Take

| Module | Database | Priority |
|---|---|---|
| Patient Management | **MySQL** | Consistency above all |
| Fraud Detection | **MongoDB** | Speed and scale |

> **Use both.** A hybrid architecture is not a compromise — it is using each tool for exactly what it was built for.