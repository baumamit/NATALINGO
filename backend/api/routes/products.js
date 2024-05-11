const express = require('express');
const router = express.Router();
// https://www.youtube.com/watch?v=srPXMt1Q0nY&list=PL55RiY5tL51q4D-B63KBnygU6opNPFk_q&index=10
const multer = require('multer');
// https://www.youtube.com/watch?v=8Ip0pcwbWYM&list=PL55RiY5tL51q4D-B63KBnygU6opNPFk_q&index=14
const checkAuth = require('../middleware/check-auth');
const ProductsController = require('../controllers/products');

const storage = multer.diskStorage({
        destination: function(req, file, cb) {
                cb(null, './uploads/');
        },
        filename: function(req, file, cb) {
                cb(null, new Date().toISOString() + file.originalName);
        }
});

const fileFilter = (req, file, cb) => {
        if (file.mimeType === 'image/jpeg' || file.mimeType === 'image/png') {
                // Accept and store file
                cb(null, true);
        } else {
                // Reject a file
                cb(null, false);
        }
};

const upload = multer({
        storage: storage,
        limits: {
                fileSize: 1024 * 1024 * 5
        },
        fileFilter: fileFilter
});

router.get('/', ProductsController.products_get_all);

router.post('/'/* , checkAuth, upload.single('productImage') */, ProductsController.products_create_product);

router.get('/:productId', ProductsController.products_get_product);

router.patch('/:productId',/*  checkAuth, */ ProductsController.products_update_product);

router.delete('/:productId',/*  checkAuth, */ ProductsController.products_delete_product);

module.exports = router;