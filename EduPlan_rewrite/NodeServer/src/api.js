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
    var request = db.createRequest('PregledKartice.spStudent_Select', conn);

    request.addParameter('PkStudent', TYPES.Int, req.query.PkStudent);

    db.execStoredProc(request, conn, res, '{}');
});

// dohvat podataka o studentu, studiju i predmetima
router.get("/StudentNaVisokomUcilistuPredmet", function(req, res) {
    var conn = db.createConnection();
    var request = db.createRequest("PregledKartice.spStudentNaVisokomUcilistuPredmet_Select", conn);

    request.addParameter("PkStudent", TYPES.Int, req.query.PkStudent);

    db.execStoredProc(request, conn, res, "{}");
});

// dohvat podataka o studentu, studiju i predmetima
router.get("/StudentStudij", function(req, res) {
    var conn = db.createConnection();
    var request = db.createRequest("PregledKartice.spStudentStudij_Select", conn);

    request.addParameter("PkStudent", TYPES.Int, req.query.PkStudent);

    db.execStoredProc(request, conn, res, "{}");
});

// dohvat podataka o studentu na svim ak. godinama koje je pohadao
router.get("/StudentNaAkGodini", function(req, res) {
    var conn = db.createConnection();
    var request = db.createRequest("PregledKartice.spStudentUAkGodini_Select", conn);

    request.addParameter("PkStudent", TYPES.Int, req.query.PkStudent);

    db.execStoredProc(request, conn, res, "{}");
});

// dohvat podataka o obavijestima vezanim za studenta
router.get("/StudentObavijesti", function(req, res) {
    var conn = db.createConnection();
    var request = db.createRequest("PregledKartice.spStudentObavijesti_Select", conn);

    request.addParameter('PkUsera', TYPES.Int, req.query.PkUsera);

    db.execStoredProc(request, conn, res, "{}");
});

// dohvat podataka o profesoru -> ne vraca nista jer je napravljeno za razvojnu bazu, a ne live (na njemu ne postoji procedura)
router.get('/Nastavnik', function (req, res) {
    var conn = db.createConnection();
    var request = db.createRequest('PregledKartice.spNastavnik_Select', conn);

    request.addParameter('PkNastavnik', TYPES.Int, req.query.PkNastavnik);

    db.execStoredProc(request, conn, res, '{}');
});

// dohvat podataka o obavijestima vezanim za profesore
router.get("/ProfesorObavijesti", function(req, res) {
    var conn = db.createConnection();
    var request = db.createRequest("PregledKartice.spStudentObavijesti_Select", conn); //promjenit na proceduru za profesora

    request.addParameter('PkUsera', TYPES.Int, req.query.PkUsera);

    db.execStoredProc(request, conn, res, "{}");
});

// dohvat podataka o ak.godinama
router.get("/AkademskaGodinaCombo", function(req, res) {
    var conn = db.createConnection();
    var request = db.createRequest("PregledKartice.spAkGodinaComboBoxTemp_Select", conn); 
    db.execStoredProc(request, conn, res, "{}");
});


// dohvat rasporeda studente
router.get("/PrikazRasporedaStudent", function(req, res) {
    var conn = db.createConnection();
    var request = db.createRequest(
        "PregledKartice.spPrikazDnevnogRasporedaZaStudenta",
        conn
    );


    request.addParameter("DatumOd", TYPES.NVarChar, req.query.DatumOd);
    request.addParameter("DatumDo", TYPES.NVarChar, req.query.DatumDo);
    request.addParameter("PkStudent", TYPES.Int, req.query.PkStudent);
    // request.addParameter("PkSkolskaGodina", TYPES.Int, req.query.PkSkolskaGodina);

    db.execStoredProc(request, conn, res, "{}");
});

// dohvat rasporeda studente
router.get("/PrikazRasporedaProfesor", function(req, res) {
    var conn = db.createConnection();
    var request = db.createRequest(
        "PregledKartice.spPrikazDnevnogRasporedaZaNastavnikaSuradnika",
        conn
    );


    request.addParameter("DatumOd", TYPES.NVarChar, req.query.DatumOd);
    request.addParameter("DatumDo", TYPES.NVarChar, req.query.DatumDo);
    request.addParameter("PkNastavnikSuradnik", TYPES.Int, req.query.PkNastavnikSuradnik);
    // request.addParameter("PkSkolskaGodina", TYPES.Int, req.query.PkSkolskaGodina);

    db.execStoredProc(request, conn, res, "{}");
});

//dohvat podataka o logiranom useru
router.get("/KorisnikPodaci", function(req, res) {
    var conn = db.createConnection();
    var request = db.createRequest( "PregledKartice.spUser_Select", conn);

    request.addParameter("PkUsera", TYPES.Int, req.query.pkUsera);
  
    db.execStoredProc(request, conn, res, "{}");
});

//dohvat podataka o logiranom useru
router.get("/PrikazPredmetaProfesor", function(req, res) {
    var conn = db.createConnection();
    var request = db.createRequest( "PregledKartice.spPrikazPredmetaZaNastavnikaSuradnika", conn);

    request.addParameter("PkSkolskaGodina", TYPES.Int, req.query.PkSkolskaGodina);
    request.addParameter("PkNastavnikSuradnik",TYPES.Int, req.query.PkNastavnikSuradnik);
  
    db.execStoredProc(request, conn, res, "{}");
}); 

module.exports = router;
