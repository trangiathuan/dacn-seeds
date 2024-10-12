const Product = require('../models/product')

const search = async (req, res) => {
    try {
        const searchTerm = req.query.q; // Lấy từ khóa tìm kiếm từ query parameter

        // Tìm kiếm sản phẩm theo tên
        const products = await Product.find(
            { productName: { $regex: searchTerm, $options: 'i' } },
            { productName: 1 } // Chỉ trả về tên sản phẩm và ID
        );

        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Đã xảy ra lỗi trong quá trình tìm kiếm' });
    }
}

const getProduct = async (req, res) => {
    try {
        const { sort } = req.query; // Lấy tham số sắp xếp từ query string

        let sortOption;
        switch (sort) {
            case '1': // Mới nhất
                sortOption = { createdAt: -1 }; // Giảm dần theo ngày tạo
                break;
            case '2': // Bán chạy
                sortOption = { isSold: -1 }; // Giảm dần theo số lượng đã bán
                break;
            case '3': // Giá thấp đến cao
                sortOption = { price: 1 }; // Tăng dần theo giá
                break;
            case '4': // Giá cao đến thấp
                sortOption = { price: -1 }; // Giảm dần theo giá
                break;
            default:
                sortOption = {}; // Mặc định không sắp xếp
        }

        // Truy vấn sản phẩm và sắp xếp theo sortOption
        const products = await Product.find().sort(sortOption);
        res.json(products);
    } catch (error) {
        res.status(500).send({ message: 'Có lỗi xảy ra khi lấy sản phẩm', error });
    }
}

const getProductCategory = async (req, res) => {
    const id = req.params.id
    try {
        const products = await Product.find({ categoryID: id });
        if (!products || products.length === 0) {
            return res.status(404).send('Products not found');
        }
        res.json(products);
    } catch (error) {
        console.error('Error fetching products by category:', error);
        res.status(500).send('Server error');
    }
}

const postCreateProduct = async (req, res) => {
    let productName = req.body.productName;
    let categoryID = req.body.categoryID;
    let description = req.body.description;
    let price = req.body.price;
    let quantity = req.body.quantity;
    let image = req.body.image;
    let product = await Product.create({
        productName: productName,
        categoryID: categoryID,
        description: description,
        price: price,
        quantity: quantity,
        image: image
    })
    return res.status(200).json({
        errCode: 0,
        data: product
    })
}
const getProductDetail = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).send('Product not found');
        }
        res.json(product);
    } catch (error) {
        res.status(500).send('Server error');
    }
}



module.exports = {
    getProduct,
    postCreateProduct,
    getProductDetail,
    getProductCategory,
    search
}