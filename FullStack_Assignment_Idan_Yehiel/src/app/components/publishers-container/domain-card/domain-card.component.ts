import {Component, Input} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {Domain} from "../../../types";
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-domain-card',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './domain-card.component.html',
    styleUrl: './domain-card.component.css'
})
export class DomainCardComponent {
    @Input() domain!: Domain;

    constructor(private httpService: HttpClient) {
    }

    ngOnInit(): void {
        
    }
}
