import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistorialventasadminPage } from './historialventasadmin.page';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('HistorialventasadminPage', () => {
  let component: HistorialventasadminPage;
  let fixture: ComponentFixture<HistorialventasadminPage>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [HistorialventasadminPage],
      providers: [SQLite, HttpClient, HttpHandler]
    }).compileComponents();
    fixture = TestBed.createComponent(HistorialventasadminPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
