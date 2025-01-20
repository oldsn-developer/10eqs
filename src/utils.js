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
async function cleanData(products) {
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
    try {
        const url = `http://localhost:3000/products`;
        const response = await axios.get(url);
        const products = response.data;

        const product = products.find(p => p.product_name === productName);

        if (!product) {
            console.warn("Product not found.");
            return null;
        }

        // Return market price if it exists, else handle gracefully
        return product.market_price || 'Market price not available';
    } catch (error) {
        console.error('Error fetching external data:', error.message);
        return null;
    }
}

const { exec } = require('child_process');

/* Start JSON Server 
    Starts the JSON Server for mock api data.
    @returns Promise<Object> - Resolves with server process or rejects with an error.
*/
async function startJsonServer() {
    return new Promise((resolve, reject) => {
        const server = exec('npx json-server --watch src/db.json --port 3000');

        server.stdout.on('data', (data) => {
            console.log(`Server Output: ${data}`);
            if (data.includes('JSON Server started')) {
                resolve(server);
            }
        });

        server.stderr.on('data', (err) => {
            console.error(`Server Error: ${err}`);
            reject(new Error(`Error starting JSON Server: ${err}`));
        });
    });
}

/* Stop JSON Server */
async function stopJsonServer(server) {
    return new Promise((resolve, reject) => {
        server.kill();
        console.log('JSON server stopped.');
        resolve();
    });
}

module.exports = { ingestCSV, fetchExternalData, cleanData, startJsonServer, stopJsonServer };