USE [EduPlanRazvoj]
GO
    /****** Object:  StoredProcedure [EduPlanNew].[spStudentUAkGodini_Select]    Script Date: 10/3/2019 9:01:49 AM ******/
SET
    ANSI_NULLS ON
GO
SET
    QUOTED_IDENTIFIER ON
GO
    CREATE PROCEDURE [EduPlanNew].[spStudentUAkGodini_Select] (@PkStudent INT) AS
    /************************************************************************************************************************************************************
    ** File 	:
    ** Name 	: [EduPlanNew].[spStudent_Select]
    ** DESC		: procedura vraca sve podatke o studentu
    ** Author	:
    **
    ** Date		: 02.10.2019.	
    *************************************************************************************************************************************************************
    ** Change history :
    *************************************************************************************************************************************************************
    ** Date:			Author:			Description :
    **------------		-------------	-------------------------------------
    **
    **
    **
    *************************************************************************************************************************************************************/
SET
    NOCOUNT ON
SET
    XACT_ABORT ON BEGIN TRY DECLARE @Err INT
SET
    TRANSACTION ISOLATION LEVEL READ UNCOMMITTED
SELECT
    ,T.PkStudentUAkademskojGodini
    ,T.PkSkolskaGodina
    ,SG.SkolskaGodinaNaziv
    ,T.PkStudent
    ,T.Prezime
    ,T.Ime
    ,T.PkZdravstvenoOsiguranje
    ,ZO.ZdravstvenoOsiguranjeNaziv
    ,T.PkBracnoStanje
    ,BS.NazivBracnoStanje
    ,T.PkDrzavaPrebivaliste
   , DP.NazivDrzave AS NazivDrzavePrebivaliste
    ,T.PkGradPrebivaliste
    ,GP.NazivGrada AS NazivGradaPrebivaliste
    ,T.AdresaPrebivaliste
    ,T.TelefonPrebivaliste
    ,T.PkDrzavaStanovanje
    ,DS.NazivDrzave AS NazivDrzaveStanovanje
    ,T.PkGradStanovanje
    ,GS.NazivGrada AS NazivGradaStanovanje
    ,T.AdresaStanovanje
    ,T.TelefonStanovanje
    ,T.PrimaStipendijuDaNE
    ,T.StudiraNaDrugomVisokomUcilistuDaNe
    ,T.PkRazinaPravaNaPrehranu
    ,RPNP.RazinaPravaNaPrehranuNaziv
    ,T.DatumIzdavanjaPotvrdeOPrebivalistu
    ,T.stanovanjeStatus
    ,T.PkOpcinaStanovanje
    ,OS.NazivOpcina
    ,T.DatumUNosa
    ,T.PkUseraUnos
    ,T.DatumZadnjePromjene
    ,T.RowVersion
    ,T.PkUsera
    ,KIZ.NazivKorisnika AS ImePrezimeUsera
    ,KU.NazivKorisnika AS ImePrezimeUseraUnos
FROM
    Student.StudentUAkademskojGodini AS T
    LEFT OUTER JOIN Nastava.SkolskaGodina AS SG ON SG.PkSkolskaGodina = T.PkSkolskaGodina
    LEFT OUTER JOIN Student.Student AS S ON S.PkStudent = T.PkStudent
    LEFT OUTER JOIN Katalozi.ZdravstvenoOsiguranje AS ZO ON ZO.PkZdravstvenoOsiguranje = T.PkZdravstvenoOsiguranje
    LEFT OUTER JOIN Katalozi.BracnoStanje AS BS ON BS.PkBracnoStanje = T.PkBracnoStanje
    LEFT OUTER JOIN Katalozi.Drzava AS DP ON DP.PKDrzave = T.PkDrzavaPrebivaliste
    LEFT OUTER JOIN Katalozi.Grad AS GP ON GP.PKGrada = T.PkGradPrebivaliste
    LEFT OUTER JOIN Katalozi.Drzava AS DS ON DS.PKDrzave = T.PkDrzavaStanovanje
    LEFT OUTER JOIN Katalozi.Grad AS GS ON GS.PKGrada = T.PkGradStanovanje
    LEFT OUTER JOIN Katalozi.RazinaPravaNaPrehranu AS RPNP ON RPNP.PkRazinaPravaNaPrehranu = T.PkRazinaPravaNaPrehranu
    LEFT OUTER JOIN Katalozi.Opcina AS OS ON OS.PkOpcina = T.PkOpcinaStanovanje
    LEFT OUTER JOIN Katalozi.Korisnik AS KU ON KU.PkUsera = T.PkUseraUnos
    LEFT OUTER JOIN Katalozi.Korisnik AS KIZ ON KIZ.PkUsera = T.PkUsera
WHERE
    PkStudent == @PkStudent FOR JSON PATH
SET
    TRANSACTION ISOLATION LEVEL READ COMMITTED
END TRY BEGIN CATCH
Set
    @Err = @ @Error if @ @TranCount > 0 RollBack Transaction EXEC Aplikacija.spErrHandler @Err,
    @ @PROCID
END CATCH
SET
    XACT_ABORT OFF
SET
    NOCOUNT OFF