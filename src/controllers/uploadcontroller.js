const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const path = require('path');
const { parseCSV } = require('../utils/csvParser');
const { Request, Product } = require('../models/database');
const imageWorker = require('../workers/imageWorker');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(__dirname, '../../uploads'));
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage }).single('file');

exports.uploadCSV = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ error: err.message + " Bad Request"});
        }

        const requestId = uuidv4();
        const webhookUrl = req.body.webhookUrl;

        try {
            const products = await parseCSV(req.file.path);

            await Request.create({ id: requestId, status: 'PROCESSING', webhookUrl });

            for (const product of products) {
                await Product.create({ ...product, requestId });
            }

            imageWorker.processImages(requestId, products);

            res.status(200).json({ requestId });
        } catch (error) {
            res.status(500).json({ error: error.message});
        }
    });
};
