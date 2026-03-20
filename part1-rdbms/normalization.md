Based on an analysis of the orders_flat.csv file, here are the identified database anomalies. These occur because the data is currently stored in a "flat" format where redundant information is repeated across many rows.

### Anomaly Analysis
*1. Insert Anomaly*

- **Definition:** An insert anomaly occurs when we cannot add certain data to the database because other unrelated data is missing.

- **Example:** We cannot add a new product (e.g., "Webcam") into this CSV system unless someone actually orders it.

- **Citation:** Because the product_id and product_name are tied to an order_id, ***there is no way to represent a product that is currently in stock but has zero sales.*** If we tried to add a row for a new product, we would be forced to leave order_id and customer_id null, which would likely violate primary key constraints in a real database.

*2. Update Anomaly*

- **Definition:** An update anomaly occurs when data is stored redundantly, and a change to one piece of information requires multiple updates across many rows, leading to potential inconsistencies.

- **Example:** The office address for Sales Rep SR01 (Deepak Joshi) is inconsistent in the file.

- **Citation:** In Row 2 (ORD1114), the address is listed as "Mumbai HQ, ***Nariman Point***, Mumbai - 400021".

    In Row 182 (ORD1176), the address is listed as "Mumbai HQ, ***Nariman Pt***, Mumbai - 400021".

    If the office moves, we have to find and update every single order ever handled by SR01. If we miss even one row, the database will have conflicting addresses for the same person.

*3. Delete Anomaly*

- **Definition:** A delete anomaly occurs when deleting a record inadvertently results in the loss of other unrelated, important information.

- **Example:** Deleting an order could result in losing the only record of a Customer's existence or a Sales Rep's details.

- **Citation:** Consider Customer C010 (Vijay Singh). If Vijay has only placed one order (e.g., ORD1092) and we decide to delete that order because it was canceled, ***we lose all of Vijay’s contact information*** (vijay@gmail.com) and his location (Chennai).

    In a normalized system, the Customer would exist in their own table regardless of whether they have an active order.