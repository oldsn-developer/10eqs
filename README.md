# 10eqs

# Product Insights Generator

This project analyzes product pricing data, cleanses the input dataset, and generates a report with insights and recommendations for each product.

## Features

1. **Data Cleaning:**
   - Identifies and corrects inconsistencies in product data.
2. **Pricing Insights:**
   - Compares product prices with market prices fetched via an external API.
   - Calculates price differences and suggests actions (e.g., lowering the price and confirming competitiveness).
3. **Output Report:**
   - Generates a `report.md` file containing:
     - A summary of data cleaning operations.
     - Detailed insights for each product, including recommendations.

---

## Installation

1. Clone this repository:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

---

## Usage

Run the script by providing the path to the `products.csv` file:
```bash
node <path-to-analysis.js> <path-to-products.csv>
```

This will:
- Spin up Mock API (json-server)
- Read the CSV file.
- Ingest "external data" from API.
- Perform data cleaning and log corrections.
- Generate a `report.md` file with pricing insights.

---

## File Structure

```plaintext
project-root/
├── data/                # Directory for input CSV files
├── src/
│   ├── db.json          # Represents external data API for market prices.
│   ├── utils.js         # Contains data ingestion, cleaning, and utility functions
│   ├── analysis.js      # Handles report generation and insights
├── report.md            # Generated report with insights and recommendations
├── README.md            # Project documentation
├── package.json         # Project dependencies and scripts
```

---

## Output

### `report.md`

This file contains:
1. **Data Cleaning Summary:**
   - Highlights corrections made to the data.
2. **Product Insights:**
   - Lists each product with pricing details, market price comparison, and recommendations.

---

## Notes

- There were initial data discrepencies, like missing data in the CSV due to truncation in the PDF.
- Ensure the `products.csv` file follows a consistent structure.
- Customize `fetchExternalData` in `utils.js` to integrate with your preferred API for market prices. I used mock data as there were no public, operating APIs for this type of grocery price data.

# Timeline

- Setup: 5 minutes
- Data Cleaning: 20 minutes
- Data Processing and Data Integration: 40 minutes
- Generate Report: 20 minutes
- ReadMe Write-Up: 15 minutes
