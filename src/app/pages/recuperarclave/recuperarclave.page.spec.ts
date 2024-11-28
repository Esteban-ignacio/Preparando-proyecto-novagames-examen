import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecuperarclavePage } from './recuperarclave.page';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('RecuperarclavePage', () => {
  let component: RecuperarclavePage;
  let fixture: ComponentFixture<RecuperarclavePage>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [RecuperarclavePage],
      providers: [SQLite , HttpClient, HttpHandler]
    }).compileComponents();
    fixture = TestBed.createComponent(RecuperarclavePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
