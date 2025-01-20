const fs = require('fs')
const axios = require('axios')
const parser = require('csv-parser')

/* Process CSV and Extract Data 
    @param: string filePath - The file location for set of company's products in csv form
    @returns Promise<Array<Object>> results - The csv data in an array of objects
*/
async function ingestCSV(filePath) {
    return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(filePath)
            .pipe(parser())
            .on('data', (data) => results.push(data))
            .on('end', () => {
                console.log('Finished processing CSV.');
                resolve(results);
            })
            .on('error', (error) => {
                console.error('Error reading CSV:', error);
                reject(error);
            });
    });
}

/* Clean Data and Log Data Issues 
    @param: Array<Object> products - The set of company's products
    @returns Array<Object> products - The cleaned and normalized set of products
*/
function cleanData(products) {
    return products.map((product) => {
        const issues = [];

        // Normalize price
        if (product.our_price.includes('$')) {
            product.our_price = parseFloat(product.our_price.replace('$', '')) || 0;
            issues.push("Removed unnecessary dollar sign from price.");
        } else if (!parseFloat(product.our_price)) {
            product.our_price = 0;
            issues.push("Set price to 0 due to invalid value");
        }

        // Normalize stock
        if (product.current_stock.toLowerCase() === 'out of stock') {
            product.current_stock = 0;
            issues.push("Set stock to 0 due to 'out of stock'");
        } else if (!parseInt(product.current_stock)) {
            product.current_stock = 0;
            issues.push("Set stock to 0 due to invalid or missing value");
        } else {
            product.current_stock = parseInt(product.current_stock);
        }

        // Normalize restock threshold
        if (!parseInt(product.restock_threshold)) {
            product.restock_threshold = 'N/A';
            issues.push("Set restock threshold to 'N/A' due to invalid value");
        } else {
            product.restock_threshold = parseInt(product.restock_threshold);
        }

        // Normalize category
        product.category = product.category.trim().toLowerCase();

        // Add the issues to the product for tracking changes
        product.issues = issues;

        return product;
    });
}


/* Fetch External Data Source 
    @param string productName - The name of the product to fetch the market price for.
    @returns Object mockMarketData[productName] - Returns data for specific product name.
*/
async function fetchExternalData(productName) {
    
    const mockMarketData = {
        'Organic Coffee Beans (1lb)': 13.50,
        'Premium Green Tea (50 bags)': 9.00,
        'Masala Chai Mix (12oz)': 10.00,
        'Yerba Mate Loose Leaf (1lb)': 14.00,
        'Hot Chocolate Mix (1lb)': 8.50,
        'Earl Grey Tea (100 bags)': 12.00,
        'Espresso Beans (1lb)': 18.00,
        'Chamomile Tea (30 bags)': 7.00,
        'Matcha Green Tea Powder (4oz)': 20.00,
        'Decaf Coffee Beans (1lb)': 16.50,
        'Mint Tea (25 bags)': 8.00,
        'Instant Coffee (8oz)': 12.00,
        'Rooibos Tea (40 bags)': 10.00,
        'cold brew concentrate': 15.00
    };
    
    return mockMarketData[productName] || null;
    
  }

  module.exports = {ingestCSV, fetchExternalData, cleanData}