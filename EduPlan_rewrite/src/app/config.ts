export class Config {
    // ----- API_URL ----------------------------------------------------------
    // url prema api-ima
    public API_URL = 'http://localhost:8090/api/';

    // ----- APIRetryCount ----------------------------------------------------
    // definira koliko puta ce se pozvati api ako pukne
    public APIRetryCount = 3;

    // ----- devMode ----------------------------------------------------------
    // 0 - kontrolira da li je korisnik logiran i spriječava navigaciju
    // 1 - ne kontrolira ništa i dopušta navigaciju
    public devMode = 1;

    // ----- maxUploadSize ----------------------------------------------------
    // odreduje maksimalnu velicinu datoteke kod uploada
    public maxUploadSize = 1000;

    // ----- trajanjeErrAlert -------------------------------------------------
    // definira trajanje alerta
    public trajanjeErrAlert = 4000;
}