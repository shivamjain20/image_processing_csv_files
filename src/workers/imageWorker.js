const axios = require('axios');
const sharp = require('sharp');
const { Request, Product } = require('../models/database');
const fs = require('fs');
const path = require('path');

const downloadImage = async (url, filepath) => {
    const response = await axios({ url, responseType: 'stream' });
    const writer = fs.createWriteStream(filepath);
    response.data.pipe(writer);
    return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
    });
};

const processImage = async (inputPath, outputPath) => {
    const image = sharp(inputPath);
    const metadata = await image.metadata();

    const compressedQuality = 50; 

    const extname = path.extname(inputPath).toLowerCase();

    if (extname === '.jpg' || extname === '.jpeg') {
        await image
            .jpeg({ quality: compressedQuality })  
            .toFile(outputPath);
        console.log(`JPG image processed and saved to ${outputPath} with ${compressedQuality}% quality.`);
    } else if (extname === '.png') {
        await image
            .png({ compressionLevel: 9 })  
            .toFile(outputPath);
        console.log(`PNG image processed and saved to ${outputPath} with compression level 9.`);
    } else {
        console.log(`Unsupported format: ${extname}`);
    }
};

exports.processImages = async (requestId, products) => {
    const requests = products.map(async (product) => {
        const inputUrls = product.inputImageUrls.split(',');
        const outputUrls = [];

        console.log("inputUrl: "+inputUrls);
        for (const url of inputUrls) {
            const filename = path.basename(url);
            console.log("fileNAme: "+filename);
            const inputPath = path.resolve(__dirname, `../../uploads/original/${filename}`);
            console.log("inputPath: "+inputPath);
            const outputPath = path.resolve(__dirname, `../../uploads/processed/output-${filename}`);

            try {
                await downloadImage(url, inputPath);
                await processImage(inputPath, outputPath);
                outputUrls.push(outputPath); 
            } catch (error) {
                console.error('Error processing image:', error);
            }
        }

        await Product.update(
            { outputImageUrls: outputUrls.join(',') },
            { where: { productName: product.productName, requestId: requestId } }
        );
    });

    await Promise.all(requests);

    await Request.update({ status: 'COMPLETED' }, { where: { id: requestId } });

};
