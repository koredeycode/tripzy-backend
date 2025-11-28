
import { query } from "./src/db";

async function checkColumns() {
  try {
    const result = await query(
      `SELECT column_name, data_type 
       FROM information_schema.columns 
       WHERE table_name = 'messages';`
    );
    console.log("Columns in messages table:", result.rows);
  } catch (err) {
    console.error("Error querying information_schema:", err);
  }
}

checkColumns();
