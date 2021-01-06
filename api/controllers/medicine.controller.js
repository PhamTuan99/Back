'use strict'
const medicine = require('../models/medicine.model');
const contributorController = require('../controllers/contributor.controller');
const authorController = require('../controllers/author.controller');
const categoryController = require('../controllers/category.controller');

exports.getTotalPage = (req, res) => {
    medicine.find({}, (err, docs) => {
        if (err) {
            console.log(err);
            res.status(500).json({ msg: err });
            return;
        }
        res.status(200).json({ data: parseInt((docs.length - 1) / 9) + 1 })
    })
}

exports.getAllMedicine = async(req, res) => {
    if ((typeof req.body.page === 'undefined')) {
        res.status(422).json({ msg: 'Invalid data' });
        return;
    }
    //Khoang gia
    let range = null;
    let objRange = null;
    if (typeof req.body.range !== 'undefined') {
        range = req.body.range;
        //objRange = JSON.parse(range);
        objRange = range;
    }
    //Search Text
    let searchText = "";
    if (typeof req.body.searchtext !== 'undefined') {
        searchText = req.body.searchtext;
    }
    let searchContributor = null;
    searchContributor = await contributorController.getIDBySearchText(searchText);
    // let searchAuthor = null;
    // searchAuthor = await authorController.getIDBySearchText(searchText);
    let searchCategory = null;
    searchCategory = await categoryController.getIDBySearchText(searchText);
    //Sap xep
    let sortType = "release_date";
    let sortOrder = "-1";
    if (typeof req.body.sorttype !== 'undefined') {
        sortType = req.body.sorttype;
    }
    if (typeof req.body.sortorder !== 'undefined') {
        sortOrder = req.body.sortorder;
    }
    if ((sortType !== "price") &&
        (sortType !== "release_date") &&
        (sortType !== "view_counts") &&
        (sortType !== "sales")) {
        res.status(422).json({ msg: 'Invalid sort type' });
        return;
    }
    if ((sortOrder !== "1") &&
        (sortOrder !== "-1")) {
        res.status(422).json({ msg: 'Invalid sort order' });
        return;
    }
    //Trang va tong so trang
    let medicineCount = null;
    try {
        if (range !== null) {
            medicineCount = await medicine
                .count({ $or: [{ name: new RegExp(searchText, "i") }, { id_nsx: { $in: searchContributor } }, { id_category: { $in: searchCategory } }], price: { $gte: objRange.low, $lte: objRange.high } });
        } else {
            medicineCount = await medicine.count({ $or: [{ name: new RegExp(searchText, "i") }, { id_nsx: { $in: searchContributor } }, { id_category: { $in: searchCategory } }] });
        }
    } catch (err) {
        res.status(500).json({ msg: err });
        return;
    }
    let totalPage = parseInt(((medicineCount - 1) / 9) + 1);
    let { page } = req.body;
    if ((parseInt(page) < 1) || (parseInt(page) > totalPage)) {
        res.status(200).json({ data: [], msg: 'Invalid page', totalPage });
        return;
    }
    //De sort
    let sortQuery = {}
    sortQuery[sortType] = sortOrder;
    //Lay du lieu
    if (range !== null) {
        medicine
            .find({ $or: [{ name: new RegExp(searchText, "i") }, { id_nsx: { $in: searchContributor } }, { id_category: { $in: searchCategory } }], price: { $gte: objRange.low, $lte: objRange.high } })
            .skip(9 * (parseInt(page) - 1))
            .limit(9)
            .sort(sortQuery)
            .exec((err, docs) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({ msg: err });
                    return;
                }
                res.status(200).json({ data: docs, totalPage });
            });
    } else {
        medicine
            .find({ $or: [{ name: new RegExp(searchText, "i") }, { id_nsx: { $in: searchContributor } }, { id_category: { $in: searchCategory } }] })
            .skip(9 * (parseInt(page) - 1))
            .limit(9)
            .sort(sortQuery)
            .exec((err, docs) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({ msg: err });
                    return;
                }
                res.status(200).json({ data: docs, totalPage });
            });
    }
}

exports.getMedicineByContributor = async(req, res) => {
    if ((typeof req.body.page === 'undefined') ||
        (typeof req.body.id === 'undefined')) {
        res.status(422).json({ msg: 'Invalid data' });
        return;
    }
    let { id, page } = req.body;
    //Khoang gia
    let range = null;
    let objRange = null;
    if (typeof req.body.range !== 'undefined') {
        range = req.body.range;
        //objRange = JSON.parse(range);
        objRange = range;
    }
    //Search Text
    let searchText = "";
    if (typeof req.body.searchtext !== 'undefined') {
        searchText = req.body.searchtext;
    }
    //Sap xep
    let sortType = "release_date";
    let sortOrder = "-1";
    if (typeof req.body.sorttype !== 'undefined') {
        sortType = req.body.sorttype;
    }
    if (typeof req.body.sortorder !== 'undefined') {
        sortOrder = req.body.sortorder;
    }
    if ((sortType !== "price") &&
        (sortType !== "release_date") &&
        (sortType !== "view_counts") &&
        (sortType !== "sales")) {
        res.status(422).json({ msg: 'Invalid sort type' });
        return;
    }
    if ((sortOrder !== "1") &&
        (sortOrder !== "-1")) {
        res.status(422).json({ msg: 'Invalid sort order' });
        return;
    }
    //Trang va tong so trang
    let medicineCount = null;
    try {
        if (range !== null) {
            medicineCount = await medicine
                .count({ name: new RegExp(searchText, "i"), id_nsx: id, price: { $gte: objRange.low, $lte: objRange.high } });
        } else {
            medicineCount = await medicine.count({ name: new RegExp(searchText, "i"), id_nsx: id });
        }
    } catch (err) {
        res.status(500).json({ msg: err });
        return;
    }
    let totalPage = parseInt(((medicineCount - 1) / 9) + 1);
    if ((parseInt(page) < 1) || (parseInt(page) > totalPage)) {
        res.status(200).json({ data: [], msg: 'Invalid page', totalPage });
        return;
    }
    //De sort
    let sortQuery = {}
    sortQuery[sortType] = sortOrder;
    //Lay du lieu
    if (range !== null) {
        medicine
            .find({ name: new RegExp(searchText, "i"), id_nsx: id, price: { $gte: objRange.low, $lte: objRange.high } })
            .skip(9 * (parseInt(page) - 1))
            .limit(9)
            .sort(sortQuery)
            .exec((err, docs) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({ msg: err });
                    return;
                }
                res.status(200).json({ data: docs, totalPage });
            });
    } else {
        medicine
            .find({ name: new RegExp(searchText, "i"), id_nsx: id })
            .skip(9 * (parseInt(page) - 1))
            .limit(9)
            .sort(sortQuery)
            .exec((err, docs) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({ msg: err });
                    return;
                }
                res.status(200).json({ data: docs, totalPage });
            });
    }
}

exports.getMedicineByCategory = async(req, res) => {
    if (typeof req.body.id === 'undefined' ||
        typeof req.body.page === 'undefined'
    ) {
        res.status(422).json({ msg: 'Invalid data' });
        return;
    }
    let { id, page } = req.body;
    //Khoang gia
    let range = null;
    let objRange = null;
    console.log(req.body.range)
    if (typeof req.body.range !== 'undefined') {
        range = req.body.range;
        objRange = range;
    }
    //Kiem tra text
    let searchText = "";
    if (typeof req.body.searchtext !== 'undefined') {
        searchText = req.body.searchtext;
    }
    //Sap xep
    let sortType = "release_date";
    let sortOrder = "-1";
    if (typeof req.body.sorttype !== 'undefined') {
        sortType = req.body.sorttype;
    }
    if (typeof req.body.sortorder !== 'undefined') {
        sortOrder = req.body.sortorder;
    }
    if ((sortType !== "price") &&
        (sortType !== "release_date") &&
        (sortType !== "view_counts") &&
        (sortType !== "sales")) {
        res.status(422).json({ msg: 'Invalid sort type' });
        return;
    }
    if ((sortOrder !== "1") &&
        (sortOrder !== "-1")) {
        res.status(422).json({ msg: 'Invalid sort order' });
        return;
    }
    //Tinh tong so trang
    let medicineCount, medicineFind;
    try {
        if (range === null) {
            medicineFind = await medicine.find({ id_category: id, name: new RegExp(searchText, "i") });
        } else {
            medicineFind = await medicine.find({ id_category: id, name: new RegExp(searchText, "i"), price: { $gte: objRange.low, $lte: objRange.high } });
        }
    } catch (err) {
        res.status(500).json({ msg: err });
        return;
    }
    medicineCount = medicineFind.length;
    let totalPage = parseInt(((medicineCount - 1) / 9) + 1);
    if (parseInt(page) < 1 || parseInt(page) > totalPage) {
        res.status(200).json({ data: [], msg: 'Invalid page', totalPage: totalPage });
        return;
    }
    //De sort
    let sortQuery = {}
    sortQuery[sortType] = sortOrder;
    //Lay du lieu
    if (range === null) {
        medicine.find({ id_category: id, name: new RegExp(searchText, "i") })
            .limit(9)
            .skip(9 * (page - 1))
            .sort(sortQuery)
            .exec((err, docs) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({ msg: err });
                    return;
                }
                res.status(200).json({ data: docs, totalPage: totalPage });
            })
    } else {
        medicine.find({ id_category: id, name: new RegExp(searchText, "i"), price: { $gte: objRange.low, $lte: objRange.high } })
            .limit(9)
            .skip(9 * (page - 1))
            .sort(sortQuery)
            .exec((err, docs) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({ msg: err });
                    return;
                }
                res.status(200).json({ data: docs, totalPage: totalPage });
            })
    }
}

exports.getmedicineByAuthor = async(req, res) => {
    if (typeof req.body.id === 'undefined' ||
        typeof req.body.page === 'undefined'
    ) {
        res.status(422).json({ msg: 'Invalid data' });
        return;
    }
    let { id, page } = req.body;
    //Khoang gia
    let range = null;
    let objRange = null;
    if (typeof req.body.range !== 'undefined') {
        range = req.body.range;
        objRange = range;
    }
    //Kiem tra text
    let searchText = "";
    if (typeof req.body.searchtext !== 'undefined') {
        searchText = req.body.searchtext;
    }
    //Sap xep
    let sortType = "release_date";
    let sortOrder = "-1";
    if (typeof req.body.sorttype !== 'undefined') {
        sortType = req.body.sorttype;
    }
    if (typeof req.body.sortorder !== 'undefined') {
        sortOrder = req.body.sortorder;
    }
    if ((sortType !== "price") &&
        (sortType !== "release_date") &&
        (sortType !== "view_counts") &&
        (sortType !== "sales")) {
        res.status(422).json({ msg: 'Invalid sort type' });
        return;
    }
    if ((sortOrder !== "1") &&
        (sortOrder !== "-1")) {
        res.status(422).json({ msg: 'Invalid sort order' });
        return;
    }
    //De sort
    let sortQuery = {}
    sortQuery[sortType] = sortOrder;
    //Tinh tong so trang
    let medicineCount, medicineFind;
    try {
        if (range === null) {
            medicineFind = await medicine.find({ id_author: id, name: new RegExp(searchText, "i") });
        } else {
            medicineFind = await medicine.find({ id_author: id, name: new RegExp(searchText, "i"), price: { $gte: objRange.low, $lte: objRange.high } });
        }
    } catch (err) {
        res.status(500).json({ msg: err });
        return;
    }
    medicineCount = medicineFind.length;
    let totalPage = parseInt(((medicineCount - 1) / 9) + 1);
    if (parseInt(page) < 1 || parseInt(page) > totalPage) {
        res.status(200).json({ data: [], msg: 'Invalid page', totalPage: totalPage });
        return;
    }
    //Lay du lieu
    if (typeof req.body.range === 'undefined') {
        medicine.find({ id_author: id, name: new RegExp(searchText, "i") })
            .limit(9)
            .skip(9 * (page - 1))
            .sort(sortQuery)
            .exec((err, docs) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({ msg: err });
                    return;
                }
                res.status(200).json({ data: docs, totalPage: totalPage });
            })
    } else {
        medicine.find({ id_author: id, name: new RegExp(searchText, "i"), price: { $gte: objRange.low, $lte: objRange.high } })
            .limit(9)
            .skip(9 * (page - 1))
            .sort(sortQuery)
            .exec((err, docs) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({ msg: err });
                    return;
                }
                res.status(200).json({ data: docs, totalPage: totalPage });
            });
    }
}

exports.getMedicineByID = async(req, res) => {
    if (req.params.id === 'undefined') {
        res.status(422).json({ msg: 'Invalid data' });
        return;
    }
    let result
    try {
        result = await medicine.findById(req.params.id);
    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: err })
        return;
    }
    if (result === null) {
        res.status(404).json({ msg: "not found" })
        return;
    }
    result.view_counts = result.view_counts + 1;
    result.save((err, docs) => {
        if (err) {
            console.log(err);
        }
    });
    res.status(200).json({ data: result })
}

exports.getRelatedMedicine = async(req, res) => {
    if (typeof req.params.medicineId === 'undefined') {
        res.status(422).json({ msg: 'Invalid data' });
        return;
    }
    let { medicineId } = req.params;
    let medicineObj = null;
    try {
        medicineObj = await medicine.findById(medicineId);
    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: err })
        return;
    }
    if (medicineObj === null) {
        res.status(200).json({ data: [], msg: 'Invalid medicineId' });
        return;
    }
    medicine
        .find({ $or: [{ $and: [{ id_category: medicineObj.id_category }, { _id: { $nin: [medicineId] } }] }, { $and: [{ _id: { $nin: [medicineId] } }] }] })
        .limit(5)
        .sort({ release_date: -1 })
        .exec((err, docs) => {
            if (err) {
                console.log(err);
                res.status(500).json({ msg: err });
                return;
            }
            res.status(200).json({ data: docs });
        });
}