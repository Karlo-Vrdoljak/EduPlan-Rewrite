var express = require('express'),
    appConfig = require('./appConfig.js'),
    db = require('./db.js'),
    request = require('request'),
    TYPES = require('tedious').TYPES,
    moment = require('moment'),
    login = require('./login.js'),
    accentRemover = require('./removeAccent.js'),
    fs = require('fs'),
    multer = require('multer'),
    router = express.Router();

// dohvat podataka o studentu
router.get('/Student', function (req, res) {
    var conn = db.createConnection();
    var request = db.createRequest('EduPlanNew.spStudent_Select', conn);

    request.addParameter('PkStudent', TYPES.Int, req.query.PkStudent);

    db.execStoredProc(request, conn, res, '{}');
});

// dohvat podataka o studentu, studiju i predmetima
router.get("/StudentNaVisokomUcilistuPredmet", function(req, res) {
    var conn = db.createConnection();
    var request = db.createRequest("EduPlanNew.spStudentNaVisokomUcilistuPredmet_Select", conn);

    request.addParameter("PkStudent", TYPES.Int, req.query.PkStudent);

    db.execStoredProc(request, conn, res, "{}");
});

// dohvat podataka o studentu na svim ak. godinama koje je pohadao
router.get("/StudentNaAkGodini", function(req, res) {
    var conn = db.createConnection();
    var request = db.createRequest("EduPlanNew.spStudentUAkGodini_Select", conn);

    request.addParameter("PkStudent", TYPES.Int, req.query.PkStudent);

    db.execStoredProc(request, conn, res, "{}");
});

module.exports = router;
