import { Satnice,Predavaonica } from './Satnice';
import { NastavnikSuradnik } from './NastavnikSuradnik';

export class AppVariables {
           PkStudent: number; // 132 razvojna, student koji ima nastavne materijale unesene za pkpredmet 207
           PkSkolskaGodina: number;
           PkNastavnikSuradnik: number; //za 1038 je 113
           SelectedPkNastavnikSuradnik: NastavnikSuradnik; // iz drugih kalendara odabran prof
           PkUsera: number = 2229; //3675 stud Ana canat Turnusno, 2185 Monika Sarač semestralno, 1038 prof iz semestralno, 2229 student u razvojnoj
           PkSkolskaGodinaStudijPredmetKatedra: number 
           emailSend = {
               from: "kv45531@unist.hr",
               to: "referada@oss.unist.hr",
               subject: null,
               text: null
           };
           domicilneVrijednosti: any;
           EducardAktivan: number;
           //    NazivDomicilneVrijednosti: string;
           //    VrijednostPkDomicilneVrijednosti:number;
           editOcjenaEnabled: number;
           minOcjena: number;
           maxOcjena: number;
           negativnaOcjena: number;
           ObaveznoOcitavanjeSvakiSatDaNe: number;
           granicneSatnice:Satnice[];
           sveSatnice:Satnice[];
           constructor() {}
           Predavaonice:Predavaonica[];
       }
