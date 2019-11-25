import {Component, AfterViewInit, OnDestroy, Renderer2, OnInit, Inject} from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from "@ngx-translate/core";
import { LOCAL_STORAGE, WebStorageService } from "angular-webstorage-service";
import { LanguageHandler } from './app.languageHandler';
import { EmailMessage } from './_interfaces/EmailMessage';
import { AppVariables } from "./_interfaces/_configAppVariables";
import { DocimilneVrijednosti } from './_interfaces/DocimilneVrijednosti';
import { CalendarConfig } from './_interfaces/_configCalendar';
import { LoginComponent } from 'src/assets/pages/login.component';
import { OpciService } from './_services/opci.service';

enum MenuOrientation {
    STATIC,
    OVERLAY
}

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
    activeTabIndex = -1;

    sidebarActive = false;

    layoutMode: MenuOrientation = MenuOrientation.STATIC;

    topbarMenuActive: boolean;

    overlayMenuActive: boolean;

    displayEmailSender: boolean = false;

    staticMenuDesktopInactive: boolean;

    staticMenuMobileActive: boolean;

    rotateMenuButton: boolean;

    sidebarClick: boolean;

    topbarItemClick: boolean;

    menuButtonClick: boolean;

    activeTopbarItem: any;

    emailSend: EmailMessage;

    documentClickListener: () => void;

    public data: any = [];
    theme = "green";

    DomicilneVrijednostiParams = {};

    constructor(
        public renderer: Renderer2,
        public router: Router,
        private translate: TranslateService,
        @Inject(LOCAL_STORAGE) private storage: WebStorageService,
        private languageHandler: LanguageHandler,
        private appVariables: AppVariables,
        private opciService: OpciService
    ) {}

    ngOnInit(): void {
        // Dummy podaci
        this.emailSend = this.appVariables.emailSend;

        const lang = this.languageHandler.setDefaultLanguage().getCurrentLanguage();
        this.translate.use(lang);

        if (this.appVariables.PkStudent == null && this.appVariables.PkNastavnikSuradnik == null) {
            this.router.navigate(["/login"]);
        }

        this.setupCalendarOrientationEvent();

        this.setupDomicilneVrijednostiEduCard();
    }

    ngAfterViewInit() {
        this.documentClickListener = this.renderer.listen("body", "click", event => {
            if (!this.topbarItemClick) {
                this.activeTopbarItem = null;
                this.topbarMenuActive = false;
            }

            if (
                !this.menuButtonClick &&
                !this.sidebarClick &&
                (this.overlay || !this.isDesktop())
            ) {
                this.sidebarActive = false;
            }

            this.topbarItemClick = false;
            this.sidebarClick = false;
            this.menuButtonClick = false;
        });
    }

    /**
     * @Opis Api poziv za dohvat Domicilnih vrijednosti
     * @Params DomicilneVrijednostiParams null
     * @Returns Objekt koji definira domicilne vrijednosti
     */
    setupDomicilneVrijednostiEduCard() {
        this.opciService.getDohvatDomicilnihVrijednostiEduCard(this.DomicilneVrijednostiParams)
            .subscribe((data:DocimilneVrijednosti[]) => {
                this.appVariables.domicilneVrijednosti = data;
                this.appVariables.EducardAktivan = Array.from(data).find(
                    (e: DocimilneVrijednosti) => {
                        return e.NazivDomicilneVrijednosti == "EducardAktivanDaNe";
                    }
                ).VrijednostPkDomicilneVrijednosti
                this.appVariables.minOcjena = Array.from(data).find(
                    (e: DocimilneVrijednosti) => {
                        return e.NazivDomicilneVrijednosti == "minOcjena";
                    }
                ).VrijednostPkDomicilneVrijednosti
                this.appVariables.maxOcjena = Array.from(data).find(
                    (e: DocimilneVrijednosti) => {
                        return e.NazivDomicilneVrijednosti == "maxOcjena";
                    }
                ).VrijednostPkDomicilneVrijednosti
                this.appVariables.negativnaOcjena = Array.from(data).find(
                    (e: DocimilneVrijednosti) => {
                        return e.NazivDomicilneVrijednosti == "negativnaOcjena";
                    }
                ).VrijednostPkDomicilneVrijednosti
                this.appVariables.editOcjenaEnabled = Array.from(data).find(
                    (e: DocimilneVrijednosti) => {
                        return e.NazivDomicilneVrijednosti == "EditOcjenaDaNe";
                    }
                ).VrijednostPkDomicilneVrijednosti
            });
    }

    /**
     * @Opis reroute-a u Agendu ili Kalendar ovisno o rotaciji ekrana mobitela
     * @Params null
     * @Returns null
     * @callback orientationchange
     */
    setupCalendarOrientationEvent() {
        window.addEventListener("orientationchange", () => {
            switch (true) {
                case screen.width <= 600 && this.router.url == "/vStudentKalendar": {
                    this.router.navigate(["/vStudentAgenda", "sm"]);
                    break;
                }
                case screen.width >= 600 && this.router.url == "/vStudentAgenda/sm": {
                    this.router.navigate(["/vStudentKalendar"]);
                    break;
                }
                case screen.width <= 600 && this.router.url == "/vProfesorKalendar": {
                    this.router.navigate(["/vProfesorAgenda", "sm"]);
                    break;
                }
                case screen.width >= 600 && this.router.url == "/vProfesorAgenda/sm": {
                    this.router.navigate(["/vProfesorKalendar"]);
                    break;
                }
                case screen.width <= 600 && this.router.url == "/vPregledProfesorKalendar": {
                    this.router.navigate(["/vPregledProfesorAgenda", "sm"]);
                    break;
                }
                case screen.width >= 600 && this.router.url == "/vPregledProfesorAgenda/sm": {
                    this.router.navigate(["/vPregledProfesorKalendar"]);
                    break;
                }
                default: {
                    //none
                    break;
                }
            }
        });
    }

    onTabClick(event: Event, index: number) {
        if (this.activeTabIndex === index) {
            this.sidebarActive = !this.sidebarActive;
        } else {
            this.activeTabIndex = index;
            this.sidebarActive = true;
        }

        event.preventDefault();
    }

    closeSidebar(event: Event) {
        this.sidebarActive = false;
        event.preventDefault();
    }

    onSidebarClick(event: Event) {
        this.sidebarClick = true;
    }

    onTopbarMenuButtonClick(event: Event) {
        this.topbarItemClick = true;
        this.topbarMenuActive = !this.topbarMenuActive;

        event.preventDefault();
    }

    onMenuButtonClick(event: Event, index: number) {
        this.menuButtonClick = true;
        this.rotateMenuButton = !this.rotateMenuButton;
        this.topbarMenuActive = false;
        this.sidebarActive = !this.sidebarActive;

        if (this.layoutMode === MenuOrientation.OVERLAY) {
            this.overlayMenuActive = !this.overlayMenuActive;
        } else {
            if (this.isDesktop()) {
                this.staticMenuDesktopInactive = !this.staticMenuDesktopInactive;
            } else {
                this.staticMenuMobileActive = !this.staticMenuMobileActive;
            }
        }

        if (this.activeTabIndex < 0) {
            this.activeTabIndex = 0;
        }

        event.preventDefault();
    }

    onTopbarItemClick(event: Event, item) {
        this.topbarItemClick = true;

        if (this.activeTopbarItem === item) {
            this.activeTopbarItem = null;
        } else {
            this.activeTopbarItem = item;
        }

        event.preventDefault();
    }

    onTopbarSearchItemClick(event: Event) {
        this.topbarItemClick = true;

        event.preventDefault();
    }

    onTopbarSubItemClick(event) {
        event.preventDefault();
    }
    openEmailForm(event) {
        event.preventDefault();
        this.displayEmailSender = true;
    }
    submitEmailForm(event) {
        event.preventDefault();
        this.displayEmailSender = false;
        console.log(this.emailSend);
    }

    get overlay(): boolean {
        return this.layoutMode === MenuOrientation.OVERLAY;
    }

    changeToStaticMenu() {
        this.layoutMode = MenuOrientation.STATIC;
    }

    changeToOverlayMenu() {
        this.layoutMode = MenuOrientation.OVERLAY;
    }

    isDesktop() {
        return window.innerWidth > 1024;
    }

    ngOnDestroy() {
        if (this.documentClickListener) {
            this.documentClickListener();
        }
    }
}
