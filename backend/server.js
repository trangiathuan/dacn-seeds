const express = require('express');
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
const adminRoutes = require('./src/routes/adminRoutes');
const chartRoutes = require('./src/routes/chartRoutes')
const commentRoutes = require('./src/routes/commentRoutes');
const blogRoutes = require('./src/routes/blogRoutes');
const commentBlogRoutes = require('./src/routes/commentBlogRoutes');

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(bodyParser.json());
app.use('/api', productRoutes);
app.use('/api', categoryRoutes);
app.use('/api', authRoutes);
app.use('/api', cartRoutes);
app.use('/api', checkoutRoutes);
app.use('/api', adminRoutes);
app.use('/api', chartRoutes);
app.use('/api', commentRoutes);
app.use('/api', blogRoutes);
app.use('/api', commentBlogRoutes);




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
