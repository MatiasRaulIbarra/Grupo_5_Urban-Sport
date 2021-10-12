var express = require('express');
var router = express.Router();
let {admin,panelProductos,formAgregar,agregar,formEditar,editar,eliminar, searchProducts} = require("../controllers/adminControllers")

let uploadFile = require('../middelwares/uploadFiles');
let userSession = require('../middelwares/userSession');
let adminCheckValidator = require('../middelwares/userAdminCheck');

/* GET  admin*/
router.get("/",userSession, adminCheckValidator, admin);

router.get("/panelProductos",userSession, adminCheckValidator, panelProductos);

router.get('/agregar',userSession, adminCheckValidator, formAgregar);
router.post('/agregar',uploadFile.single('imagen-producto'),userSession, adminCheckValidator, agregar);

router.get("/editar/:id",userSession, adminCheckValidator, formEditar);
router.put("/editar/:id",userSession, adminCheckValidator, editar);

router.delete("/eliminar/:id", userSession, adminCheckValidator, eliminar);

router.get('/search', searchProducts);
 
module.exports = router;