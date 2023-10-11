const ProductPlanHasProduct = require('../../models/ProductPlanHasProduct');
const Product = require('../../models/Product');


// Save product name 
const storeProduct = async (req, res) => {

    try {
        const { productName } = req.body;
        const storeProduct = new Product({
            productName
        });
        const productSave = await storeProduct.save();
        return res.status(200).json({ success: true, msg: "Porduct Save Successfully!", data: null });

    } catch (error) {
        return res.status(500).json({ success: false, msg: error.message, data: null });
    }

}

// Get All product
const getProduct = async (req, res) => {
    try {

        const existProduct = await Product.find();
        if (existProduct.length > 0) {
            return res.status(200).json({ success: true, data: existProduct });
        } else {
            return res.status(200).json({ success: true, msg: "Porduct Not Found!", data: null });
        }

    } catch (error) {
        return res.status(500).json({ success: false, msg: error.message, data: null });
    }
}

// update Product
const updateProduct = async (req, res) => {
    try {
        const productName = req.body
        if (!productName) {
            return res.status(400).json({ success: false, msg: "product Name fields are required", data: null });
        }

        const findProduct = Product.find({ _id: req.params.productId });
        if (findProduct) {

            await Product.findByIdAndUpdate(req.params.productId, productName, { new: true });

            return res.status(200).json({ success: true, msg: "Porduct updated Successfully!", data: null });

        } else {
            return res.status(200).json({ success: true, msg: "Product Id not match!", data: null });
        }


    } catch (error) {
        return res.status(500).json({ success: false, msg: error.message, data: null });
    }
}


// Product Delete By Id
const deleteProduct = async (req, res) => {
    try {
        const checkProductExist = Product.find({ _id: req.params.productId });
        if (checkProductExist) {
            const result = await Product.deleteOne({ _id: req.params.productId });
            if (result) {
                return res.status(200).json({ success: true, msg: "Porduct deleted Successfully!", data: null });
            } else {
                return res.status(200).json({ success: false, msg: "Something went wrong try again later!", data: null });
            }
        } else {
            return res.status(200).json({ success: true, msg: "Product not exist!", data: null });
        }
    } catch (error) {
        return res.status(500).json({ success: false, msg: error.message, data: null });
    }
}

module.exports = { storeProduct, getProduct, updateProduct, deleteProduct }
