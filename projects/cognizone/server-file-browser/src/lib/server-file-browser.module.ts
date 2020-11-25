import { CommonModule } from "@angular/common";
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";

import { ServerFileBrowserComponent } from './components/server-file-browser/server-file-browser.component';
import { ServerFileBrowserConfig } from "./models/config";
import { SERVER_FILE_BROWSER_INJECTION_TOKEN } from "./models/server-file-browser.token";
import { ServerFileBrowserService } from "./services/server-file-browser.service";

@NgModule({
  declarations: [ServerFileBrowserComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
  ],
  exports: [ServerFileBrowserComponent]
})
export class ServerFileBrowserModule {
  static forRoot(config: ServerFileBrowserConfig): ModuleWithProviders<ServerFileBrowserModule> {
    return {
      ngModule: ServerFileBrowserModule,
      providers: [
        ServerFileBrowserService,
        {
          provide: SERVER_FILE_BROWSER_INJECTION_TOKEN,
          useValue: config
        }
      ]
    };
  }
}
