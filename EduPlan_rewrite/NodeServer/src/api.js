var express = require("express"),
    appConfig = require("./appConfig.js"),
    db = require("./db.js"),
    request = require("request"),
    TYPES = require("tedious").TYPES,
    moment = require("moment"),
    login = require("./login.js"),
    accentRemover = require("./removeAccent.js"),
    fs = require("fs"),
    multer = require("multer"),
    router = express.Router();

// dohvat podataka o studentu
router.get("/Student", function(req, res) {
    var conn = db.createConnection();
    var request = db.createRequest("PregledKartice.spStudent_Select", conn);

    request.addParameter("PkStudent", TYPES.Int, req.query.PkStudent);

    db.execStoredProc(request, conn, res, "{}");
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

    request.addParameter("PkUsera", TYPES.Int, req.query.PkUsera);

    db.execStoredProc(request, conn, res, "{}");
});

// dohvat podataka o profesoru -> ne vraca nista jer je napravljeno za razvojnu bazu, a ne live (na njemu ne postoji procedura)
router.get("/Nastavnik", function(req, res) {
    var conn = db.createConnection();
    var request = db.createRequest("PregledKartice.spNastavnik_Select", conn);

    request.addParameter("PkNastavnik", TYPES.Int, req.query.PkNastavnik);

    db.execStoredProc(request, conn, res, "{}");
});

// dohvat podataka o obavijestima vezanim za profesore
router.get("/ProfesorObavijesti", function(req, res) {
    var conn = db.createConnection();
    var request = db.createRequest("PregledKartice.spStudentObavijesti_Select", conn); //promjenit na proceduru za profesora

    request.addParameter("PkUsera", TYPES.Int, req.query.PkUsera);

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
    var request = db.createRequest("PregledKartice.spPrikazDnevnogRasporedaZaStudenta", conn);

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
    var request = db.createRequest("PregledKartice.spUser_Select", conn);

    request.addParameter("PkUsera", TYPES.Int, req.query.pkUsera);

    db.execStoredProc(request, conn, res, "{}");
});

//dohvat podataka o svim predmetima koje profesor predaje na zadanoj akademskoj godini
router.get("/PrikazPredmetaProfesor", function(req, res) {
    var conn = db.createConnection();
    var request = db.createRequest( "PregledKartice.spPrikazPredmetaZaNastavnikaSuradnika", conn);

    request.addParameter("PkSkolskaGodina", TYPES.Int, req.query.PkSkolskaGodina);
    request.addParameter("PkNastavnikSuradnik",TYPES.Int, req.query.PkNastavnikSuradnik);
  
    db.execStoredProc(request, conn, res, "{}");
}); 

//dohvat podataka o predmetu na odredenom studiju 
router.get("/PrikazPredmetaOsnovniPodaci", function(req, res) {
    var conn = db.createConnection();
    var request = db.createRequest( "PregledKartice.spPredmetOsnovniPodaci_select", conn); 

    request.addParameter("PkSkolskaGodinaStudijPredmetKatedra", TYPES.Int, req.query.PkSkolskaGodinaStudijPredmetKatedra);

    db.execStoredProc(request, conn, res, "{}");
}); 

//dohvat podataka o studentima na odredenom predmetu
router.get("/PrikazStudenataPoPredmetu", function(req, res) {
    var conn = db.createConnection();
    var request = db.createRequest( "PregledKartice.spPredmetStudenti_select", conn); 

    request.addParameter("PkSkolskaGodinaStudijPredmetKatedra", TYPES.Int, req.query.PkSkolskaGodinaStudijPredmetKatedra);

    db.execStoredProc(request, conn, res, "{}");
}); 

// dohvat domiclinih podataka za EduCard
router.get("/DohvatDomicilnihVrijednostiEduCard", function(req, res) {
    var conn = db.createConnection();
    var request = db.createRequest( "PregledKartice.spKonfiguracijaDomicilnihVrijednostiEduCard_Select", conn);

    db.execStoredProc(request, conn, res, "{}");
}); 

//dohvat podataka o nastavnim cjelinama na odredenom predmetu 
router.get("/PrikazNastavnihCjelina", function(req, res) {
    var conn = db.createConnection();
    var request = db.createRequest( "PregledKartice.spPredmetNastavneCjeline_select", conn); 

    request.addParameter("PkPredmet", TYPES.Int, req.query.PkPredmet);

    db.execStoredProc(request, conn, res, "{}");
}); 


//Vraca sve otimbrane studente na nastavnoj satnici
router.get("/StudentPrisutnostNaNastavi", function(req, res) {
    req.query.PkNastavaPlan = req.query.PkNastavaPlan == "null" ? null : req.query.PkNastavaPlan;
    req.query.PkNastavaRealizacija = req.query.PkNastavaRealizacija == "null" ? null : req.query.PkNastavaRealizacija;


    var conn = db.createConnection();
    var request = db.createRequest("PregledKartice.spStudentPrisutnostNaNastavi_Select", conn); 
    
    request.addParameter("PkNastavaPlan", TYPES.Int, req.query.PkNastavaPlan);
    request.addParameter("PkNastavaRealizacija", TYPES.Int, req.query.PkNastavaRealizacija);

    db.execStoredProc(request, conn, res, "{}");
});


// Dohvaca sve otibrane studente za odredeni termin {Datum, PkSatnica, PkPredavaonica}
router.get("/StudentPrisutnostNaNastaviZaTermin", function(req, res) {

    var conn = db.createConnection();
    var request = db.createRequest("PregledKartice.spStudentPrisutnostNaNastaviZaTermin_Select", conn); 
    
    request.addParameter("PkPredavaonica", TYPES.Int, req.query.PkPredavaonica);
    request.addParameter("PkSatnica", TYPES.Int, req.query.PkSatnica);
    request.addParameter("Datum", TYPES.NVarChar, req.query.Datum);

    db.execStoredProc(request, conn, res, "{}");
});

// dohvat svih nastavnika suradnika
router.get("/NastavnikSuradnikSvi", function(req, res) {
    var conn = db.createConnection();
    var request = db.createRequest("PregledKartice.spNastavnikSuradnikSvi_select", conn);

    db.execStoredProc(request, conn, res, "{}");
}); 

// dohvat svih nastavnika suradnika 
router.get("/PrikazDogadajaNaDatum", function(req, res) {
    var conn = db.createConnection();
    var request = db.createRequest("PregledKartice.spPrikazDogadajaNaDatum_Select", conn);

    request.addParameter("Datum", TYPES.NVarChar, req.query.Datum);
    request.addParameter("PkPredavaonica", TYPES.Int, req.query.PkPredavaonica);

    db.execStoredProc(request, conn, res, "{}");
}); 

function prepareStudentTableData(data) {
    var tableParametar = {
        columns: [
            
            {
                name: 'PkStudent',
                type: TYPES.Int
            },
            { //typo u db
                name: 'PkEducardReaderData',
                type: TYPES.Int
            },
            {
                name: 'ProfesorIskljucioDaNe',
                type: TYPES.Bit
            },
            {
                name: 'PkStudij',
                type: TYPES.Int
            }
            
        ],
        rows: []
    };

    data.forEach(e => {
        tableParametar.rows.push([
            e.PkStudent,
            e.PkEduCardReaderData,
            e.ProfesorIskljucioDaNe,
            e.PkStudij
        ])
    });

    return tableParametar;
}
//slika varbinary(MAX)

router.post("/NastavaRealizacijaPlana", function(req, res) {
    var conn = db.createConnection();
    var request = db.createRequest("PregledKartice.spNastavaRealizacijaPlana_Insert", conn);
    
    var table = prepareStudentTableData(req.body.params.PrisutniStudenti);
    request.addParameter("PkNastavaPlan", TYPES.Int, req.body.params.PkNastavaPlan);
    request.addParameter("PkNastavnikSuradnik", TYPES.Int, req.body.params.PkNastavnikSuradnik);
    request.addParameter("PkUsera", TYPES.Int, req.body.params.PkUsera);
    request.addParameter("PkPredavaonica", TYPES.Int, req.body.params.PkPredavaonica);
    request.addParameter("Datum", TYPES.NVarChar, req.body.params.Datum);
    request.addParameter("PkSatnica", TYPES.Int, req.body.params.PkSatnica);

    request.addParameter('PrisutniStudenti', TYPES.TVP, table);
    
    db.execStoredProc(request, conn, res, "{}");
});

router.delete("/NastavaRealizacijaPlana", function(req, res) {
    var conn = db.createConnection();
    var request = db.createRequest("PregledKartice.spNastavaRealizacijaPlana_Delete", conn);
    request.addParameter("PkNastavaRealizacija", TYPES.Int, req.query.PkNastavaRealizacija);
    request.addParameter("PkUsera", TYPES.Int, req.query.PkUsera);

    
    db.execStoredProc(request, conn, res, "{}");
}); 

// nedovrsen api za kopiranje tokena iz ex2 u ex3
router.post('/setAuth',function(req, res) {
    localStorage.setItem("AuthToken",res);
}); 

//dohvat podataka o PodTipovima predavanja 
router.get('/getPodTipovePredavanja', function (req, res) {
    var conn = db.createConnection();
    var request = db.createRequest( "PregledKartice.spTipPredavanjaZaPredmet_Select", conn); 

    request.addParameter("PkSkolskaGodinaStudijPredmetKatedra", TYPES.Int, req.query.PkSkolskaGodinaStudijPredmetKatedra);

    db.execStoredProc(request, conn, res, "{}");
}); 

//dohvat podataka o nastavnim cjelinama na odredenom predmetu 
router.get('/getGrupeZaNastavu', function (req, res) {
    var conn = db.createConnection();
    var request = db.createRequest( "PregledKartice.spGrupaZaNastavuSkolskaGodina_ComboSelect", conn); 

    request.addParameter("PkPredmet", TYPES.Int, req.query.PkPredmet);
    request.addParameter("PkStudij", TYPES.Int, req.query.PkStudij);
    request.addParameter("PkSkolskaGodina", TYPES.Int, req.query.PkSkolskaGodina);
    request.addParameter("PkPodTipPredavanja", TYPES.Int, req.query.PkPodTipPredavanja);

    db.execStoredProc(request, conn, res, "{}");
});

router.get('/SveSatnicePoRednomBroju', function (req, res) {
    var conn = db.createConnection();
    var request = db.createRequest( "PregledKartice.spSveSatnicePoRednomBroju_Select", conn); 

    db.execStoredProc(request, conn, res, "{}");
});

//dohvat podataka o nastavnim cjelinama na odredenom predmetu 
router.get("/getStudentiRasporedeniPoGrupama", function(req, res) {
    var conn = db.createConnection();
    var request = db.createRequest("PregledKartice.spStudentiRasporedjeniPoGrupama",conn
);

    request.addParameter("PkSkolskaGodina",TYPES.Int, req.query.PkSkolskaGodina);
    request.addParameter("PkSkolskaGodinaStudijGrupaZaNastavu", TYPES.Int, req.query.PkSkolskaGodinaStudijGrupaZaNastavu);

    db.execStoredProc(request, conn, res, "{}");
}); 
// dohvat studenata za comboBox u kalendaru za realizaciju
router.get('/StudentiKalendarComboBox', function (req, res) {
    var conn = db.createConnection();
    var request = db.createRequest( "PregledKartice.spStudenti_Select", conn); 

    request.addParameter("PkSkolskaGodina",TYPES.Int, req.query.PkSkolskaGodina);

    db.execStoredProc(request, conn, res, "{}");
});

//Post req za dodavanje nove nastavnecjeline u bazu
router.post("/dodajNastavnaCjelina", function(req, res) {
    var conn = db.createConnection();
    var request = db.createRequest("PregledKartice.spPredmetNastavnaCjelina_Insert",conn);

    request.addParameter("PkPredmet", TYPES.Int, req.body.params.PkPredmet);
    request.addParameter("NazivPredmetNastavnaCjelina", TYPES.VarChar, req.body.params.NazivPredmetNastavnaCjelina);
    request.addParameter("KoristiSeDaNe", TYPES.Bit, req.body.params.KoristiSeDaNe);
    request.addParameter("PkUsera", TYPES.Int, req.body.params.PkUsera);


    db.execStoredProc(request, conn, res, "{}");
});

//Delete req za brisanje nastavne cjeline iz baze
router.delete("/izbrisiNastavnaCjelina", function(req, res) {
    var conn = db.createConnection();
    var request = db.createRequest("PregledKartice.spPredmetNastavnaCjelina_Delete", conn);
    
    request.addParameter("PkPredmetNastavnaCjelina", TYPES.Int, req.query.PkPredmetNastavnaCjelina);
    request.addParameter("PkUsera", TYPES.Int, req.query.PkUsera);

    
    db.execStoredProc(request, conn, res, "{}");
}); 

//Put req za update nastavne cjeline iz baze
router.put("/promjeniNastavnaCjelina", function(req, res) {
    var conn = db.createConnection();
    var request = db.createRequest("PregledKartice.spPredmetNastavnaCjelina_Update", conn);
    
    request.addParameter("PkPredmetNastavnaCjelina", TYPES.Int, req.body.params.PkPredmetNastavnaCjelina);
    request.addParameter("PkPredmet", TYPES.Int, req.body.params.PkPredmet);
    request.addParameter("NazivPredmetNastavnaCjelina", TYPES.VarChar, req.body.params.NazivPredmetNastavnaCjelina);
    request.addParameter("KoristiSeDaNe", TYPES.Bit, req.body.params.KoristiSeDaNe);
    request.addParameter("PkUsera", TYPES.Int, req.body.params.PkUsera);
    
    db.execStoredProc(request, conn, res, "{}");
}); 

// dohvat svih profesora na predmetu
router.get("/getProfesoriNaPredmetu", function(req, res) {
    var conn = db.createConnection();
    var request = db.createRequest("PregledKartice.spPrikazNastavnikaSuradnikaPoPredmetu", conn);

    request.addParameter("PkPredmet",TYPES.Int, req.query.PkPredmet);
    request.addParameter("PkSkolskaGodina", TYPES.Int, req.query.PkSkolskaGodina);

    db.execStoredProc(request, conn, res, "{}");
}); 

//Put req za update ocjene iz baze 
router.put("/promjenaOcjene", function(req, res) {
    var conn = db.createConnection();
    var request = db.createRequest("PregledKartice.spStudentOcjene_Update", conn);
 
    request.addParameter("PkStudentnaVisokomUcilistuPredmet", TYPES.Int, req.params.PkStudentnaVisokomUcilistuPredmet);
    request.addParameter("PkOcjenjivac", TYPES.Int, req.body.params.PkOcjenjivac);
    request.addParameter("PolozenDaNe", TYPES.Bit, req.body.params.PolozenDaNe);
    request.addParameter("OslobodjenPolaganjaDaNe", TYPES.Bit, req.body.params.OslobodjenPolaganjaDaNe);
    request.addParameter("Ocjena", TYPES.Int, req.body.params.Ocjena);
        
    db.execStoredProc(request, conn, res, "{}");
}); 

// dohvat svih predavaonica
router.get("/Predavaonice", function(req, res) {
    var conn = db.createConnection();
    var request = db.createRequest("PregledKartice.spPredavaonica_Select", conn);
    
    db.execStoredProc(request, conn, res, "{}");
}); 


module.exports = router;
