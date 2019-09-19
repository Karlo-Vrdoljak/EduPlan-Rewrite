import {Routes, RouterModule} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import {DashboardDemoComponent} from './demo/view/dashboarddemo.component';
import {SampleDemoComponent} from './demo/view/sampledemo.component';
import {FormsDemoComponent} from './demo/view/formsdemo.component';
import {DataDemoComponent} from './demo/view/datademo.component';
import {PanelsDemoComponent} from './demo/view/panelsdemo.component';
import {OverlaysDemoComponent} from './demo/view/overlaysdemo.component';
import {MenusDemoComponent} from './demo/view/menusdemo.component';
import {MessagesDemoComponent} from './demo/view/messagesdemo.component';
import {MiscDemoComponent} from './demo/view/miscdemo.component';
import {EmptyDemoComponent} from './demo/view/emptydemo.component';
import {ChartsDemoComponent} from './demo/view/chartsdemo.component';
import {FileDemoComponent} from './demo/view/filedemo.component';
import {UtilsDemoComponent} from './demo/view/utilsdemo.component';
import {DocumentationComponent} from './demo/view/documentation.component';
import {StudentSviPredmetiComponent} from './student-svi-predmeti/student-svi-predmeti.component';
import { LoginComponent } from '../assets/pages/login.component';
import { StudentProsjeciComponent } from './student-prosjeci/student-prosjeci.component';

export const routes: Routes = [
           { path: '', redirectTo: '/login', pathMatch: 'full' },
           { path: 'login', component: LoginComponent },
           { path: 'sample', component: SampleDemoComponent },
           { path: 'forms', component: FormsDemoComponent },
           { path: 'data', component: DataDemoComponent },
           { path: 'panels', component: PanelsDemoComponent },
           { path: 'overlays', component: OverlaysDemoComponent },
           { path: 'menus', component: MenusDemoComponent },
           { path: 'messages', component: MessagesDemoComponent },
           { path: 'misc', component: MiscDemoComponent },
           { path: 'empty', component: EmptyDemoComponent },
           { path: 'charts', component: ChartsDemoComponent },
           { path: 'file', component: FileDemoComponent },
           { path: 'utils', component: UtilsDemoComponent },
           { path: 'documentation', component: DocumentationComponent },
           { path: 'vStudentProsjeci', component: StudentProsjeciComponent },
           { path: 'vStudentSviPredmeti', component: StudentSviPredmetiComponent }

       ];

export const AppRoutes: ModuleWithProviders = RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'});
