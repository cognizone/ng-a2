import { CommonModule } from "@angular/common";
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatInputModule } from "@angular/material/input";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";

import { ServerFileBrowserServiceMock } from "../../mocks/services/server-file-browser.service.mock";
import { ServerFileBrowserService } from "../../services/server-file-browser.service";

import { ServerFileBrowserComponent } from "./server-file-browser.component"

describe('ServerFileBrowserComponent', () => {
  let component: ServerFileBrowserComponent;
  let fixture: ComponentFixture<ServerFileBrowserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        NoopAnimationsModule,
        FormsModule,
        MatButtonModule,
        MatInputModule,
        MatCheckboxModule
      ],
      declarations: [
        ServerFileBrowserComponent
      ],
      providers: [
        { provide: ServerFileBrowserService, useClass: ServerFileBrowserServiceMock }
      ]
    }).compileComponents();
  });


  beforeEach(() => {
    fixture = TestBed.createComponent(ServerFileBrowserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
