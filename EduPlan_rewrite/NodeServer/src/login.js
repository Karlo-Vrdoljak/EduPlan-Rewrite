var db = require('./db.js'),
    TYPES = require('tedious').TYPES,
    appConfig = require('./appConfig.js'),
    uuidv4 = require('uuid/v4'),
    crypto = require('crypto'),
    base64 = require('base-64'),
    logiraniKorisnici = [];

exports.dbLogin = function (req, res) {
    var currentTime = new Date().getTime();
    var XsatiPrije = currentTime - (appConfig.logiranBezAktivnosti * 60 * 60 * 1000);
    // prvo pocistimo array logirani korisnici od korisnika koji nisu nista radili vise od appConfig.logiranBezAktivnosti sati
    var filterUserInKorisnici = logiraniKorisnici.filter(e => e.accessDateTime > XsatiPrije);
    filterUserInKorisnici.forEach(f => logiraniKorisnici.splice(logiraniKorisnici.findIndex(e => e.accessDateTime === f.accessDateTime), 1));
    // u filtriranim su sada samo korisnici sa aktivnostima u zadnjih appConfig.logiranBezAktivnosti sati
    // postavimo sada samo aktivne korisnike u aktivni array
    logiraniKorisnici = filterUserInKorisnici;
    // call storedProc
    var conn = db.createConnection();
    var request = db.createRequest("Sigurnost.spApplicationUser_Login", conn);
    request.addParameter('userName', TYPES.NVarChar, req.body.korisnikIme);
    request.addParameter('password', TYPES.NVarChar, req.body.korisnikPass);
    // request.addParameter('password', TYPES.NVarChar, req.body.korisnikPass.length > 0 ? encrypt(req.body.korisnikPass) : null);
    db.execStoredProcNoJSONLocalResults(request, conn, req, res, pushLoginToken)
}

// postavlja objekt u array of objects
function pushLoginToken(resultData, req, res) {
    var currentTime = new Date().getTime();
    var isAdminDaNe = 0;
    // ako je rezultat spApplicationUser_Login ok onda
    // generira token (random string) i sprema ga
    // u lokalni global array kao: username / token / vrijemelogiranja.
    // ako nije vraá gresku prema klijentu
    // struktura povratnih podataka:
    // return objekt:{resultStatus: '', resultData: objekt (podaci ili error
    if (resultData.resultStatus === '0') {
        if (resultData.resultData[0].PkUsera > 0) {
            if (resultData.resultData[0].AdminDaNe) {
                if (resultData.resultData[0].AdminDaNe === true) {
                    isAdminDaNe = 1
                }
            }
            var loginToken = uuidv4();
            logiraniKorisnici.push({ userName: req.body.korisnikIme, loginToken: loginToken, accessDateTime: currentTime });
            const rezultat = {
                loginStatus: 'OK',
                loginToken: loginToken,
                loginResult: 'OK',
                loginFunction: isAdminDaNe,
                ObaveznaIzmjenaLozinkeDaNe: resultData.resultData[0].ObaveznaIzmjenaLozinkeDaNe,
                PkUsera: resultData.resultData[0].PkUsera
            };
            res.status(200)
            res.send(rezultat);
        } else {
            res.status(403).send({ error: 'Login failed !' });
        };
    } else {
        const rezultat = {
            loginStatus: 'NOK',
            loginToken: '',
            loginResult: resultData.message + ' in  ' + resultData.procName + ': ' + resultData.lineNumber,
            PkUsera: 0
        }
        res.status(500).send(rezultat);
    };
}

exports.checkIfLoggedIn = function (korisnikToken) {
    var existToken = logiraniKorisnici.filter(function (token) {
        return toString(token.korisnikToken) === toString(korisnikToken)
    });
    if (existToken) {
        if (existToken.length > 0) {
            return true;
        }
    }
    return false;
}

exports.userPassFromHeader = function (inputHeader) {
    var korisnikToken = '';
    if (inputHeader) {
        if (inputHeader.length > 0) {
            var korisnikToken = base64.decode(inputHeader); //kodirani podaci -- dekodiramo authdata
        }
    }
    return korisnikToken
};



//---------Funkcije za kriptiranje i dekriptiranje  lozinke
var encrypt = exports.encrypt = function (text) {
    // konfiguracijske varijable za kriptiranje 
    var algorithm = 'aes-256-cbc',
        password = 'alfabetLama92';
    let password_hash = crypto.createHash('md5').update(password, 'utf-8').digest('hex').toUpperCase();
    let iv = new Buffer.alloc(16); // fill with zeros
    var cipher = crypto.createCipheriv(algorithm, password_hash, iv),
        crypted = cipher.update(text, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}

function decrypt(text) {
    // konfiguracijske varijable za kriptiranje 
    var algorithm = 'aes-256-cbc',
        password = 'alfabetLama92';
    let password_hash = crypto.createHash('md5').update(password, 'utf-8').digest('hex').toUpperCase();
    let iv = new Buffer.alloc(16); // fill with zeros
    var decipher = crypto.createDecipheriv(algorithm, password_hash, iv);
    var dec = decipher.update(text, 'hex', 'utf8')
    dec += decipher.final('utf8');
    return dec;
}