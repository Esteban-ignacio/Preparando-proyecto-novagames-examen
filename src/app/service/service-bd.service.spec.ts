import { TestBed } from '@angular/core/testing';

import { ServiceBDService } from './service-bd.service';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('ServiceBDService', () => {
  let service: ServiceBDService;

  beforeEach(async() => {
    TestBed.configureTestingModule({
      providers: [SQLite, HttpClient, HttpHandler]
    });
    service = TestBed.inject(ServiceBDService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
