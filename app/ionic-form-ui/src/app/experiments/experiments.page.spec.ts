import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExperimentsPage } from './experiments.page';

describe('ExperimentsPage', () => {
  let component: ExperimentsPage;
  let fixture: ComponentFixture<ExperimentsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExperimentsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ExperimentsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
