const Category = require('../models/category')

const getCategory = async (req, res) => {
    try {
        const category = await Category.find();
        res.json(category);
    } catch (error) {
        res.status(500).send(error);
    }
}

const getCategoryById = async (req, res) => {
    const { id } = req.params
    try {
        const category = await Category.findById(id);
        res.json(category);
    } catch (error) {
        res.status(500).send(error);
    }
}
module.exports = {
    getCategory,
    getCategoryById
}