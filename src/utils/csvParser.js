const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');

exports.parseCSV = (filepath) => {
    return new Promise((resolve, reject) => {
        const results = [];
        const fullPath = path.resolve(filepath);
        fs.createReadStream(fullPath)
            .pipe(csv())
            .on('data', (data) => {
                results.push({
                    serialNumber: data.serialNumber,
                    productName: data.productName,
                    inputImageUrls: data.inputImageUrls
                });
            })
            .on('end', () => resolve(results))
            .on('error', (error) => reject(error));
    });
};
