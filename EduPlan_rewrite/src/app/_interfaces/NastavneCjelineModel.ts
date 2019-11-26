export interface NastavneCjelineModel {
  NazivPredmetNastavnaCjelina: string;
  KorisnikUnos: string;
  DatumUnosa: string;
  KorisnikPromjena: string;
  DatumZadnjePromjene: string;
  KoristiSeDaNe: boolean;
  //pkNastavneCjeline: number; sadrži, ali se on generira u bazi, valjda
}
