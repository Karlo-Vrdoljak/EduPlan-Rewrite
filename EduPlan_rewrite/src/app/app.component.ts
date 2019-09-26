import {Component, AfterViewInit, OnDestroy, Renderer2, Inject} from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from "@ngx-translate/core";
import { LOCAL_STORAGE, WebStorageService } from "angular-webstorage-service";

enum MenuOrientation {
    STATIC,
    OVERLAY
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit, OnDestroy {
    activeTabIndex = -1;

    sidebarActive = false;

    layoutMode: MenuOrientation = MenuOrientation.STATIC;

    topbarMenuActive: boolean;

    overlayMenuActive: boolean;

    staticMenuDesktopInactive: boolean;

    staticMenuMobileActive: boolean;

    rotateMenuButton: boolean;

    sidebarClick: boolean;

    topbarItemClick: boolean;

    menuButtonClick: boolean;

    activeTopbarItem: any;

    documentClickListener: () => void;

    public data: any = [];
    theme = 'green';

    constructor(
        public renderer: Renderer2,
        public router: Router,
        private translate: TranslateService,
        //@Inject(LOCAL_STORAGE) private storage: WebStorageService
    ) {
        this.translate.setDefaultLang("hr");
        this.translate.use("hr");
        /*
        this.getFromLocal("lang");
        if(this.data) {
            this.translate.setDefaultLang(this.data["lang"]);
            this.translate.use(this.data["lang"]);
        } else {
            this.saveInLocal("lang","hr");
            this.translate.setDefaultLang("hr");
            this.translate.use("hr");
        }
        */
    }
    /*
    saveInLocal(key, val): void {
        console.log("recieved= key:" + key + "value:" + val);
        this.storage.set(key, val);
        this.data[key] = this.storage.get(key);
    }

    getFromLocal(key): void {
        console.log("recieved= key:" + key);
        this.data[key] = this.storage.get(key);
        console.log(this.data);
    }
    */
    ngAfterViewInit() {
        this.documentClickListener = this.renderer.listen(
            'body',
            'click',
            event => {
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
            }
        );
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
                this.staticMenuDesktopInactive = !this
                    .staticMenuDesktopInactive;
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
