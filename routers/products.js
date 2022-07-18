const { Product } = require('../models/product');
const express = require('express');
const { default: mongoose } = require('mongoose');
const { restart } = require('nodemon');
const router = express.Router();

router.get(`/`, async (req, res) => {
    let filter = {};
    if(req.query.categories){
        filter = {category: req.query.categories.split(',')};
    }
    const productList = await Product.find(filter).populate('category');
    if (!productList) {
        res.status(500).json({ success: false })
    }
    res.send(productList);
})

router.get(`/:id`, async (req, res) => {
    const product = await Product.findById(req.params.id)
        .populate('category')
        .then((product) => {
            res.send(product);
        })
        .catch((err) => {
            return res.status(500).send(`Invalid ID ${err}`);
        });
})

router.get(`/get/featured/:count`, async (req, res) => {
    const count = req.params.count ? req.params.count : 0;
    const featuredProduct = await Product.find({ isFeatured: true })
        .limit(+count)
        .catch((err) => {
            return res.status(500).json({
                success: false, message: err
            })
        })
    return res.status(200).json(featuredProduct);
})

router.get(`/get/count`, async (req, res) => {
    const productCount = await Product.countDocuments()
        .catch((err) => {
            return res.status(500).json({
                success: false, message: err
            })
        })
    return res.status(200).json({
        productCount: productCount
    });
})

router.put(`/:id`, async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).send('Invalid Product Id');

    const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            richDescription: req.body.richDescription,
            image: req.body.image,
            images: req.body.images,
            brand: req.body.brand,
            price: req.body.price,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured,
            description: req.body.description,
            category: req.body.category,
            countInStock: req.body.countInStock
        },
        { new: true }
    )
        .populate('category')
        .then((product) => {
            res.send(product);
        })
        .catch((err) => {
            res.status(404).send(`${err}`);
        })

})

router.delete(`/:id`, (req, res) => {
    Product.findByIdAndRemove(req.params.id).then(product => {
        if (product) {
            return res.status(200).json({ success: true, message: 'The product has been deleted' })
        } else {
            return res.status(400).json({ success: false, message: 'Product not found' })
        }
    }).catch(err => {
        return res.status(500).json({ success: false, error: err })
    })
})

router.post(`/`, async (req, res) => {
    const product = await new Product({
        richDescription: req.body.richDescription,
        image: req.body.image,
        images: req.body.images,
        brand: req.body.brand,
        price: req.body.price,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        countInStock: req.body.countInStock
    });

    await product
        .save()
        .then(
            (product) => {
                res.status(200).send(product);
            }
        )
        .catch(
            (err) => {
                res.status(500).send(`The product cannot be saved! \n ERROR: ${err}`)
            }
        );
})

module.exports = router;