import { Component, Inject, forwardRef } from '@angular/core';
import { AppComponent } from './app.component';
import { OpciService } from './_services/opci.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AppVariables } from './_interfaces/_configAppVariables';
import { Router } from '@angular/router';

@Component({
  selector: 'app-topbar',
  templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent {


  akademskeGodine: any;
  akademskaGodinaSelected: any;
  studentPodaciNaAkGodinama: any;

  constructor(
    private router: Router,
    public app: AppComponent, 
    private opciService: OpciService, 
    private appVariables: AppVariables
    ) { }

  ngOnInit() {


    this.opciService.getAkademskeGodine().subscribe((data) => {
      this.akademskeGodine = data;
      this.akademskaGodinaSelected = this.akademskeGodine.filter((aktualnaGodina) => { return aktualnaGodina.AktualnaGodina === true })[0];
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
    console.log(this.router.url);
    let url = this.router.url;

    this.router
        .navigateByUrl("/", { skipLocationChange: true })
        .then(() => this.router.navigate([url]));

  }
}
