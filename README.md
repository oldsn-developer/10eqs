# 10eqs

# Product Insights Analyzer

This project analyzes product pricing data, cleans the input dataset, and generates a report with insights and recommendations for each product.

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
- Read the CSV file.
- Perform data cleaning and log corrections.
- Generate a `report.md` file with pricing insights.

---

## File Structure

```plaintext
project-root/
├── data/                # Directory for input CSV files
├── src/
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

## Notes and Issues

- There were initial data discrepencies, like missing data in the CSV due to truncation in the PDF. The rest of data discrepencies are recorder in the report.md file.
- Ensure the `products.csv` file follows a consistent structure. The data available were columns: product_name, our_price, category, current_stock, restock_threshold
- Customize `fetchExternalData` in `utils.js` to integrate with your preferred API for market prices. I used mock data as there were no public, operating APIs for this type of grocery price data.
