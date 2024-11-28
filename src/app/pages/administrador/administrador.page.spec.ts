import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdministradorPage } from './administrador.page';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';

describe('AdministradorPage', () => {
  let component: AdministradorPage;
  let fixture: ComponentFixture<AdministradorPage>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [AdministradorPage],
      providers: [SQLite]
    }).compileComponents();
    fixture = TestBed.createComponent(AdministradorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
