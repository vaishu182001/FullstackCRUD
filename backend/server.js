const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();
const port = 8081;
const cors=require('cors');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
// Use the cors middleware to enable CORS
app.use(cors());
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    password: '', 
    database: 'cruddb', 
  });
  db.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
    } else {
      console.log('Connected to MySQL database');
    }
  });
  app.get("/", (req, res) => {
     const sql='SELECT * FROM products';
    db.query(sql, (err, data) => {
        if (err) {
            console.error('Error fetching data:', err);
            res.status(500).json({ error: 'Internal server error' });
          } else {
            const users = data.map((row) => ({
              PID: row.PID,
              PName: row.PName,
              PCategory: row.PCategory,
              PQuant: row.PQuant,
              PPrice: row.PPrice,
            }));
            res.status(200).json(users);
          }
        });
  });
  /*app.post('/createProd',(req,res)=>{
    const sql="INSERT INTO products ('PName','PCategory','PQuant','PPrice')VALUES(?)";
    const values=[
        req.body.ProductName,
        req.body.ProductCategory,
        req.body.ProductQuantity,
        req.body.ProductPrice
    ]
    db.query(sql,[values],(err,data)=>{
        if(err) return res.json(error);
        return res.json(data);
    })
  })
*/
app.post('/create', (req, res) => {
    try {
      // Extract the product data from the request body
      const { ProductName, ProductCategory, ProductQuantity, ProductPrice } = req.body;
  
      // Create a SQL query to insert the product data into the database
      const sql = `INSERT INTO products ( PName, PCategory, PQuant, PPrice) VALUES ( ?, ?, ?, ?)`;
  
      // Execute the SQL query with the product data
      db.query(
        sql,
        [ ProductName, ProductCategory, ProductQuantity, ProductPrice],
        (err, result) => {
          if (err) {
            console.error('Error inserting data into the database:', err);
            res.status(500).json({ error: 'Error inserting data into the database' });
          } else {
            console.log('Product inserted successfully');
            res.status(201).json({ message: 'Product created successfully' });
          }
        }
      );
    } catch (error) {
      // Handle any errors that occur during data processing
      console.error('Error creating product:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });

  // Update a product by ID
app.put('/update', (req, res) => {
    try {
      // Extract the product data from the request body
      const { ProductName, ProductCategory, ProductQuantity, ProductPrice } = req.body;
      //const productId = req.params.PID; // Extract the ID parameter from the route
      
      // Create a SQL query to update the product data in the database
      const sql = `
        UPDATE products
        SET PName = ?, PCategory = ?, PQuant = ?, PPrice = ?
        WHERE PName = ?
      `;
      
      // Execute the SQL query with the updated product data
      db.query(
        sql,
        [ProductName, ProductCategory, ProductQuantity, ProductPrice, ProductName],
        (err, result) => {
          if (err) {
            console.error('Error updating data in the database:', err);
            res.status(500).json({ error: 'Error updating data in the database' });
          } else {
            console.log('Product updated successfully');
            res.status(200).json({ message: 'Product updated successfully' });
          }
        }
      );
    } catch (error) {
      // Handle any errors that occur during data processing
      console.error('Error updating product:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });
  app.delete('/productdel/:pname', (req, res) => {
    const sql="delete from products where PName=?";
    const id=req.params.pname;
    db.query(sql,[id],(err,data)=>{
        if(err) return res.json("ERROR");
        return res.json(data);
    })
  });
  
  
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });