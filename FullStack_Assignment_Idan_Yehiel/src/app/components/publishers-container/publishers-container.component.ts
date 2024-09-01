import { Component, OnInit } from '@angular/core';
import { PublisherCardComponent } from './publisher-card/publisher-card.component';
import { CommonModule } from '@angular/common';
import { Publisher, Domain } from '../../types';
import { HttpService } from '../../http.service';
import { FormsModule, FormBuilder, FormArray, Validators, FormGroup, ReactiveFormsModule} from '@angular/forms';

@Component({
    selector: 'app-publishers-container',
    standalone: true,
    imports: [PublisherCardComponent, CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './publishers-container.component.html',
    styleUrl: './publishers-container.component.css',
})
export class PublishersContainerComponent implements OnInit {
    publishers: Publisher[] = [];
    publisherForm: FormGroup;
    domains: Domain[] = [];
    addedDomains: Domain[] = [{
        url: '',
        desktopAds: 0,
        mobileAds: 0
    }];

    constructor(private httpService: HttpService, private fb: FormBuilder) {
        this.publisherForm = this.fb.group(
            {
                publisher: ['', Validators.required],
                domains: this.fb.array([])
            }
        );
    }
    
    ngOnInit(): void {
        this.httpService.getPublishers().subscribe(
            (data: Publisher[]) => {
                this.publishers = data;
            },
            (error) => {
                console.error('Error fetching publishers:', error);
            }
        );
        this.getDomains();
    }

    addPublisher() {
        this.httpService.addPublisher(this.publisherForm.value).subscribe(
            (publisher: Publisher) => {
                this.publishers.push(publisher);
                this.publisherForm.reset();
                this.domains = [];
                console.log(`Publisher: ${publisher.publisher}, Domains: ${this.addedDomains}`);
            },
            (error) => {
                console.error('Error adding publisher:', error);
            }
        );
    }

    getDomains() {
        return this.httpService.getDomains().subscribe(
            (data: Domain[]) => {
                this.domains = data;
            },
            (error) => {
                console.error('Error fetching domain:', error);
            }
        );
    }

    addDomain() {
        const domainGroup = this.fb.group({
            url: ['', Validators.required],
            desktopAds: [0, [Validators.required, Validators.min(0)]],
            mobileAds: [0, [Validators.required, Validators.min(0)]]
        });
        const newDomain: Domain = {
            url: domainGroup.get('url')?.value ?? '',
            desktopAds: domainGroup.get('desktopAds')?.value ?? 0,
            mobileAds: domainGroup.get('mobileAds')?.value ?? 0
        };

        this.domains.push(newDomain);
        this.addedDomains.push(newDomain);
    }
}
