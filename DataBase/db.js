const { ObjectId } = require('bson');
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://nitingupta9935:9115275119@cluster0.ci83y.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
    .then(() => { })
    .catch(err => { });

const loginSchema = new mongoose.Schema({
    name: String,
    password: String,
    number: String,
    firstName: String, 
    lastName: String,
    email: String,
    productsPurchased: [String], 
    wishList: [String]
});

const UserData = mongoose.model('UserData', loginSchema);

class DB {

    async signUp(firstName, lastName, email, password, number) {
        let name = firstName + ' ' + lastName;
        let userData = new UserData({
            firstName,
            lastName,
            name,
            email,
            password,
            number
        });

        const id = await userData.save();
        return id._id;
    };

    async isNumberExist(mobileNumber) {
        const userData = await UserData.findOne({ number: mobileNumber });
        // console.log(userData);
        if (!userData) {
            return false;
        }
        return true;
    }

    async getId(mobileNumber) {
        const userData = await UserData.findOne({ number: mobileNumber });
        return userData._id;
    }

    async isPasswordCorrect(mobileNumber, password) {
        const userData = await UserData.findOne({ number: mobileNumber });
        if (userData.password === password)
            return true;
        return false;
    }

    async addProduct(userId, productId) {
        const userData = await UserData.findById(userId);
        if (!userData.productsPurchased.includes(productId))
        userData.productsPurchased.push(productId);
        userData.save();
    }

    async addToWishList(userId, productId) {
        const userData = await UserData.findById(userId);
        if (!userData.wishList.includes(productId))
        userData.wishList.push(productId);
        userData.save();
    }

    async getProducts(userId) {
        const userData = await UserData.findById(userId);
        return userData.productsPurchased;
    }

    async getWishlistProducts(userId) {
        const userData = await UserData.findById(userId);
        return userData.wishList;
    }
    
    async getName(id) {
        const userData = await UserData.findById(id);
        return userData.name;
    }
}

module.exports = DB;