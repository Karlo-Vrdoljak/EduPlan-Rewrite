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

// dohvat podataka o studentu, studiju i predmetima
router.get("/StudentStudij", function(req, res) {
    var conn = db.createConnection();
    var request = db.createRequest("EduPlanNew.spStudentStudij_Select", conn);

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

// dohvat podataka o obavijestima vezanim za studenta
router.get("/StudentObavijesti", function(req, res) {
    var conn = db.createConnection();
    var request = db.createRequest("EduPlanNew.spStudentObavijesti_Select", conn);

    request.addParameter('PkUsera', TYPES.Int, req.query.PkUsera);

    db.execStoredProc(request, conn, res, "{}");
});

// dohvat podataka o profesoru -> ne vraca nista jer je napravljeno za razvojnu bazu, a ne live (na njemu ne postoji procedura)
router.get('/Nastavnik', function (req, res) {
    var conn = db.createConnection();
    var request = db.createRequest('EduPlanNew.spNastavnik_Select', conn);

    request.addParameter('PkNastavnik', TYPES.Int, req.query.PkNastavnik);

    db.execStoredProc(request, conn, res, '{}');
});

// dohvat podataka o obavijestima vezanim za profesore
router.get("/ProfesorObavijesti", function(req, res) {
    var conn = db.createConnection();
    var request = db.createRequest("EduPlanNew.spStudentObavijesti_Select", conn); //promjenit na proceduru za profesora

    request.addParameter('PkUsera', TYPES.Int, req.query.PkUsera);

    db.execStoredProc(request, conn, res, "{}");
});

// dohvat podataka o ak.godinama
router.get("/AkademskaGodinaCombo", function(req, res) {
    var conn = db.createConnection();
    var request = db.createRequest("EduPlanNew.spAkGodinaComboBoxTemp_Select", conn); 
    db.execStoredProc(request, conn, res, "{}");
});



module.exports = router;
