const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://nitingupta9935:9115275119@cluster0.ci83y.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
.then(() => {})
    .catch(err => {});

let reviewSchema = mongoose.Schema({
    name: String,
    comment: String
});

let Product = mongoose.model('Product', {
    name: String,
    companyName: String,
    imageNumber: String,
    MRP: Number, 
    listerId: String,
    review: [reviewSchema]           
});



// addProduct('Camera', 'Nikon', 'camera', 37999);
// addProduct('Laptop', 'Dell', 'laptop', 54999);
// addProduct('IPhone', 'Apple', 'phone', 97999);
// addProduct('Watch', 'MI', 'watch', 8999);

class Products{

    async addProduct(name, companyName, imageNumber, MRP, listerId) {
    let product = new Product({
        name,
        companyName,
        imageNumber,
        MRP,
        listerId
    });

    product.save();
}

    async getProducts() {
        let products = await Product.find();
        return products;
    }

    async getProduct(id) {
        let product = await Product.findById(id);
        return product;
    }

    async addReview(name, review, productId) {
        let product = await Product.findById(productId);
        let reviewDetail = {
            name: name,
            comment: review
        };

        product.review.push(reviewDetail);
        product.save();
    }

}

module.exports = Products;