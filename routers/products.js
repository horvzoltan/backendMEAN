const { Product } = require('../models/product');
const express = require('express');
const router = express.Router();

router.get(`/`, async (req, res) => {
    const productList = await Product.find().populate('category');
    if (!productList) {
        res.status(500).json({ sucess: false })
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