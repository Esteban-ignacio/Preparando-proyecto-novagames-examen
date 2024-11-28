import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecuperarclavePage } from './recuperarclave.page';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';

describe('RecuperarclavePage', () => {
  let component: RecuperarclavePage;
  let fixture: ComponentFixture<RecuperarclavePage>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [RecuperarclavePage],
      providers: [SQLite]
    }).compileComponents();
    fixture = TestBed.createComponent(RecuperarclavePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
