const db = require("../database/models");
const { Op } = require('sequelize');

module.exports = {
  admin: (req, res) => {
    res.render("admin", {
      session: req.session,
    });
  },

  panelProductos: (req, res) => {
    db.Products.findAll()
      .then((products) => {
        db.Colours.findAll({
          include: [{
            association: 'products',
            include: [{
              association: 'colours',
            }]
          }]
        })
          .then(colours => {
            db.Brands.findAll({
              include: [{
                association: 'products',
              }]
            })
              .then(brands => {
                db.Images.findAll({
                  include: [{
                    association: 'product'
                  }]
                })
                  .then(images => {
                    db.Colour_products.findAll()
                      .then(colour_products => {
                        db.Talle_products.findAll()
                          .then(talle_products => {
                            db.Subcategories.findAll({
                              include: [{
                                association: 'products',
                                association: 'category'
                              }]
                            })
                              .then(subcategories => {
                                db.Categories.findAll({
                                  include: [{
                                    association: 'subcategories'
                                  }]
                                })
                                  .then(categories => {
                                    db.Talles.findAll({
                                      include: [{
                                        association: 'products'
                                      }]
                                    })
                                      .then(talles => {
                                        res.render("panelProductos", {
                                          session: req.session,
                                          products,
                                          colours,
                                          brands,
                                          images,
                                          colour_products,
                                          talle_products,
                                          subcategories,
                                          categories,
                                          talles
                                        })
                                      })
                                      .catch(err => console.log(err))
                                  })
                                  .catch(err => console.log(err))
                              })
                              .catch(err => console.log(err))
                          })
                          .catch(err => console.log(err))
                      })
                      .catch(err => console.log(err))
                  })
                  .catch(err => console.log(err))
              })
              .catch(err => console.log(err))
          })
          .catch(err => console.log(err))
      })
      .catch(err => console.log(err))
  },
  formAgregar: (req, res) => {
    db.Colours.findAll({
      include: [{
        association: 'products',
        include: [{
          association: 'colours'
        }]
      }]
    })
      .then(colours => {
        db.Brands.findAll({
          include: [{
            association: 'products'
          }]
        })
          .then(brands => {
            db.Categories.findAll({
              include: [{
                association: 'subcategories'
              }]
            })
            .then(categories => {
              db.Subcategories.findAll({
                include: [{
                  association: 'products',
                  association: 'category'
                }]
              })
              .then(subcategories => {
                db.Talles.findAll({
                  include: [{
                    association: 'products'
                  }]
                })
                .then(talles => {
                  res.render("agregar", {
                    session: req.session,
                    colours,
                    brands,
                    categories,
                    subcategories,
                    talles
                  })
                })
                .catch(err => console.log(err))
              })
              .catch(err => console.log(err))
            })
            .catch(err => console.log(err))
          })
        .catch(err => console.log(err))
      })
    .catch(err => console.log(err))
  },
  agregar: (req, res) => {
    let arrayImages = [];
    if (req.files) {
      req.files.forEach((imagen) => {
        arrayImages.push(imagen.filename);
      });
    }
    let {
      name,
      id_marca,
      description,
      id_subcategory,
      colour,
      id_talle,
      price,
      discount,
      visible,
      stock,
    } = req.body;

    db.Products.create({
      name,
      description,
      id_subcategory,
      price,
      discount,
      visible,
      stock,
      id_marca
    })
      .then(product => {
        db.Colour_products.create({
          id_colour: colour,
          id_product: product.id
        })
        db.Talle_products.create({
          id_talle: id_talle,
          id_product: product.id
        })
        if (arrayImages.length > 0) {
          let images = arrayImages.map((image) => {
            return {
              name: image,
              productId: product.id,
            };
          });
          db.Images.bulkCreate(images)
            .then(() => res.redirect("panelProductos"))
            .catch((err) => console.log(err));
        } else {
          db.Images.create({
            name: "default-image.png",
            productId: product.id,
          })
            .then(() => res.redirect("/admin/panelProductos"))
            .catch((err) => console.log(err));
        }
      });
  },
  formEditar: (req, res) => {
    db.Products.findByPk(req.params.id).then((product) => {
      res.render("editar", {
        product,
        session: req.session,
      });
    });
  },
  editar: (req, res) => {
    let {
      name,
      id_marca,
      description,
      id_subcategory,
      colour,
      id_talle,
      price,
      discount,
      visible,
      stock,
    } = req.body;

    db.Products.update(
      {
        name,
        id_marca,
        description,
        id_subcategory,
        colour,
        id_talle,
        price,
        discount,
        visible,
        stock,
      },
      {
        where: {
          id: +req.params.id,
        },
      }
    ).then((productUpdated) => {
      if (req.files) {//borre el lenght de la imagen
        db.Images.destroy({
          where: {
            id_product: +req.params.id,
          },
        })
          .then(() => {
            let images = [];
            let nameImages = req.files.map((image) => image.filename);
            nameImages.forEach((img) => {
              let newImage = {
                id_product: req.params.id,
                name: img,
              };
              images.push(newImage);
            });
            db.images.bulkCreate(images).then((result) => {
              res.redirect(`/admin/panelProductos`);
            });
          })
          .then(() => {
            res.redirect("/admin/panelProductos");
          })
          .catch((err) => console.log(err));
      } else {
        res.redirect("/admin/panelProductos");
      }
    });
  },

  eliminar: (req, res) => {
    db.Images.destroy({
      where: {
        productId: req.params.id,
      }
    })
      .then(result => {
        db.Products.destroy({
          where: {
            id: +req.params.id,
          },
        })
          .then(() => {
            res.redirect("/admin/panelProductos");
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  },
  searchProducts: (req, res) => {
    let search = req.query.keywords
    db.Products.findAll({
      where: { name: { [Op.substring]: search } }
    })
      .then(products => {

        res.render('adminProductSearch', {
          product: products,
          search,
          session: req.session
        })
      })
  }
};
