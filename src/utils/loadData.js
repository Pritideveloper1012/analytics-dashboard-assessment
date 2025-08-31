import Papa from "papaparse";

export async function loadCSVData() {
  try {
    const response = await fetch(
      "https://raw.githubusercontent.com/vedant-patil-mapup/analytics-dashboard-assessment/refs/heads/main/data-to-visualize/Electric_Vehicle_Population_Data.csv"
    );
    if (!response.ok) throw new Error("Failed to fetch CSV data");
    const csvText = await response.text();

    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          // Trim all keys and values
          const cleanedData = results.data.map((row) => {
            const newRow = {};
            Object.keys(row).forEach((key) => {
              newRow[key.trim()] = row[key]?.trim();
            });
            return newRow;
          });
          resolve(cleanedData);
        },
        error: (err) => reject(err),
      });
    });
  } catch (error) {
    console.error("Error loading CSV data:", error);
    return [];
  }
}
