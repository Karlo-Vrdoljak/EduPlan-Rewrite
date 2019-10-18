import { Routes, RouterModule} from '@angular/router';
import { ModuleWithProviders} from '@angular/core';
import { DashboardDemoComponent} from './demo/view/dashboarddemo.component';
import { SampleDemoComponent} from './demo/view/sampledemo.component';
import { FormsDemoComponent} from './demo/view/formsdemo.component';
import { DataDemoComponent} from './demo/view/datademo.component';
import { PanelsDemoComponent} from './demo/view/panelsdemo.component';
import { OverlaysDemoComponent} from './demo/view/overlaysdemo.component';
import { MenusDemoComponent} from './demo/view/menusdemo.component';
import { MessagesDemoComponent} from './demo/view/messagesdemo.component';
import { MiscDemoComponent} from './demo/view/miscdemo.component';
import { EmptyDemoComponent} from './demo/view/emptydemo.component';
import { ChartsDemoComponent} from './demo/view/chartsdemo.component';
import { FileDemoComponent} from './demo/view/filedemo.component';
import { UtilsDemoComponent} from './demo/view/utilsdemo.component';
import { DocumentationComponent} from './demo/view/documentation.component';
import { StudentSviPredmetiComponent} from './student-svi-predmeti/student-svi-predmeti.component';
import { LoginComponent } from '../assets/pages/login.component';
import { StudentProsjeciComponent } from './student-prosjeci/student-prosjeci.component';
import { StudentOsobniPodaciComponent } from './student-osobni-podaci/student-osobni-podaci.component';
import { StudentAgendaComponent } from './student-agenda/student-agenda.component';
import { StudentCalendarComponent } from './student-calendar/student-calendar.component';
import { StudentPodaciNaAkgodiniComponent } from './student-podaci-na-akgodini/student-podaci-na-akgodini.component';
import { TranslateSidebarComponent } from './translate-sidebar/translate-sidebar.component';
import { StudentPodaciNaStudijuComponent } from './student-podaci-na-studiju/student-podaci-na-studiju.component';
import { StudentObavijestiComponent } from './student-obavijesti/student-obavijesti.component';
import { ProfesorCalendarComponent } from './profesor-calendar/profesor-calendar.component';
import { ProfesorAgendaComponent } from "./profesor-agenda/profesor-agenda.component";
import { ProfesorObavijestiComponent } from './profesor-obavijesti/profesor-obavijesti.component';
import { ProfesorSviPredmetiComponent } from './profesor-svi-predmeti/profesor-svi-predmeti.component';
import { ProfesorOsobniPodaciComponent } from './profesor-osobni-podaci/profesor-osobni-podaci.component';


export const routes: Routes = [
           { path: "", redirectTo: "/login", pathMatch: "full" },
           { path: "login", component: LoginComponent },
           { path: "sample", component: SampleDemoComponent },
           { path: "forms", component: FormsDemoComponent },
           { path: "data", component: DataDemoComponent },
           { path: "panels", component: PanelsDemoComponent },
           { path: "overlays", component: OverlaysDemoComponent },
           { path: "menus", component: MenusDemoComponent },
           { path: "messages", component: MessagesDemoComponent },
           { path: "misc", component: MiscDemoComponent },
           { path: "empty", component: EmptyDemoComponent },
           { path: "charts", component: ChartsDemoComponent },
           { path: "file", component: FileDemoComponent },
           { path: "utils", component: UtilsDemoComponent },
           { path: "documentation", component: DocumentationComponent },
           { path: "vStudentProsjeci", component: StudentProsjeciComponent },
           { path: "vStudentSviPredmeti", component: StudentSviPredmetiComponent },
           { path: "vStudentOsobniPodaci", component: StudentOsobniPodaciComponent },
           { path: "vStudentAgenda", component: StudentAgendaComponent },
           { path: "vStudentAgenda/:isRedirect", component: StudentAgendaComponent },
           { path: "vStudentKalendar", component: StudentCalendarComponent },
           { path: "translate/:lang", component: TranslateSidebarComponent },
           { path: "vStudentPodaciStudij", component: StudentPodaciNaStudijuComponent },
           { path: "vStudentPodaciNaAkGodini", component: StudentPodaciNaAkgodiniComponent},
           { path: "vStudentObavijesti", component: StudentObavijestiComponent},
           { path: "vProfesorKalendar", component: ProfesorCalendarComponent },
           { path: "vProfesorAgenda", component: ProfesorAgendaComponent },
           { path: "vProfesorAgenda/:isRedirect", component: ProfesorAgendaComponent },
           { path: "vProfesorObavijesti", component: ProfesorObavijestiComponent },
           { path: "vProfesorOsobniPodaci", component: ProfesorOsobniPodaciComponent },
           { path: "vProfesorPredmeti", component: ProfesorSviPredmetiComponent }

       ];

export const AppRoutes: ModuleWithProviders = RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled', onSameUrlNavigation: 'reload'});
