import Product from '../models/productModel.js';

// Get all Products
function getProducts(req, res) {
    Product.find()
        .then((allProduct) => {
            return res.status(200).json({
                success: true,
                message: 'List of all Products',
                Product: allProduct,
            });
        })
        .catch((err) => {
            res.status(500).json({
                success: false,
                message: 'Server error. Please try again.',
                error: err.message,
            });
        });

}

// Create new Product
function createProduct(req, res) {
    const { reference, name, description, image, variants } = req.body;

    // Check input type
    let inputValidation = checkProductValidity(req.body)
    if (inputValidation.length !== 0) {
        return res.status(422).json({
            message: (() => {
                let messagErr = "Invalid or empty inputs provided at: "
                inputValidation.forEach(chk => {
                    messagErr += chk + ", "
                })
                return messagErr.trim().slice(0, -1);
            })()
        });
    }

    const product = new Product({
        reference: reference,
        name: name,
        description: description,
        image: image,
        variants: variants
    });

    return product
        .save()
        .then((newProduct) => {
            return res.status(201).json({
                success: true,
                message: 'New Product created successfully',
                Product: newProduct,
            });
        })
        .catch((error) => {
            res.status(500).json({
                success: false,
                message: 'Server error. Please try again.',
                error: error.message,
            });
        });
}

// get single product
function getSingleProduct(req, res) {
    const id = req.params.productId;
    Product.findById(id)
        .then((singleProduct) => {
            res.status(200).json({
                success: true,
                message: `Details for ${singleProduct?.name}`,
                Product: singleProduct,
            });
        })
        .catch((err) => {
            res.status(500).json({
                success: false,
                message: 'This product does not exist',
                error: err.message,
            });
        });
}

// update product
function updateProduct(req, res) {
    const id = req.params.productId;
    const updateObject = req.body;

    // Check input type
    let inputValidation = checkProductValidity(req.body)
    if (inputValidation.length !== 0) {
        return res.status(422).json({
            message: (() => {
                let messagErr = "Invalid or empty inputs provided at: "
                inputValidation.forEach(chk => {
                    messagErr += chk + ", "
                })
                return messagErr.trim().slice(0, -1);
            })()
        });
    }

    Product.updateOne({ _id: id }, { $set: updateObject })
        .exec()
        .then(() => {
            res.status(200).json({
                success: true,
                message: 'Product is updated',
                updateProduct: updateObject,
            });
        })
        .catch((err) => {
            res.status(500).json({
                success: false,
                message: 'Server error. Please try again.'
            });
        });
}

// delete a product
function deleteProduct(req, res) {
    const id = req.params.productId;
    Product.findByIdAndRemove(id)
        .exec()
        .then(() => res.status(202).json({
            success: true,
            message: 'Product is deleted',

        }))
        .catch((err) => res.status(500).json({
            success: false,
            message: 'Server error. Please try again.'
        }));
}

// get product variants
function getProductVariants(req, res) {
    const id = req.params.productId;
    Product.findById(id).select('name variants')
        .then((variant) => {
            res.status(200).json({
                success: true,
                message: `Variants for ${variant?.name}`,
                Variants: variant["variants"],
            });
        })
        .catch((err) => {
            res.status(500).json({
                success: false,
                message: 'This product does not exist or does not have variants',
                error: err.message,
            });
        });
}

// get product's variant
function getProductVariant(req, res) {
    const productId = req.params.productId;
    const variantId = req.params.variantId;

    Product.findById(productId).select('variants')
        .then(({variants}) => {
            console.log(variants);
            res.status(201).json({
                success: true,
                Variant: variants.filter(v => v['_id'] == variantId),
            });
        })
        .catch((err) => {
            res.status(500).json({
                success: false,
                message: 'This product does not exist or does not have variants',
                error: err.message,
            });
        });
}

// Check for input validity (type and empteness)
function checkProductValidity({ reference, name, description, image, variants }) {
    let invalidInput = []

    if (typeof reference != 'string' || !reference) {
        invalidInput.push("reference")
    }
    if (typeof name != 'string' || !name) {
        invalidInput.push("name")
    }
    if (typeof description != 'string' || !description) {
        invalidInput.push("description")
    }
    if (typeof image != 'string' || !image) {
        invalidInput.push("image")
    }
    if (!Array.isArray(variants) || !variants) {
        invalidInput.push("variants")
    }
    variants && variants.forEach((variant, i) => {
        if (typeof variant["sku"] != 'string' || !variant["sku"]) {
            invalidInput.push(`sku at variant ${i}`)
        } if (typeof variant["specification"] != 'string' || !variant["specification"]) {
            invalidInput.push(`specification at variant ${i}`)
        } if (typeof variant["price"] != 'number' || !variant["price"]) {
            invalidInput.push(`price at variant ${i}`)
        }
    });

    return invalidInput
}

export { getProducts, createProduct, getSingleProduct, updateProduct, deleteProduct, getProductVariants, getProductVariant }