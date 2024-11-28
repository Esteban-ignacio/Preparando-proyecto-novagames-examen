import { ComponentFixture, TestBed } from '@angular/core/testing';
import { XboxPage } from './xbox.page';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';

describe('XboxPage', () => {
  let component: XboxPage;
  let fixture: ComponentFixture<XboxPage>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [XboxPage],
      providers: [SQLite]
    }).compileComponents();
    fixture = TestBed.createComponent(XboxPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
