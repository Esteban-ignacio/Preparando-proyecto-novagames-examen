import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModificarperfilPage } from './modificarperfil.page';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';

describe('ModificarperfilPage', () => {
  let component: ModificarperfilPage;
  let fixture: ComponentFixture<ModificarperfilPage>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [ModificarperfilPage],
      providers: [SQLite]
    }).compileComponents();
    fixture = TestBed.createComponent(ModificarperfilPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
