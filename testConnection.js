const sql = require('mssql');

const dbConfig = {
    user: '', // Leave this empty for Windows Authentication
    password: '', // Leave this empty for Windows Authentication
    server: 'localhost', // Use 'localhost' for the server
    port: 1433,
    database: 'Todo', // Your database name
    options: {
        port: 1433, // Default port for SQL Server
        trustedConnection: true, // Use Windows Authentication
        trustServerCertificate: true, // Trust server certificate
        enableNamedPipes: true, // Enable named pipes
        // Use the named pipe directly:
        connectionString: 'Server=localhost;Database=Todo;Trusted_Connection=True;Integrated Security=SSPI;'
    },
};

sql.connect(dbConfig)
    .then(pool => {
        console.log('Connected to SQL Server');
        return pool.request().query('SELECT * FROM todos');
    })
    .then(result => {
        console.log(result.recordset);
        sql.close();
    })
    .catch(err => {
        console.error('Database connection failed:', err);
        sql.close();
    });