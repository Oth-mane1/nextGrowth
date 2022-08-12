import mongoose from 'mongoose';

mongoose.Promise = global.Promise;
const productSchema = new mongoose.Schema({
    "reference": String,
    "name": String,
    "description": String,
    "image": String,
    "variants": [
        {
            "sku": String,
            "specification": String,
            "price": Number
        }
    ],
});

export default mongoose.model('product', productSchema);