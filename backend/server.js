const express = require('express'); //import express
const app = express()
const connection = require('./src/config/database');
const cors = require('cors')
const port = 8000
const bodyParser = require('body-parser');

const productRoutes = require('./src/routes/productRoutes');
const cartRoutes = require('./src/routes/cartRoutes');
const authRoutes = require('./src/routes/authRoutes');
const checkoutRoutes = require('./src/routes/checkoutRoutes');
const categoryRoutes = require('./src/routes/categoryRoutes');
const adminRoutes = require('./src/routes/adminRoutes')
const commentRoutes = require('./src/routes/commentRoutes');

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(bodyParser.json());
app.use('/', productRoutes)
app.use('/', categoryRoutes)
app.use('/api/auth', authRoutes);
app.use('/api', cartRoutes);
app.use('/api', checkoutRoutes);
app.use('/api', adminRoutes);
app.use('/api', commentRoutes);


const conn = async () => {
    try {
        await connection();
        app.listen(port, () => {
            console.log(`Example app listening on port ${port}`)
        })
    }
    catch (error) {
        console.log("error connect to DB")
    }
};
conn();