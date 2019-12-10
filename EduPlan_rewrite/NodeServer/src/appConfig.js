var appConfig = {};

appConfig.checkAuthHeader = false; // true - provjera logina ukljucena, false - provjera logina iskljucena
appConfig.applicationPort = 8090;
appConfig.databaseServer = "lamasqlrazvoj";
// appConfig.databaseServer = "cloudvm2.westeurope.cloudapp.azure.com";
// appConfig.instanceName = "MSSQLSERVER";
appConfig.instanceName = "MSSQLSERVER";
// appConfig.databaseName = "EduPlan_Turnusno";
appConfig.databaseName = "EduPlanRazvoj";
// appConfig.databaseName = "EduPlan_Semestralno";
// appConfig.username = "sa";
// appConfig.password = "Glupan2000";
appConfig.username = "eduplannew";
appConfig.password = "eduplan";
appConfig.appVerzija = '0.9';
appConfig.uploadPath = '../uploads/';

options: {
    encrypt: true
}

module.exports = appConfig;
