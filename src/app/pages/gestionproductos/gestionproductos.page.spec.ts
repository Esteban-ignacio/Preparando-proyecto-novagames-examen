import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GestionproductosPage } from './gestionproductos.page';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('GestionproductosPage', () => {
  let component: GestionproductosPage;
  let fixture: ComponentFixture<GestionproductosPage>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [GestionproductosPage],
      providers: [SQLite, HttpClient, HttpHandler]
    }).compileComponents();
    fixture = TestBed.createComponent(GestionproductosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
