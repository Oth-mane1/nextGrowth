import express from 'express';
import {
    getProducts,
    createProduct,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    getProductVariants,
    getProductVariant
} from '../controllers/productController.js';

const router = express.Router();
router.route('/')
    .get(getProducts)
    .post(createProduct);

router.route('/:productId')
    .get(getSingleProduct)
    .patch(updateProduct)
    .delete(deleteProduct);

router.route('/:productId/variants')
    .get(getProductVariants);

router.route('/:productId/variants/:variantId')
    .get(getProductVariant);

export default router;