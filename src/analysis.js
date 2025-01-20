const { ingestCSV, fetchExternalData, cleanData } = require('./utils');
const fs = require('fs');

/* Process data, create insights, and write to report.md 
    @param Array<Object> products - Set of company's products with cleaned and normalized data points.
*/
async function createReport(products) {
    const insights = [];
    const dataIssues = [];

    for (const product of products) {
        const { product_name, our_price, issues } = product;
        const marketPrice = await fetchExternalData(product_name);

        if (issues && issues.length > 0) {
            dataIssues.push({
                product_name,
                issues: issues.join(', ')
            });
        }

        // Generate insights
        if (marketPrice) {
            const priceDifference = parseFloat(our_price) - marketPrice;
            insights.push({
                product_name,
                our_price: parseFloat(our_price),
                market_price: marketPrice.toFixed(2),
                price_difference: priceDifference.toFixed(2),
                recommendation: priceDifference > 0 ? 'Lower price' : 'Price is competitive'
            });
        } else {
            insights.push({
                product_name,
                our_price: parseFloat(our_price),
                market_price: 'Not available',
                insight: 'No insights'
            });
        }
    }

    const dataIssuesSection = dataIssues.map(issue =>
        `Product: ${issue.product_name}, 
         Issues: ${issue.issues}`
    ).join('\n');

    const insightsSection = insights.map(report =>
        `Product: ${report.product_name}, 
         Our Price: ${report.our_price}, 
         Market Price: ${report.market_price}, 
         Price Difference: ${report.price_difference || 'N/A'}, 
         Recommendation: ${report.recommendation || 'N/A'}`
    ).join('\n');

    // Combine sections into the report
    const reportContent = `# Data Issues Found\n\n${dataIssuesSection}\n\n# Product Insights\n\n${insightsSection}`;

    // Write the report to a file
    fs.writeFileSync('report.md', reportContent, { flag: 'w' });
}

/* Entry Point for Application Start */
(async () => {
    const args = process.argv.slice(2);
    const csvFilePath = args[0];

    if (!csvFilePath) {
        console.error('Please provide the path to the products.csv file.');
    }

    try {
        // Read CSV
        const ourProducts = await ingestCSV(csvFilePath);
        // Clean CSV
        const cleanedData = cleanData(ourProducts);

        await createReport(cleanedData);
    } catch (error) {
        console.error('Error creating report:', error);
    }
})();
