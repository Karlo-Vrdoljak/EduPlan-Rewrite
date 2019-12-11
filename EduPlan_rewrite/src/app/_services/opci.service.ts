import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Config } from "../config";
import { catchError, retry } from "rxjs/operators";
import { AppService } from "./app.service";
import { DateTime } from "luxon";
import { TranslateService } from "@ngx-translate/core";
import { ProfesorService } from './profesori.service';



@Injectable({
    providedIn: "root"
})
export class OpciService {
    config: Config;

    constructor(private http: HttpClient, 
        private appService: AppService,
        private translate: TranslateService,
        private profesorService: ProfesorService
        ) {    
            this.config = new Config();
    }


    /**
     * @Opis Selecta sve akademske godine. Temp service (tria filtrirat po pkUsera, za sta treba procedura)
     * @Params null
     * @Returns Niz objekata
     */
    getAkademskeGodine() {
        return this.http.get(this.config.API_URL + "AkademskaGodinaCombo", {}).pipe(
            retry(this.config.APIRetryCount),
            catchError(this.appService.handleError("OpciService.getAkademskeGodine"))
        );
    }

    /**
     *  @Opis Selecta pkStudent i pkNastavnikSuradnik na osnovu logiranog pkUsera
     *  @Params pkUsera
     *  @Returns niz od jednog objekta
     */
    getKorisnikPodaci(data) {
        return this.http
            .get(this.config.API_URL + "KorisnikPodaci", {
                params: data
            })
            .pipe(
                retry(this.config.APIRetryCount),
                catchError(this.appService.handleError("OpciService.getKorisnikPodaci"))
            );
    }

    getDohvatDomicilnihVrijednostiEduCard(data) {
        return this.http
        .get(this.config.API_URL + "DohvatDomicilnihVrijednostiEduCard", {
            params: data
        })
        .pipe(
            retry(this.config.APIRetryCount),
            catchError(this.appService.handleError("OpciService.getDohvatDomicilnihVrijednostiEduCard"))
        );
    }
    postGetAuthToken() {
        return this.http
        .post(this.config.API_URL + "token", {})
        .pipe(
            retry(this.config.APIRetryCount),
            catchError(this.appService.handleError("OpciService.postGetAuthToken"))
        );
    }

     /**
     *  @Opis Formatira sve varijable zadanog niza objekata koje su iz baze dovucene kao string, a trebaju biti Date i format ovisi o odabranom jeziku
     *  @Params niz objekata nad kojim vršimo formatiranje, datepipe
     *  @Returns niz od jednog ili više objekata
     */
    formatDates(data: any) { 
        let locale = this.translate.instant("STUDENT_KALENDAR_LOCALE");

        data.forEach(element => {
          Object.keys(element).map(function (key) {
            if (DateTime.fromISO(element[key]).invalid) {
                return;
            }
            else {
                element[key] = new Date(element[key]).toLocaleDateString(locale);
            }
          });
        });
        return data;
    }
    /**
     *  @Opis Donese sve kalendarske događaje povezane na poslani datum + dan prije, ali u poslanoj predavaonici
     *  @Params Datum, PkPredavaonica
     *  @Returns niz od jednog ili više objekata
     */
    getPrikazDogadajaNaDatum(data) {
        return this.http
            .get(this.config.API_URL + "PrikazDogadajaNaDatum", {
                params: data
            })
            .pipe(
                retry(this.config.APIRetryCount),
                catchError(this.appService.handleError("OpciService.getPrikazDogadajaNaDatum"))
            );
    }
    /**
     * @Opis Dohvaca sve nastavne satnice sa svojim rednim brojem i vremenom od/do
     */
    getSveSatnicePoRednomBroju() {
        return this.http.get(this.config.API_URL + "SveSatnicePoRednomBroju", {}).pipe(
            retry(this.config.APIRetryCount),
            catchError(this.appService.handleError("OpciService.getSveSatnicePoRednomBroju"))
        );
    }
    getPredavaonice() {
      return this.http.get(this.config.API_URL + "Predavaonice", {}).pipe(
        retry(this.config.APIRetryCount),
        catchError(this.appService.handleError("OpciService.getPredavaonice"))
      );
    }
    
    /**
     * @Opis PRIKAZ extenzija u tablici
     */
    public extensionCellRenderer(params) {

        function checkAudioTypes(ext) {
          const audioTypes = [
            'aif',
            'cda',
            'mid',
            'midi',
            'mp3',
            'mpa',
            'ogg',
            'wav',
            'wma',
            'wpl'
          ];
          return audioTypes.includes(ext);
        }
    
        function checkCompressedTypes(ext) {
          const compressedTypes = [
            '7z',
            'arj',
            'deb',
            'pkg',
            'rar',
            'rpm',
            'z',
            'zip'
          ];
          return compressedTypes.includes(ext);
        }
    
        function checkDiscMediaTypes(ext) {
          const discMediaTypes = [
            'bin',
            'dmg',
            'iso',
            'toast',
            'vcd',
          ];
          return discMediaTypes.includes(ext);
        }
    
        function checkDataDatabaseTypes(ext) {
          const dataDatabaseTypes = [
            'csv',
            'dat',
            'db',
            'dbf',
            'log',
            'mdb',
            'sav',
            'sql',
            'tar',
            'xml'
          ];
          return dataDatabaseTypes.includes(ext);
        }
    
        function checkExecutableTypes(ext) {
          const executableTypes = [
            'apk',
            'bat',
            'bin',
            'cgi',
            'pl',
            'com',
            'exe',
            'gadget',
            'jar',
            'py',
            'wsf'
          ];
          return executableTypes.includes(ext);
        }
    
        function checkFontTypes(ext) {
          const fontTypes = [
            'fnt',
            'fon',
            'otf',
            'ttf'
          ];
          return fontTypes.includes(ext);
        }
    
        function checkImageTypes(ext) {
          const ImageTypes = [
            'ai',
            'bmp',
            'gif',
            'ico',
            'jpeg',
            'jpg',
            'png',
            'ps',
            'psd',
            'svg',
            'tif',
            'tiff'
          ];
          return ImageTypes.includes(ext);
        }
    
        function checkPresentationTypes(ext) {
          const PresentationTypes = [
            'key',
            'odp',
            'pps',
            'ppt',
            'pptx'
          ];
          return PresentationTypes.includes(ext);
        }
    
        function checkProgrammingTypes(ext) {
          const ProgrammingTypes = [
            'c',
            'class',
            'cpp',
            'cs',
            'h',
            'java',
            'sh',
            'swift',
            'vb'
          ];
          return ProgrammingTypes.includes(ext);
        }
    
        function checkSpreadsheetTypes(ext) {
          const SpreadsheetTypes = [
            'ods',
            'xlr',
            'xls',
            'xlsx'
          ];
          return SpreadsheetTypes.includes(ext);
        }
    
        function checkSystemTypes(ext) {
          const SystemTypes = [
            'bak',
            'cab',
            'cfg',
            'cpl',
            'cur',
            'dll',
            'dmp',
            'drv',
            'icns',
            'ico',
            'ini',
            'lnk',
            'msi',
            'sys',
            'tmp'
          ];
          return SystemTypes.includes(ext);
        }
    
        function checkVideoTypes(ext) {
          const VideoTypes = [
            '3g2',
            '3gp',
            'avi',
            'flv',
            'h264',
            'm4v',
            'mkv',
            'mov',
            'mp4',
            'mpg',
            'mpeg',
            'rm',
            'swf',
            'vob',
            'wmv'
          ];
          return VideoTypes.includes(ext);
        }
    
        function checkTextTypes(ext) {
          const TextTypes = [
            'doc',
            'docx',
            'odt',
            'pdf',
            'rtf',
            'tex',
            'txt',
            'wks',
            'wps',
            'wpd'
          ];
          return TextTypes.includes(ext);
        }
    
        let cellContent = '';
        let imagePath;
        let index;
        let fileType;
    
        try {
          let originalname;
          // ako pozivam iz grida ima params.data, ako iz pregleda klasifikacije dobijem samo originalname
          if (params && params.data) {
            originalname = params.data.izvorniOriginalname ? params.data.izvorniOriginalname : params.data.name;
          } else {
            originalname = params;
          }
    
          if (originalname) {
            index = originalname.lastIndexOf('.');
            fileType = (originalname.substring(index + 1, originalname.length)).toLowerCase();
    
            // najprije najucestalije
            if (fileType === 'pdf') {
              imagePath = 'assets/layout/images/fileExt/' + fileType + '.png';
            } else if (fileType === 'doc') {
              imagePath = 'assets/layout/images/fileExt/' + fileType + '.png';
            } else if (fileType === 'docx') {
              imagePath = 'assets/layout/images/fileExt/' + fileType + '.png';
            } else if (fileType === 'odt') {
              imagePath = 'assets/layout/images/fileExt/' + fileType + '.png';
            } else if (fileType === 'txt') {
              imagePath = 'assets/layout/images/fileExt/' + fileType + '.png';
            } else if (fileType === 'mp4') {
              imagePath = 'assets/layout/images/fileExt/' + fileType + '.png';
            } else if (fileType === 'mpg' || fileType === 'mpeg') {
              imagePath = 'assets/layout/images/fileExt/mpg.png';
            } else if (fileType === 'xls') {
              imagePath = 'assets/layout/images/fileExt/' + fileType + '.png';
            } else if (fileType === 'xlsx') {
              imagePath = 'assets/layout/images/fileExt/' + fileType + '.png';
            } else if (fileType === 'ppt') {
              imagePath = 'assets/layout/images/fileExt/' + fileType + '.png';
            } else if (fileType === 'jpeg' || fileType === 'jpg') {
              imagePath = 'assets/layout/images/fileExt/jpg.png';
            } else if (fileType === 'png') {
              imagePath = 'assets/layout/images/fileExt/' + fileType + '.png';
            } else if (fileType === 'xml') {
              imagePath = 'assets/layout/images/fileExt/' + fileType + '.png';
            } else if (fileType === 'mp3') {
              imagePath = 'assets/layout/images/fileExt/' + fileType + '.png';
            } else if (fileType === 'wav') {
              imagePath = 'assets/layout/images/fileExt/' + fileType + '.png';
            } else if (fileType === 'wma') {
              imagePath = 'assets/layout/images/fileExt/' + fileType + '.png';
              // ako nije ni jedna od gore navedenih provjeravam postoji li u ostalim listama i stavljam opceniti img za svaku grupu
            } else if (checkAudioTypes(fileType)) {
              imagePath = 'assets/layout/images/fileExt/sound-file.png';
            } else if (checkCompressedTypes(fileType)) {
              imagePath = 'assets/layout/images/fileExt/zip.png';
            } else if (checkDiscMediaTypes(fileType)) {
              imagePath = 'assets/layout/images/fileExt/data-storage.png';
            } else if (checkDataDatabaseTypes(fileType)) {
              imagePath = 'assets/layout/images/fileExt/database.png';
            } else if (checkExecutableTypes(fileType)) {
              imagePath = 'assets/layout/images/fileExt/exe.png';
            } else if (checkFontTypes(fileType)) {
              imagePath = 'assets/layout/images/fileExt/font.png';
            } else if (checkImageTypes(fileType)) {
              imagePath = 'assets/layout/images/fileExt/pictures.png';
            } else if (checkPresentationTypes(fileType)) {
              imagePath = 'assets/layout/images/fileExt/presentation.png';
            } else if (checkProgrammingTypes(fileType)) {
              imagePath = 'assets/layout/images/fileExt/code.png';
            } else if (checkSpreadsheetTypes(fileType)) {
              imagePath = 'assets/layout/images/fileExt/spreadsheet.png';
            } else if (checkSystemTypes(fileType)) {
              imagePath = 'assets/layout/images/fileExt/system.png';
            } else if (checkVideoTypes(fileType)) {
              imagePath = 'assets/layout/images/fileExt/video-file.png';
            } else if (checkTextTypes(fileType)) {
              imagePath = 'assets/layout/images/fileExt/word.png';
            } else {
              imagePath = 'assets/layout/images/fileExt/file.png';
            }
    
            cellContent += '<image src="' +
              imagePath + '" title="' + fileType + '" style="margin-top: 6px"></a> &nbsp;';
    
          }
    
    
        } catch (exception) {
    
        }
    
        if (params && params.data) {
          return cellContent;
        } else {
          return imagePath ? imagePath : 'assets/layout/images/fileExt/file.png';
        }
      }
    
    /**
     * @Opis upload Dokumenta
     */
      uploadDataDokumenti(data, fd) {
        return this.http.post(this.config.API_URL + 'fileUpload', fd, { params: { data: JSON.stringify(data) } })   
          .pipe(   
            retry(0), // retry failan request APIRetryCount puta    
            catchError(this.appService.handleError('OpciService.uploadDataDokumenti'))    
          );    
      }
}
