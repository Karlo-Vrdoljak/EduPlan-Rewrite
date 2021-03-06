/************************************************************************************************************************************************************
 ** File
 ** Name      :      app.menu-profesor
 ** DESC      :      sub-menu Side bar navigacija za profil profesora 
 **
 ** Author    :      Filip Bikić
 ** Date      :      29.11.2019.
 *************************************************************************************************************************************************************
 ** Change history :
 *************************************************************************************************************************************************************
 ** Date:                   Author:                    Description :
 **------------             ------------- -------------------------------------
 **
 *************************************************************************************************************************************************************/
import {
    Component,
    Input,
    OnInit,
    EventEmitter,
    ViewChild
} from "@angular/core";
import {
    trigger,
    state,
    style,
    transition,
    animate
} from "@angular/animations";
import { Location } from "@angular/common";
import { Router } from "@angular/router";
import { MenuItem } from "primeng/primeng";
import { AppComponent } from "./app.component";
import { TranslateService, LangChangeEvent } from "@ngx-translate/core";

@Component({
    selector: 'app-menu-profesor',
    template: `
        <ul
            app-submenu
            [item]="model"
            root="true"
            class="navigation-menu"
            visible="true"
            parentActive="true"
        ></ul>
    `
})
export class AppMenuProfesorComponent implements OnInit {
    model: any[];
    osobniPodaci = null;

    constructor(public app: AppComponent, private translate: TranslateService) {

    }

    ngOnInit() {
        this.onTranslateChange();
        var result = this.translate
            .get([
                "VIEWS_APLIKACIJA_HOME_OSOBNIPODACI",
                "STUDENT_SVI_PREDMETI_POPIS",
                "STUDENT_OBAVIJESTI_OBAVIJESTI",
                "PROFESOR_OSOBNIDOKUMENTI_OSOBNIDOKUMENTI"
            ])
            .toPromise()
            .then(res => {
                this.model = [
                    {
                        label: res.VIEWS_APLIKACIJA_HOME_OSOBNIPODACI, //'Osobni podaci',
                        icon: "fa fa-address-card",
                        routerLink: ["/vProfesorOsobniPodaci"]
                    },
                    {
                        label: res.STUDENT_SVI_PREDMETI_POPIS, //"Popis predmeta",
                        icon: "fa fa-book",
                        routerLink: ["/vProfesorPredmeti"]
                    },
                    {
                        label: res.STUDENT_OBAVIJESTI_OBAVIJESTI, //"Obavijesti",
                        icon: "fa fa-bullseye",
                        routerLink: ["/vProfesorObavijesti"]
                    },
                    {
                        label: res.PROFESOR_OSOBNIDOKUMENTI_OSOBNIDOKUMENTI, //"Osobni dokumenti",
                        icon: "fa fa-file",
                        routerLink: ["/vOsobniDokumenti"]
                    }
                ];
            });
    }

    onTranslateChange() {
        this.translate.onLangChange.subscribe((eventProfile:LangChangeEvent)=> {
            this.model = [
                {
                    label: this.translate.instant("VIEWS_APLIKACIJA_HOME_OSOBNIPODACI"), //'Osobni podaci',
                    icon: "fa fa-address-card",
                    routerLink: ["/vProfesorOsobniPodaci"]
                },
                {
                    label: this.translate.instant("STUDENT_SVI_PREDMETI_POPIS"), //"Popis predmeta",
                    icon: "fa fa-book",
                    routerLink: ["/vProfesorPredmeti"]
                },
                {
                    label: this.translate.instant("STUDENT_OBAVIJESTI_OBAVIJESTI"), //"Obavijesti",
                    icon: 'fa fa-bullseye',
                    routerLink: ['/vProfesorObavijesti']
                }
            ];
        })
    }


    changeTheme(theme) {
        this.app.theme = theme;
        const themeLink: HTMLLinkElement = document.getElementById(
            'theme-css'
        ) as HTMLLinkElement;
        const layoutLink: HTMLLinkElement = document.getElementById(
            'layout-css'
        ) as HTMLLinkElement;

        themeLink.href = 'assets/theme/theme-' + theme + '.css';
        layoutLink.href = 'assets/layout/css/layout-' + theme + '.css';
    }
}

@Component({
    /* tslint:disable:component-selector */
    selector: '[app-submenu]',
    /* tslint:enable:component-selector */
    template: `
        <ng-template
            ngFor
            let-child
            let-i="index"
            [ngForOf]="root ? item : item.items"
        >
            <li
                [ngClass]="{ 'active-menuitem': isActive(i) }"
                [class]="child.badgeStyleClass"
                *ngIf="child.visible === false ? false : true"
            >
                <a
                    [href]="child.url || '#'"
                    (click)="itemClick($event, child, i)"
                    *ngIf="!child.routerLink"
                    [attr.tabindex]="!visible ? '-1' : null"
                    [attr.target]="child.target"
                    (mouseenter)="hover = true"
                    (mouseleave)="hover = false"
                >
                    <i [ngClass]="child.icon"></i>
                    <span>{{ child.label }}</span>
                    <i
                        class="fa fa-fw fa-angle-down ui-menuitem-toggler"
                        *ngIf="child.items"
                    ></i>
                    <span class="menuitem-badge" *ngIf="child.badge">{{
                        child.badge
                    }}</span>
                </a>

                <a
                    (click)="itemClick($event, child, i)"
                    *ngIf="child.routerLink"
                    [routerLink]="child.routerLink"
                    routerLinkActive="active-menuitem-routerlink"
                    [routerLinkActiveOptions]="{ exact: true }"
                    [attr.tabindex]="!visible ? '-1' : null"
                    [attr.target]="child.target"
                    (mouseenter)="hover = true"
                    (mouseleave)="hover = false"
                >
                    <i [ngClass]="child.icon"></i>
                    <span>{{ child.label }}</span>
                    <i
                        class="fa fa-fw fa-angle-down ui-menuitem-toggler"
                        *ngIf="child.items"
                    ></i>
                    <span class="menuitem-badge" *ngIf="child.badge">{{
                        child.badge
                    }}</span>
                </a>
                <ul
                    app-submenu
                    [item]="child"
                    *ngIf="child.items"
                    [@children]="isActive(i) ? 'visible' : 'hidden'"
                    [visible]="isActive(i)"
                    [parentActive]="isActive(i)"
                ></ul>
            </li>
        </ng-template>
    `,
    animations: [
        trigger('children', [
            state(
                'hidden',
                style({
                    height: '0px'
                })
            ),
            state(
                'visible',
                style({
                    height: '*'
                })
            ),
            transition(
                'visible => hidden',
                animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')
            ),
            transition(
                'hidden => visible',
                animate('400ms cubic-bezier(0.86, 0, 0.07, 1)')
            )
        ])
    ]
})
export class AppSubMenuComponent {
    @Input() item: MenuItem;

    @Input() root: boolean;

    @Input() visible: boolean;

    activeIndex: number;

    hover: boolean;

    _parentActive: boolean;

    constructor(
        public app: AppComponent,
        public router: Router,
        public location: Location
    ) { }

    itemClick(event: Event, item: MenuItem, index: number) {
        // avoid processing disabled items
        if (item.disabled) {
            event.preventDefault();
            return true;
        }

        // activate current item and deactivate active sibling if any
        this.activeIndex = this.activeIndex === index ? null : index;

        // execute command
        if (item.command) {
            item.command({ originalEvent: event, item });
        }

        // prevent hash change
        if (item.items || (!item.url && !item.routerLink)) {
            event.preventDefault();
        }

        // hide menu
        if (!item.items && (this.app.overlay || !this.app.isDesktop())) {
            this.app.sidebarActive = false;
        }
    }

    isActive(index: number): boolean {
        return this.activeIndex === index;
    }

    unsubscribe(item: any) {
        if (item.eventEmitter) {
            item.eventEmitter.unsubscribe();
        }

        if (item.items) {
            for (const childItem of item.items) {
                this.unsubscribe(childItem);
            }
        }
    }

    @Input() get parentActive(): boolean {
        return this._parentActive;
    }

    set parentActive(val: boolean) {
        this._parentActive = val;

        if (!this._parentActive) {
            this.activeIndex = null;
        }
    }
}
