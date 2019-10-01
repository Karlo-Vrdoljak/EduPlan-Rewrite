import { Component, OnInit } from '@angular/core';
import {GalleriaModule} from 'primeng/galleria';

@Component({
    templateUrl: './emptydemo.component.html',
    
})

export class EmptyDemoComponent implements OnInit {

    images: any[];
    
    constructor() {}

    ngOnInit() {
        this.images = [];
        this.images.push({source:'assets/demo/images/landing/1.jpg', alt:'Description for Image 1', title:'Title 1'});
        this.images.push({source:'assets/demo/images/landing/2.jpg', alt:'Description for Image 2', title:'Title 2'});
        this.images.push({source:'assets/demo/images/landing/3.jpg', alt:'Description for Image 3', title:'Title 3'});

     }
}
