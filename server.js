const express = require('express');
const app = express();
const connectDB = require('./config/db');

const userRoutes = require('./routes/user');
const snippetRoutes = require('./routes/snippet');

connectDB();
app.use(express.json());
app.use('/api/user', userRoutes);
app.use('/api/snippet', snippetRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
