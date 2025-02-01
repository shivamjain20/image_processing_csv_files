const express = require('express');
const uploadController = require('../controllers/uploadcontroller');
const statusController = require('../controllers/statuscontroller');


const router = express.Router();

router.post('/api/upload', uploadController.uploadCSV);
router.get('/api/status/:requestId', statusController.checkStatus);


module.exports = router;
