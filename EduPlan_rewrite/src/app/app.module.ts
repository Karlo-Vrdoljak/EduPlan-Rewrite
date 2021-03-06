import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { LocationStrategy, HashLocationStrategy } from "@angular/common";
import { AppRoutes } from "./app.routes";
import { DatePipe } from '@angular/common'
import { SwiperModule } from 'ngx-swiper-wrapper';
import { SWIPER_CONFIG } from 'ngx-swiper-wrapper';


import { Config } from "./config";
import { AccordionModule } from "primeng/accordion";
import { AutoCompleteModule } from "primeng/autocomplete";
import {TriStateCheckboxModule} from 'primeng/tristatecheckbox';
import { BreadcrumbModule } from "primeng/breadcrumb";
import { ButtonModule } from "primeng/button";
import { CalendarModule } from "primeng/calendar";
import { CardModule } from "primeng/card";
import { CarouselModule } from "primeng/carousel";
import { ChartModule } from "primeng/chart";
import { CheckboxModule } from "primeng/checkbox";
import { ChipsModule } from "primeng/chips";
import { CodeHighlighterModule } from "primeng/codehighlighter";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { ColorPickerModule } from "primeng/colorpicker";
import { ContextMenuModule } from "primeng/contextmenu";
import { DataViewModule } from "primeng/dataview";
import { DialogModule } from "primeng/dialog";
import { DropdownModule } from "primeng/dropdown";
import { EditorModule } from "primeng/editor";
import { FieldsetModule } from "primeng/fieldset";
import { FileUploadModule } from "primeng/fileupload";
import { FullCalendarModule } from "primeng/fullcalendar";
import { GalleriaModule } from "primeng/galleria";
import { GrowlModule } from "primeng/growl";
import { InplaceModule } from "primeng/inplace";
import { InputMaskModule } from "primeng/inputmask";
import { InputSwitchModule } from "primeng/inputswitch";
import { InputTextModule } from "primeng/inputtext";
import { InputTextareaModule } from "primeng/inputtextarea";
import { LightboxModule } from "primeng/lightbox";
import { ListboxModule } from "primeng/listbox";
import { MegaMenuModule } from "primeng/megamenu";
import { MenuModule } from "primeng/menu";
import { MenubarModule } from "primeng/menubar";
import { MessagesModule } from "primeng/messages";
import { MessageModule } from "primeng/message";
import { MultiSelectModule } from "primeng/multiselect";
import { OrderListModule } from "primeng/orderlist";
import { OrganizationChartModule } from "primeng/organizationchart";
import { OverlayPanelModule } from "primeng/overlaypanel";
import { PaginatorModule } from "primeng/paginator";
import { PanelModule } from "primeng/panel";
import { PanelMenuModule } from "primeng/panelmenu";
import { PasswordModule } from "primeng/password";
import { PickListModule } from "primeng/picklist";
import { ProgressBarModule } from "primeng/progressbar";
import { RadioButtonModule } from "primeng/radiobutton";
import { RatingModule } from "primeng/rating";
import { ScrollPanelModule } from "primeng/scrollpanel";
import { SelectButtonModule } from "primeng/selectbutton";
import { SlideMenuModule } from "primeng/slidemenu";
import { SliderModule } from "primeng/slider";
import { SpinnerModule } from "primeng/spinner";
import { SplitButtonModule } from "primeng/splitbutton";
import { StepsModule } from "primeng/steps";
import { TabMenuModule } from "primeng/tabmenu";
import { TableModule } from "primeng/table";
import { TabViewModule } from "primeng/tabview";
import { TerminalModule } from "primeng/terminal";
import { TieredMenuModule } from "primeng/tieredmenu";
import { ToastModule } from "primeng/toast";
import { ToggleButtonModule } from "primeng/togglebutton";
import { ToolbarModule } from "primeng/toolbar";
import { TooltipModule } from "primeng/tooltip";
import {KeyFilterModule} from 'primeng/keyfilter';
import { TreeModule } from "primeng/tree";
import { TreeTableModule } from "primeng/treetable";
import { VirtualScrollerModule } from "primeng/virtualscroller";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { HttpClient } from "@angular/common/http";
import { MessageService, DialogService, DynamicDialogConfig } from "primeng/api";

import { AppComponent } from "./app.component";
import {
    AppMenuComponent,
    AppSubMenuComponent
} from "./app.menu-student.component";
import { AppSideBarComponent } from "./app.sidebar.component";
import { AppSideBarTabContentComponent } from "./app.sidebartabcontent.component";
import { AppTopBarComponent } from "./app.topbar.component";
import { AppFooterComponent } from "./app.footer.component";
import { DashboardDemoComponent } from "./demo/view/dashboarddemo.component";
import { SampleDemoComponent } from "./demo/view/sampledemo.component";
import { FormsDemoComponent } from "./demo/view/formsdemo.component";
import { DataDemoComponent } from "./demo/view/datademo.component";
import { PanelsDemoComponent } from "./demo/view/panelsdemo.component";
import { OverlaysDemoComponent } from "./demo/view/overlaysdemo.component";
import { MenusDemoComponent } from "./demo/view/menusdemo.component";
import { MessagesDemoComponent } from "./demo/view/messagesdemo.component";
import { MiscDemoComponent } from "./demo/view/miscdemo.component";
import { EmptyDemoComponent } from "./demo/view/emptydemo.component";
import { ChartsDemoComponent } from "./demo/view/chartsdemo.component";
import { FileDemoComponent } from "./demo/view/filedemo.component";
import { UtilsDemoComponent } from "./demo/view/utilsdemo.component";
import { DocumentationComponent } from "./demo/view/documentation.component";
import { AppMenuKalendarComponent } from "./app.menu-studentKalendar.component";
import { AppMenuProfesorComponent } from "./app.menu-profesor.component";
import { AppMenuProfesorKalendarComponent } from "./app.menu-profesorKalendar.component";

import { CarService } from "./demo/service/carservice";
import { CountryService } from "./demo/service/countryservice";
import { EventService } from "./demo/service/eventservice";
import { NodeService } from "./demo/service/nodeservice";
import { SubjectService } from "./demo/service/subjectService";
import { StudentService } from "./demo/service/studentService";
import { CalendarService } from "./_services/calendar.service";
import { StudentPodaciStudijService } from "./demo/service/studentPodaciStudijService";
import { StudentPodaciNaAkGodiniService } from "./demo/service/studentPodaciNaAkGodiniService";
import { StudentSviPredmetiComponent } from "./student-svi-predmeti/student-svi-predmeti.component";
import { LoginComponent } from "../assets/pages/login.component";
import { StudentProsjeciComponent } from "./student-prosjeci/student-prosjeci.component";
import { StudentOsobniPodaciComponent } from "./student-osobni-podaci/student-osobni-podaci.component";
import { StudentAgendaComponent } from "./student-agenda/student-agenda.component";
import { StudentCalendarComponent } from "./student-calendar/student-calendar.component";
import { TranslateSidebarComponent } from "./translate-sidebar/translate-sidebar.component";
import { StorageServiceModule } from "angular-webstorage-service";
import { LanguageHandler } from "./app.languageHandler";
import { StudentPodaciNaStudijuComponent } from "./student-podaci-na-studiju/student-podaci-na-studiju.component";
import { StudentPodaciNaAkgodiniComponent } from "./student-podaci-na-akgodini/student-podaci-na-akgodini.component";
import { StudentiService } from "./_services/studenti.service";
import { AppService } from "./_services/app.service";
import { StudentObavijestiComponent } from "./student-obavijesti/student-obavijesti.component";
import { ProfesorCalendarComponent } from "./profesor-calendar/profesor-calendar.component";
import { ProfesorAgendaComponent } from "./profesor-agenda/profesor-agenda.component";
import { ProfesorObavijestiComponent } from "./profesor-obavijesti/profesor-obavijesti.component";
import { ProfesorOsobniPodaciComponent } from "./profesor-osobni-podaci/profesor-osobni-podaci.component";
import { ProfesorSviPredmetiComponent } from "./profesor-svi-predmeti/profesor-svi-predmeti.component";
import { AppVariables } from "./_interfaces/_configAppVariables";
import { CalendarConfig } from "./_interfaces/_configCalendar";
import { ProfesorPredmetComponent } from './profesor-predmet/profesor-predmet.component';
import { ProfesorPregledKalendaraComponent } from './profesor-pregled-kalendara/profesor-pregled-kalendara.component';
import { ProfesorPregledAgendiComponent } from './profesor-pregled-agendi/profesor-pregled-agendi.component';
import { CookieService } from 'ngx-cookie-service';
import { StudentNastavniMaterijaliComponent } from './student-nastavni-materijali/student-nastavni-materijali.component';
import { FilePreviewComponent } from './file-preview/file-preview.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ProfesorOsobniDokumentiComponent } from './profesor-osobni-dokumenti/profesor-osobni-dokumenti.component';

@NgModule({
    imports: [
        PdfViewerModule,
        ReactiveFormsModule,
        SwiperModule,
        BrowserModule,
        FormsModule,
        AppRoutes,
        HttpClientModule,
        BrowserAnimationsModule,
        AccordionModule,
        AutoCompleteModule,
        BreadcrumbModule,
        ButtonModule,
        TriStateCheckboxModule,
        CalendarModule,
        CardModule,
        CarouselModule,
        ChartModule,
        CheckboxModule,
        ChipsModule,
        CodeHighlighterModule,
        ConfirmDialogModule,
        ColorPickerModule,
        ContextMenuModule,
        DataViewModule,
        DialogModule,
        DropdownModule,
        EditorModule,
        FieldsetModule,
        FileUploadModule,
        FullCalendarModule,
        GalleriaModule,
        GrowlModule,
        KeyFilterModule,
        InplaceModule,
        InputMaskModule,
        InputSwitchModule,
        InputTextModule,
        InputTextareaModule,
        LightboxModule,
        ListboxModule,
        MegaMenuModule,
        MenuModule,
        MenubarModule,
        MessageModule,
        MessagesModule,
        MultiSelectModule,
        OrderListModule,
        OrganizationChartModule,
        OverlayPanelModule,
        PaginatorModule,
        PanelModule,
        PanelMenuModule,
        PasswordModule,
        PickListModule,
        ProgressBarModule,
        RadioButtonModule,
        RatingModule,
        ScrollPanelModule,
        SelectButtonModule,
        SlideMenuModule,
        SliderModule,
        SpinnerModule,
        SplitButtonModule,
        StepsModule,
        TableModule,
        TabMenuModule,
        TabViewModule,
        TerminalModule,
        TieredMenuModule,
        ToastModule,
        ToggleButtonModule,
        ToolbarModule,
        TooltipModule,
        TreeModule,
        TreeTableModule,
        VirtualScrollerModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
        StorageServiceModule
    ],
    declarations: [
        AppComponent,
        AppMenuComponent,
        AppSubMenuComponent,
        AppSideBarComponent,
        AppSideBarTabContentComponent,
        AppTopBarComponent,
        AppFooterComponent,
        DashboardDemoComponent,
        SampleDemoComponent,
        FormsDemoComponent,
        DataDemoComponent,
        PanelsDemoComponent,
        OverlaysDemoComponent,
        MenusDemoComponent,
        MessagesDemoComponent,
        MessagesDemoComponent,
        MiscDemoComponent,
        ChartsDemoComponent,
        EmptyDemoComponent,
        FileDemoComponent,
        UtilsDemoComponent,
        DocumentationComponent,
        StudentSviPredmetiComponent,
        LoginComponent,
        StudentProsjeciComponent,
        StudentOsobniPodaciComponent,
        StudentAgendaComponent,
        StudentCalendarComponent,
        AppMenuKalendarComponent,
        TranslateSidebarComponent,
        StudentPodaciNaStudijuComponent,
        StudentPodaciNaAkgodiniComponent,
        StudentObavijestiComponent,
        ProfesorCalendarComponent,
        ProfesorAgendaComponent,
        AppMenuProfesorComponent,
        AppMenuProfesorKalendarComponent,
        ProfesorObavijestiComponent,
        ProfesorOsobniPodaciComponent,
        ProfesorSviPredmetiComponent,
        ProfesorPredmetComponent,
        ProfesorPregledKalendaraComponent,
        ProfesorPregledAgendiComponent,
        StudentNastavniMaterijaliComponent,
        FilePreviewComponent,
        ProfesorOsobniDokumentiComponent,
    ],
    entryComponents: [
        FilePreviewComponent
    ],
    providers: [
        { provide: {LocationStrategy, SWIPER_CONFIG },
          useClass: HashLocationStrategy   
        },
        SubjectService,
        StudentService,
        CalendarService,
        CarService,
        CountryService,
        EventService,
        NodeService,
        LanguageHandler,
        StudentPodaciStudijService,
        StudentPodaciNaAkGodiniService,
        StudentiService,
        AppService,
        Config,
        MessageService,
        AppVariables,
        CalendarConfig,
        LoginComponent,
        DatePipe,
        CookieService,
        DialogService,
        DynamicDialogConfig
        ],
    bootstrap: [AppComponent]
})
export class AppModule {}

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}
