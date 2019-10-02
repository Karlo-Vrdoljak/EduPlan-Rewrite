var appConfig = {};

appConfig.checkAuthHeader = false; // true - provjera logina ukljucena, false - provjera logina iskljucena
appConfig.applicationPort = 8090;
appConfig.databaseServer = "lamasqlrazvoj";
appConfig.instanceName = "MSSQLSERVER";
appConfig.databaseName = "EduPlanRazvoj";
appConfig.username = "eduplannew";
appConfig.password = "eduplan";
appConfig.appVerzija = '0.9';
appConfig.uploadPath = '../uploads/';

module.exports = appConfig;