const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const documentRoutes = require('./routes/document');
const app = express();
const dotenv = require('dotenv');

dotenv.config();

app.use(cors());
app.use(express.json())
app.use(bodyParser.json());
app.use('/api/documents', documentRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));