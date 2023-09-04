import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PBoardComponent } from './pboard.component';

describe('PBoardComponent', () => {
  let component: PBoardComponent;
  let fixture: ComponentFixture<PBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PBoardComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
