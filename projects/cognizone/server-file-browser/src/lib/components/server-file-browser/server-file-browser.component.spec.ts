import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerFileBrowserComponent } from './server-file-browser.component';

describe('ServerFileBrowserComponent', () => {
  let component: ServerFileBrowserComponent;
  let fixture: ComponentFixture<ServerFileBrowserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServerFileBrowserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServerFileBrowserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
