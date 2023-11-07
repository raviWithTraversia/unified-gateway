const Product = require('../../models/Product');
const User = require('../../models/User');
const commonFunction = require('../commonFunctions/common.function');

const addProduct = async (req, res) => {
    try {
        const { productName } = req.body;
        const storeProduct = new Product({
            productName
        });
        const productSave = await storeProduct.save();

        // Log
        const doerId = req.user._id;
        const loginUser = await User.findById(doerId);

        await commonFunction.eventLogFunction(
            'product' ,
            doerId ,
            loginUser.fname ,
            req.ip , 
            loginUser.company_ID, 
            'add product'
        );

        return {
            response: 'Product added successfully'
        }

    } catch (error) {
        throw error;
    }

}

const allProductList = async (req, res) => {
    try {

        const result = await Product.find();
        if (result.length > 0) {
            return {
                data: result
            }
        } else {
            return {
                response: 'Product Not Found',
                data: null
            }
        }

    } catch (error) {
        throw error;
    }
}

const productUpdateById = async (req, res) => {
    try {
        const productName = req.body
        if (!productName) {
            return {
                response: 'product Name fields are required'
            }
        }
        // Check product exist or Not
        const productId = req.params.productId;
        
        const checkProduct = await Product.find({ _id: productId });
       
        if (!checkProduct) {
            return {
                response: "Product not found"
            }
        }
   
        const updateProduct = await Product.findByIdAndUpdate(productId, productName, { new: true })

        // Log
        const doerId = req.user._id;
        const loginUser = await User.findById(doerId);
        await commonFunction.eventLogFunction(
            'product' ,
            doerId ,
            loginUser.fname ,
            req.ip , 
            loginUser.company_ID , 
            'updated product'
        );
        
        return {
            response: "Product updated successfully"
        }

    } catch (error) {
        throw error;
    }
}

const removeProduct = async(req, res) => {
    try {
        const checkProductExist = Product.find({ _id: req.params.productId });
        
        if (checkProductExist) {
            const result = await Product.deleteOne({ _id: req.params.productId });

            // Log
            const doerId = req.user._id;
            const loginUser = await User.findById(doerId);
            await commonFunction.eventLogFunction(
                'product' ,
                doerId ,
                loginUser.fname ,
                req.ip , 
                loginUser.company_ID , 
                'remove product'
            );
            return {
                response : 'Porduct deleted Successfully!'
            }

        } else {
            return {
                response : 'ProductId not exist!'
            }
        }
    } catch (error) {
        throw error;
    }
}

module.exports = { addProduct, allProductList, productUpdateById , removeProduct}