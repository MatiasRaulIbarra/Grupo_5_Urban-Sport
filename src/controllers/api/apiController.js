let db = require('../../database/models');

module.exports = {
    allProducts: (req, res)=>{
        db.Products.findAll({
            include: [{association: "images"}]
        })
        .then(products => {
            res.status(200).json({
                meta: {
                    status: 200,
                    total: products.length
                },
                data: products
            })
        })
        .catch(error => res.status(400).send(error))
    },
    allCategories : (req, res)=>{
        db.Categories.findAll({
            include: [{association: "subcategories"}]
        })
        .then(categories => {
            res.status(200).json({
                meta: {
                    status: 200,
                    total: categories.length
                },
                data: categories
            })
        })
        .catch(error => res.status(400).send(error))
    },
    oneCategory: (req, res) => {
        db.Categories.findOne({where: {id:req.params.id }, include: [{association: "subcategories"}]}).then(category => {
            res.status(200).json({
                meta:{
                    status: 200
                },
                data: category
            })
        })
    }
}
