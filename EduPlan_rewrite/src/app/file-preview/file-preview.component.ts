import { Component, OnInit, Input } from '@angular/core';
import { AppVariables } from './../_interfaces/_configAppVariables';
import { AppService } from 'src/app/_services/app.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, retry } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import { normalizeGenFileSuffix } from '@angular/compiler/src/aot/util';
import { DynamicDialogRef, DynamicDialogConfig, DialogService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { PDFDocumentProxy, PdfViewerModule  } from 'ng2-pdf-viewer';
import { Config } from '../config';
import { LanguageHandler } from '../app.languageHandler';
// import { ProfesorPredmetComponent } from '../profesor-predmet/profesor-predmet.component'


@Component({
  selector: 'app-file-preview',
  templateUrl: './file-preview.component.html',
  styleUrls: ['./file-preview.component.css']
})
export class FilePreviewComponent implements OnInit {

  @Input() data;
  datoteka;


  zoomSlider = 100;

  konfig: Config;

  loaded: boolean;
  pdfSrc: any;
  pdfSrcSanitizer: any;
  type;
  myFile;

  prikaziModal = true;
  prikaziSve = true; // prikazi sve ili samo prvu stranicu

  totalPages;
  constructor(
    private globalVar: AppVariables,
    private appServis: AppService,
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    public dialogService: DialogService, // Varijabla koja služi za servis dijalog
    public translate: TranslateService,  //Varijabla koja služi za prijevod
    public config: DynamicDialogConfig,
    public langHandler: LanguageHandler) {
    this.konfig = new Config();
    this.loaded = false;
  }

  ngOnInit() {
    if (typeof this.data !== 'undefined' && this.data.saKlijenta && !this.config.data.povecaj) {

      this.datoteka = {};
      this.datoteka.izvorniOriginalname = this.data.data.name;
      this.datoteka.originalname = this.data.data.name;
      this.datoteka.saKlijenta = true;
      this.datoteka.mimetype = this.data.data.type;
      this.type = this.data.data.type;

      //this.prikaziSve = false;
      this._saKlijenta();
    } else if (typeof this.config.data !== 'undefined' && this.config.data.povecaj && this.config.data.saKlijenta) {
      this.datoteka = this.config.data;
      this.type = this.datoteka.mimetype;

      //this.prikaziSve = true;
      this._saKlijenta();
    } else {
      if (typeof this.data !== 'undefined') {
        this.datoteka = this.data;

       // this.prikaziSve = false;
        this.getPreview();
      }
      if (typeof this.config.data !== 'undefined' && this.config.data.povecaj) {
        this.datoteka = this.config.data;

        this.myFile = this.datoteka.prosljedenBlob;
        this.type = this.datoteka.prosljedenType;

       // this.prikaziSve = true;

        this.getPreviewBezNode();
      }
    }
  }
  
  // onHideDialog() {
  //   this.profPredmet.onClosePreview();
  // }
  
  _saKlijenta() {
    this.loaded = false;
    this.pdfSrc = this.data ? this.data.file : this.datoteka.file;
    this.pdfSrcSanitizer = this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfSrc);
    this.datoteka.mimetype = this.type;
    if (this.datoteka.mimetype === 'video/mp4' || this.datoteka.mimetype === 'video/ogg' || this.datoteka.mimetype === 'video/webm') {
      const video = document.getElementById('video_here');
      if (video) {
        video.setAttribute('src', String(this.pdfSrc));
      }
    }
    if (this.datoteka.mimetype === 'audio/mpeg' || this.datoteka.mimetype === 'audio/mp3' || this.datoteka.mimetype === 'audio/ogg' || this.datoteka.mimetype === 'audio/wav') {
      if (this.datoteka.mimetype === 'audio/mp3') {
        this.type = 'audio/mpeg';
      }
      const audio = document.getElementById('audio_here');
      if (audio) {
        audio.setAttribute('src', String(this.pdfSrc));
      }
    }
    this.loaded = true;
  }

  // handleZoomSlider(e) {
  //   this.zoom = this.zoomSlider / 100;
  // }

  checkMimeTypeSupported(mimeType) {
    // niz podrzanih mimetype-ova za prikaz
    const supportedMimeTypes = [
      'video/mp4',
      'video/ogg',
      'video/webm',
      'audio/mpeg',
      'audio/mp3',
      'audio/ogg',
      'audio/wav',
      'image/jpeg',
      'image/png',
      'application/pdf'
    ];
    return supportedMimeTypes.includes(mimeType);
  }



  getData() {
    return this.http.get(encodeURI(this.konfig.API_URL + 'fileDownload2Object?originalname=' + this.datoteka.originalname + '&path=' + this.datoteka.path + '&mimetype=' + this.datoteka.mimetype + '&language=' + this.langHandler.getCurrentLanguage()), {
      responseType: 'blob' as 'json'
    })
      .pipe(
        retry(this.konfig.APIRetryCount), // retry failan request APIRetryCount puta
        catchError(this.appServis.handleError('pdfPreview'))
      );
  }
 
  getPreview() {
    this.loaded = false;
    let tempMimetype;

    if (this.datoteka.originalname) {
      // ako datoteka nema supported format prikazujem nofile.pdf
      if (!this.checkMimeTypeSupported(this.datoteka.mimetype)) {
        tempMimetype = 'application/pdf';
      } else {
        tempMimetype = this.datoteka.mimetype;
      }
      this.getData().subscribe(
        (result: any) => {
          if (result) {
            this.myFile = new Blob([result], {
              type: tempMimetype
            });
            this.type = tempMimetype;
            const reader = new FileReader();
            reader.onload = this._handleReaderLoaded.bind(this);
            reader.readAsDataURL(this.myFile);
            // // ovaj dio je za otvaranje popupa za printanje
            // let objectURL = URL.createObjectURL(this.myFile);
            // let frm = document.createElement('iframe');
            // frm.style.display = 'none';
            // frm.src = objectURL;
            // document.body.appendChild(frm);
            // frm.contentWindow.print();
          } else {
          }
        },
        () => {

        } // gotovo
      );
    }
  }

  getPreviewBezNode() {
    const reader = new FileReader();
    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(this.myFile);
  }

  _handleReaderLoaded(e) {
    const reader = e.target;
    this.pdfSrc = reader.result;
    this.pdfSrcSanitizer = this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfSrc);
    this.loaded = true;

    if (this.datoteka.mimetype === 'video/mp4' || this.datoteka.mimetype === 'video/ogg' || this.datoteka.mimetype === 'video/webm') {
      const video = document.getElementById('video_here');
      if (video) {
        video.setAttribute('src', String(this.pdfSrc));
      }
    }
    if (this.datoteka.mimetype === 'audio/mpeg' || this.datoteka.mimetype === 'audio/mp3' || this.datoteka.mimetype === 'audio/ogg' || this.datoteka.mimetype === 'audio/wav') {
      if (this.datoteka.mimetype === 'audio/mp3') {
        this.type = 'audio/mpeg';
      }
      const audio = document.getElementById('audio_here');
      if (audio) {
        audio.setAttribute('src', String(this.pdfSrc));
      }
    }
  }


  //pokretanje dialoga za uvećani prikaz pdfa
//   pdfPreviewLarge() {
//     //Varijabla za prijevod
//     const PovecaniPrikazDatoteke = this.translate.instant('POVECANI_PRIKAZ_DATOTEKE');
//     this.datoteka.povecaj = true;
//     this.datoteka.file = this.data.file;

//     this.datoteka.prosljedenBlob = this.myFile;
//     this.datoteka.prosljedenType = this.type;

//     const dialogRef = this.dialogService.open(FilePreviewComponent, {
//       data: this.datoteka,
//       header: PovecaniPrikazDatoteke,
//       width: '80%',
//       height: '100%',
//       // contentStyle: { 'overflow': 'scroll' },
//       styleClass: 'pdfPreviewLargeDialogCustomClass',
//       closable: true,
//       closeOnEscape: true
//     });
//     dialogRef.onClose.subscribe(
//       res => {
//         this.datoteka.povecaj = false;
//       },
//       () => { }
//     );
//   this.prikaziSve = true;

// }



  afterLoadComplete(pdf: PDFDocumentProxy) {
    this.totalPages = pdf.numPages;
  }



}

