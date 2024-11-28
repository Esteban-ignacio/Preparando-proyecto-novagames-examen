import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlaystationPage } from './playstation.page';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';

describe('PlaystationPage', () => {
  let component: PlaystationPage;
  let fixture: ComponentFixture<PlaystationPage>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [PlaystationPage],
      providers: [SQLite]
    }).compileComponents();
    fixture = TestBed.createComponent(PlaystationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
