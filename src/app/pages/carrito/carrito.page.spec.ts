import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarritoPage } from './carrito.page';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';

describe('CarritoPage', () => {
  let component: CarritoPage;
  let fixture: ComponentFixture<CarritoPage>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [CarritoPage],
      providers: [SQLite]
    }).compileComponents();
    fixture = TestBed.createComponent(CarritoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
