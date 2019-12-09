export interface Satnice {
    PkSatnica:number;
    RbrSatnice:number;
    VrijemeDo:string;
    VrijemeOd:string;
}
export interface Predavaonica {
    PkPredavaonica:number;
    PkZgrada:number;
    SifraPredavaonice:string;
    PredavaonicaSkracenica:string;
    PredavaonicaNaziv:string;
    PkFakultetMaster:number;
    MasterFakultetNaziv:string;
}