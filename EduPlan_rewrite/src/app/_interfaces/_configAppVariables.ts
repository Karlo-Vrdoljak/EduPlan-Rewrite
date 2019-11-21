export class AppVariables {
           PkStudent: number;
           PkSkolskaGodina: number;
           PkNastavnikSuradnik: number;
           PkUsera: number = 1038; //3675 stud Ana canat Turnusno, 2185 Monika Sarač semestralno, 1038 prof iz semestralno
           PkSkolskaGodinaStudijPredmetKatedra: number 
           emailSend = {
               from: "kv45531@unist.hr",
               to: "referada@oss.unist.hr",
               subject: null,
               text: null
           };
           domicilneVrijednostiEducard: any;
           EducardAktivan: number;
           //    NazivDomicilneVrijednosti: string;
           //    VrijednostPkDomicilneVrijednosti:number;
           constructor() {}
       }
