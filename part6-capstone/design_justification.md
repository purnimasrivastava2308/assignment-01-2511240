## Storage Systems (The Three "Homes")

To build a system that actually helps a busy hospital, we can’t just throw all the data into one big pile. We chose three specialized "homes" for our data based on how fast it moves and what it’s used for.

    For Patient History & Monthly Reports: We chose Snowflake (a Data Warehouse). Think of this as the hospital’s "Grand Library." It is designed to hold years of medical records and billing information. It is perfect for predicting readmission and making cost charts because it can search through millions of pages of history at once to find patterns without getting "tired" or slowing down.

    For Plain English Queries: We use Pinecone (a Vector Database). This acts like a "Smart Index" for doctor notes. Usually, computers just look for exact words, but doctor notes are often Unstructured Text. Pinecone turns the meaning of a sentence into a mathematical fingerprint. When a doctor asks a question, this database helps the AI find every note related to the topic—even if the doctor wrote "heart attack" instead of "cardiac event."

    For Real-Time ICU Vitals: We use TimescaleDB. ICU machines are like a constant "Live Diary," recording heartbeats every single second. A normal database would crash under that pressure. We use a Time-Series Database because it is built specifically to handle high-speed information organized by time, ensuring doctors see live trends without a single second of lag.

## OLTP vs. OLAP Boundary (Doing vs. Thinking)

In our design, we have a very clear line between "Doing the Work" and "Studying the Work." > The OLTP (Transactional) side is where the actual hospital life happens. This includes the live screens nurses use to check patients in and the ICU monitors beeping in the rooms. These systems must be fast and 100% reliable.

The OLAP (Analytical) side begins once the data travels through our Ingestion Tools (the "Mail Trucks") and arrives in our storage homes like Snowflake. This is where the AI "thinks" about risks and where managers look at cost graphs. By keeping the "Thinking" separate from the "Doing," we protect the hospital. It means a heavy AI calculation will never cause a doctor’s screen to freeze during a surgery or an emergency.

## Trade-offs: The "Three Houses" Problem

The biggest trade-off in this design is Fragmentation. By putting data into three different systems, we made the system very fast, but we also made it more complex to manage. It’s like keeping your socks in the bedroom, your shoes in the hallway, and your coat in the garage—everything is in the right place, but it’s hard to see your "whole outfit" at once.

The Mitigation (The Fix): To solve this, we use a "Nightly Summary Pipeline." We don't move every single heartbeat into the main library, but we do move the highlights. Every night, the system takes the most important bits from the ICU Diary and the Smart Index and copies a summary into Snowflake. This way, if a researcher needs to see a patient's 10-year history alongside their vitals from last night, all the pieces are finally in one place.