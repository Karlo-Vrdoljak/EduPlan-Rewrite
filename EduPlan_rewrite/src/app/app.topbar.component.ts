import {Component, Inject, forwardRef} from '@angular/core';
import {AppComponent} from './app.component';
import { StudentiService } from './_services/studenti.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AppVariables } from './_interfaces/_configAppVariables';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent {

    akademskeGodine: any;
    akademskaGodinaSelected: any;
    studentPodaciNaAkGodinama: any;

    constructor(public app: AppComponent, private studentiService: StudentiService, private appVariables: AppVariables) {}

    ngOnInit() {

        this.studentiService.getAkademskeGodine().subscribe((data) => {
          this.akademskeGodine = data;
          this.akademskaGodinaSelected = data[0];
          this.appVariables.PkSkolskaGodina = this.akademskaGodinaSelected.PkSkolskaGodina;
        },
    
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            console.log('Client-side error occured.');
          } else {
            console.log('Server-side error occured.');
          }
        }, () => { });
      }

      setPkSkolskaGodina() {
        this.appVariables.PkSkolskaGodina = this.akademskaGodinaSelected.PkSkolskaGodina;
      }

}
