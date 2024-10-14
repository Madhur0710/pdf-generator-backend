const express = require('express');
const { generatePDF } = require('../utils/pdfGenerator');

const router = express.Router();

router.post('/generate', async (req, res) => {
    try {
        const { type, data } = req.body;
        const pdfPath = await generatePDF(type, data);
        res.status(200).send({ pdfPath });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

module.exports = router;
