// https://www.youtube.com/watch?v=ucuNgSOFDZ0&list=PL55RiY5tL51q4D-B63KBnygU6opNPFk_q&index=14

const mongoose = require('mongoose');

const Product = require('../models/product');

exports.products_get_all = (req, res, next) => {
        // Empty filter criteria returns all database entries that fit the pre-defined data schema
        Product.find()
                // Fetch only specific fields for each database entry
                .select('name price _id productImage')
                // Ensure a promise
                .exec()
                .then(docs => {
                        const response = {
                                count: docs.length,
                                // Restructure the docs (selected filtered output) using map() function
                                products: docs.map(doc => {
                                        return {
                                                name: doc.name,
                                                price: doc.price,
                                                productImage: doc.productImage,
                                                _id: doc._id,
                                                // Return also a ready Node.js request to get furhter info of each data entry
                                                request: {
                                                        type: "GET",
                                                        url: "http://localhost:3000/products/"+doc._id
                                                }
                                        }
                                })
                        };
                        res.status(200).json(response);
                })
                .catch(err => {
                        console.log(err);
                        res.status(500).json({
                                error: err
                        });
                });
};

exports.products_create_product = (req, res, next) => {
        console.log('Creating new product:');
        //console.log(req.file);
        const product = new Product({
                _id: new mongoose.Types.ObjectId(),
                name: req.body.name,
                price: req.body.price/* ,
                productImage: req.file.path */
        });
        product
        .save()
        .then(result => {
                console.log(result);
                res.status(201).json({
                        message: 'Created new product successfully',
                        // Restructure the result
                        createdProduct: {
                                name: result.name,
                                price: result.price,
                                _id: result._id,
                                // Add to the response (res) a ready Node.js request to get furhter info of the new data entry
                                request: {
                                        type: "GET",
                                        url: "http://localhost:3000/products/"+result._id
                                }
                        }
                });
        })
        .catch(err => {
                console.log(err);
                res.status(500).json({error: err});
        });
};

exports.products_get_product = (req, res, next) => {
        const id = req.params.productId;
        Product.findById(id)
                .select('name price _id productImage')
                // Ensure a promise
                .exec()
                .then(doc => {
                        console.log('From database', doc);
                        if (doc) {
                                res.status(200).json({
                                        product: doc,
                                        // Add to the response (res) a ready Node.js request to get furhter info of the data entry
                                        request: {
                                                type: "GET",
                                                description: "Get a product",
                                                url: "http://localhost:3000/products/"
                                        }
                                });
                        } else {
                                console.log('No valid entry found for provided ID:',id);
                                res.status(404).json({
                                        message: 'No valid entry found for provided ID.'
                                });
                        }
                })
                .catch(err => {
                        console.log(err);
                        res.status(500).json({error: err});
                });
};

exports.products_update_product = (req, res, next) => {
        const id = req.params.productId;
        const updateOps = {};
        for (const ops of req.body) {
                // Add an array cell for each row of the request's body with its property name
                // This PATCH request must be an array [] according to this code
                updateOps[ops.propName] = ops.value;
        }
// Use the Mongoose $set function to change the chosen entry to its updated values
        // https://mongoosejs.com/docs/api/model.html#Model.findByIdAndUpdate()
        Product.findByIdAndUpdate({_id: id}, {$set: updateOps})
                // Ensure a promise
                .exec()
                .then(result => {
                        res.status(200).json({
                                message:'Product updated',
                                // Add to the response (res) a ready Node.js request to get furhter info of the updated data entry
                                request: {
                                        type: "GET",
                                        url: "http://localhost:3000/products/"+id
                                }
                        });            
                })
                .catch(err => {
                        console.log('Could not update product:',id ,'Error:' , err);
                        res.status(500).json({error: err});
                });
};

exports.products_delete_product = (req, res, next) => {
        console.log('Entered "products_delete_product" router.')
        // Use the pre-extracted string (url section) that was pre-defined and named by the previous router as 'productId'
        const id = req.params.productId;
        console.log('ID = ', id);
        // Remove a distinct entry from the database that fits the filter criteria
        // https://mongoosejs.com/docs/api/model.html#Model.findByIdAndDelete()
        Product.findByIdAndDelete({_id: id})
                // Ensure a promise
                .exec()
                .then(result => {
                        res.status(200).json({
                                message: 'Product deleted',
                                // Add to the response (res) a ready Node.js POST request to add back the removed data entry
                                request: {
                                        method: 'POST',
                                        url: "http://localhost:3000/products/"+id,
                                        headers: {
                                            'Accept': 'application/json',
                                            'Content-Type': 'application/json'
                                        } ,
                                        body: {
                                                "name": req.body.name, 
                                                "price": req.body.price/*,
                                        productImage: req.file.path */
                                        }
                                }
                        });
                        console.log('Respose', res);
                        console.log('Result', result);
                })
                .catch(err => {
                        console.log('Delete failed, error', err);
                        res.status(500).json({error: err});
                });
};