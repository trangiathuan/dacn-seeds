const Product = require('../models/product')

const search = async (req, res) => {
    try {
        const searchTerm = req.query.q; // Lấy từ khóa tìm kiếm từ query parameter

        // Tìm kiếm sản phẩm theo tên
        const products = await Product.find(
            { productName: { $regex: searchTerm, $options: 'i' } }
        );

        res.json(products); // Trả về toàn bộ thông tin của sản phẩm
    } catch (error) {
        res.status(500).json({ message: 'Đã xảy ra lỗi trong quá trình tìm kiếm' });
    }
}

const getProduct = async (req, res) => {
    try {
        const { sort, page = 1, limit = 8 } = req.query; // Lấy tham số sắp xếp, trang và giới hạn từ query string

        let sortOption;
        switch (sort) {
            case '1':
                sortOption = { createdAt: -1 };
                break;
            case '2':
                sortOption = { isSold: -1 };
                break;
            case '3':
                sortOption = { price: 1 };
                break;
            case '4':
                sortOption = { price: -1 };
                break;
            default:
                sortOption = {};
        }

        // Chuyển đổi các tham số sang số
        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 8);

        // Tính toán các chỉ số cho phân trang
        const skip = (pageNumber - 1) * limitNumber;

        // Truy vấn sản phẩm với phân trang
        const products = await Product.find().sort(sortOption).skip(skip).limit(limitNumber);

        // Lấy tổng số sản phẩm để tính toán tổng số trang
        const totalProducts = await Product.countDocuments();
        const totalPages = Math.ceil(totalProducts / limitNumber);

        // Trả về dữ liệu với thông tin phân trang
        res.json({
            products,
            pagination: {
                totalProducts,
                totalPages,
                currentPage: pageNumber,
                limit: limitNumber,
            },
        });
    } catch (error) {
        res.status(500).send({ message: 'Có lỗi xảy ra khi lấy sản phẩm', error });
    }
}


const getProductCategory = async (req, res) => {
    const id = req.params.id;
    try {
        // Lấy các tham số từ query string: sort, page và limit
        const { sort, page = 1, limit = 8 } = req.query;

        // Xác định option sắp xếp
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

        // Chuyển đổi các tham số sang số
        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);

        // Tính toán các chỉ số phân trang
        const skip = (pageNumber - 1) * limitNumber;

        // Truy vấn sản phẩm theo categoryID, sắp xếp, và phân trang
        const products = await Product.find({ categoryID: id })
            .sort(sortOption)
            .skip(skip)
            .limit(limitNumber);

        // Lấy tổng số sản phẩm trong danh mục đó
        const totalProducts = await Product.countDocuments({ categoryID: id });
        const totalPages = Math.ceil(totalProducts / limitNumber);

        // Trả về dữ liệu với thông tin phân trang
        res.json({
            products,
            pagination: {
                totalProducts,
                totalPages,
                currentPage: pageNumber,
                limit: limitNumber,
            },
        });
    } catch (error) {
        res.status(500).send({ message: 'Có lỗi xảy ra khi lấy sản phẩm', error });
    }
};


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