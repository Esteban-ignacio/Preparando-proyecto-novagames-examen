import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CambiarclavePage } from './cambiarclave.page';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('CambiarclavePage', () => {
  let component: CambiarclavePage;
  let fixture: ComponentFixture<CambiarclavePage>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [CambiarclavePage],
      providers: [SQLite , HttpClient, HttpHandler]
    }).compileComponents();
    fixture = TestBed.createComponent(CambiarclavePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
