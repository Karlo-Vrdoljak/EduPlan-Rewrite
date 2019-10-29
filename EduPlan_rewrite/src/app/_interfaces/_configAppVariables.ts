export class AppVariables {
           PkStudent: number;
           PkSkolskaGodina: number;
           PkNastavnikSuradnik: number;
           PkUsera: number = 1122; //3675 stud Ana canat Turnusno, 1122 Stipe Vuko semestralno, 1038 prof iz semestralno
           emailSend = {
               from: "kv45531@unist.hr",
               to: "referada@oss.unist.hr",
               subject: null,
               text: null
           };
           domicilneVrijednostiEducard:any;
           EducardAktivan:number;
            //    NazivDomicilneVrijednosti: string;
            //    VrijednostPkDomicilneVrijednosti:number;
           constructor() {}
       }
