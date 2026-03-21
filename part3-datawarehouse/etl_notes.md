### Retail Sales Data Warehouse (Star Schema)

This project contains a functional Star Schema designed to transform messy, flat-file OLTP sales data into a structured warehouse ready for high-level analytics. By separating attributes into dimensions, we’ve made the data more efficient, easier to manage, and much faster to query.
Architecture Overview

The warehouse is built around a central Fact Table connected to three primary Dimension Tables:

    **DIM_PRODUCT**: Stores unique product names and standardized categories (e.g., Electronics, Clothing, Grocery).

    **DIM_STORE**: Tracks store locations and cities.

    **DIM_DATE**: A dedicated time dimension that breaks down raw dates into manageable attributes like months and years.

    FACT_SALES: The "truth" table containing transaction IDs, keys to the dimensions, units sold, and unit prices.

## ETL Decisions
**Decision 1 — Fixing Category Chaos**

**Problem**: The raw data was a bit of a mess when it came to labeling. I found that the *"Grocery" category was split into two different names: some rows said "grocery" and others said "groceries*." If I had left it that way, any "Total Sales by Category" report would have shown two separate bars for the same department, which is a reporting nightmare.

**Resolution**: During the transformation phase, I wrote a standardization script that looked for any variation of that string. I *forced everything—singular or plural—into a consistent "grocery" tag*. This ensures that when you run a SUM(), you're actually getting the full picture of the grocery department's performance.

**Decision 2 — Normalizing the Timeline**

**Problem**: SQL is extremely picky about date formats. The raw file had *dates as simple text strings, and some didn't follow the standard DD-MM-YYYY format* required for a DATE primary key. Without fixing this, the DIM_DATE table wouldn't even let the data in, and time-based joins would have failed immediately.

**Resolution**: *I converted all incoming date strings into the format (DD-MM-YYYY)*. I also went a step further and extracted the Month and Year into their own integer columns. This means you don't have to use slow date-parsing functions every time you want to see a "Month-over-Month" trend; the data is already pre-sliced for you.

**Decision 3 — The "Guest List" Validation (The Integrity Check)**

**Problem**: This was the biggest headache. We had "orphaned" *transactions—sales rows that were trying to point to dates or products that didn't exist in our dimension tables yet*. In a database with Foreign Keys, this causes a complete crash (Error 1452).

**Resolution**: I implemented a Dimension-First loading strategy. One thing I did behind the scenes that isn't immediately obvious is that I ran a recursive "pre-scan" of the dataset. I identified every single unique product, store, and date that ever appeared in the *transaction list and made sure they were registered in the dimensions before the fact table was even touched*. It’s like making sure the guest list is 100% complete before opening the doors to the club.