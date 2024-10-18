const express = require('express');
const bodyParser = require('body-parser');
const sql = require('mssql'); // MSSQL package for SQL Server

const app = express();
const port = 3001;  // Backend server port

// Middleware to parse incoming JSON requests
app.use(bodyParser.json());

// MSSQL Database connection configuration
const dbConfig = {
    user: '', // Leave this empty for Windows Authentication
    password: '', // Leave this empty for Windows Authentication
    server: '(localdb)\\MSSQLLocalDB', // Use this for LocalDB instance
    database: 'Todo', // Your database name
    options: {
        trustServerCertificate: true, // Add this line if using a self-signed certificate
        trustedConnection: true, // Use Windows Authentication
    },
};

// Connect to SQL Server
sql.connect(dbConfig).then(pool => {
    console.log('Connected to SQL Server');

    // GET route to fetch todo items
    app.get('/todo', async (req, res) => {
        try {
            const result = await pool.request().query('SELECT * FROM todos');
            res.json(result.recordset);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error fetching data' });
        }
    });

    // POST route to create a new todo item
    app.post('/todo', async (req, res) => {
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ error: 'Text is required' });
        }

        try {
            await pool.request().query(`INSERT INTO todos (text) VALUES ('${text}')`);
            res.json({ message: 'Todo created successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error creating todo' });
        }
    });

    // Server listens on port 3001
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}).catch(err => {
    console.error('Database connection failed:', err);
});