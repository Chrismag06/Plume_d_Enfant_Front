import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TtsPlayerComponent } from './tts-player.component';

describe('TtsPlayerComponent', () => {
  let component: TtsPlayerComponent;
  let fixture: ComponentFixture<TtsPlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TtsPlayerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TtsPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
