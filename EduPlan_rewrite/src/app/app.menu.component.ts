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
    selector: 'app-menu',
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
export class AppMenuComponent implements OnInit {
    model: any[];
    osobniPodaci = null;

    constructor(public app: AppComponent, private translate: TranslateService) {

    }

    ngOnInit() {
        this.onTranslateChange();
        var result = this.translate
            .get([
                "VIEWS_APLIKACIJA_HOME_OSOBNIPODACI",
                "STUDENT_NOVISTUDENTPODACINASTUDIJU_PODACI_NA_STUDIJU",
                "STUDENT_NOVISTUDENTPODACINASTUDIJU_PODACI_NA_AKADEMSKOJ_GOD",
                "STUDENT_SVI_PREDMETI_POPIS",
                "STUDENT_PROSJECI_PROSJECI",
                "STUDENT_OBAVIJESTI_OBAVIJESTI"
            ])
            .toPromise()
            .then(res => {
                this.model = [
                    {
                        label: res.VIEWS_APLIKACIJA_HOME_OSOBNIPODACI, //'Osobni podaci',
                        icon: "fa fa-address-card",
                        routerLink: ["/vStudentOsobniPodaci"]
                    },
                    {
                        label:
                            res.STUDENT_NOVISTUDENTPODACINASTUDIJU_PODACI_NA_STUDIJU, //"Podaci na studiju",
                        icon: "fa fa-university",
                        routerLink: ["/vStudentPodaciStudij"]
                    },
                    {
                        label:
                            res.STUDENT_NOVISTUDENTPODACINASTUDIJU_PODACI_NA_AKADEMSKOJ_GOD, //'Podaci na akademskoj godini',
                        icon: "fa fa-graduation-cap",
                        routerLink: ["/vStudentPodaciNaAkGodini"]
                    },
                    {
                        label: res.STUDENT_SVI_PREDMETI_POPIS, //"Popis predmeta",
                        icon: "fa fa-book",
                        routerLink: ["/vStudentSviPredmeti"]
                    },
                    {
                        label: res.STUDENT_PROSJECI_PROSJECI, //"Prosjeci",
                        icon: "fa fa-percent",
                        routerLink: ["/vStudentProsjeci"]
                    },
                    {
                        label: res.STUDENT_OBAVIJESTI_OBAVIJESTI, //"Obavijesti",
                        icon: "fa fa-bullseye",
                        routerLink: ["/vStudentObavijesti"]
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
                    routerLink: ["/vStudentOsobniPodaci"]
                },
                {
                    label:
                        this.translate.instant("STUDENT_NOVISTUDENTPODACINASTUDIJU_PODACI_NA_STUDIJU"), //"Podaci na studiju",
                    icon: "fa fa-university",
                    routerLink: ["/vStudentPodaciStudij"]
                },
                {
                    label: this.translate.instant("STUDENT_SVI_PREDMETI_POPIS"), //"Popis predmeta",
                    icon: "fa fa-book",
                    routerLink: ["/vStudentSviPredmeti"]
                },
                {
                    label: this.translate.instant("STUDENT_PROSJECI_PROSJECI"), //"Prosjeci",
                    icon: 'fa fa-percent',
                    routerLink: ["/vStudentProsjeci"]
                },
                {
                    label: this.translate.instant("STUDENT_OBAVIJESTI_OBAVIJESTI"), //"Obavijesti",
                    icon: 'fa fa-bullseye',
                    routerLink: ['/vStudentObavijesti']
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
