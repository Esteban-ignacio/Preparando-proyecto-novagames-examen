import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistorialventasPage } from './historialventas.page';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { HttpClient } from '@angular/common/http';

describe('HistorialventasPage', () => {
  let component: HistorialventasPage;
  let fixture: ComponentFixture<HistorialventasPage>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [HistorialventasPage],
      providers: [SQLite]
    }).compileComponents();
    fixture = TestBed.createComponent(HistorialventasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
