const { Request } = require('../models/database');

exports.checkStatus = async (req, res) => {
    const { requestId } = req.params;

    try {
        const request = await Request.findByPk(requestId);
        if (!request) {
            return res.status(404).json({ error: 'Request not found' });
        }

        res.status(200).json({ requestId: request.id, status: request.status });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
