'use strict'
const admin_controller = require('../controllers/admin.controller');
const multer = require('multer')
const storage = multer.diskStorage({
    destination: './files',
    filename(req, file, cb) {
        cb(null, `${new Date()}-${file.originalname}`);
    },
});
const upload = multer({ storage });
module.exports = (app) => {
    app.route('/admin/addmedicine')
        .post(upload.single('file'), admin_controller.addMedicine);
    app.route('/admin/updatemedicine')
        .post(upload.single('file'), admin_controller.updateMedicine);
    app.route('/admin/deletemedicine/:id')
        .get(admin_controller.deletemedicine);
    app.route('/admin/updateuser')
        .post(admin_controller.updateUser);
    app.route('/admin/deleteuser')
        .post(admin_controller.deleteUser);
    app.route('/admin/addcategory')
        .post(admin_controller.addCategory);
    app.route('/admin/updatecategory')
        .post(admin_controller.updateCategory);
    app.route('/admin/addcontributor')
        .post(admin_controller.addContributor);
    app.route('/admin/updatepublisher')
        .post(admin_controller.updateContributor);
    app.route('/admin/adduser')
        .post(admin_controller.addUser);
    app.route('/admin/getAllUser/:page')
        .get(admin_controller.getAllUser);
    app.route('/admin/login')
        .post(admin_controller.login);
}