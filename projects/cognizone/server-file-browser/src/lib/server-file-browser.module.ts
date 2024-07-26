import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';

import { CmdlineComponent } from './components/cmdline/cmdline.component';
import { ServerFileBrowserComponent } from './components/server-file-browser/server-file-browser.component';
import { ServerFileBrowserConfig } from './models/server-file-browser-config';
import { SERVER_FILE_BROWSER_TOKEN } from './models/server-file-browser.token';
import { ServerFileBrowserService } from './services/server-file-browser.service';

@NgModule({
  declarations: [ServerFileBrowserComponent, CmdlineComponent],
  imports: [CommonModule, FormsModule, MatButtonModule, MatInputModule, MatCheckboxModule, MatExpansionModule],
  exports: [ServerFileBrowserComponent],
})
export class ServerFileBrowserModule {
  static forRoot(config: ServerFileBrowserConfig): ModuleWithProviders<ServerFileBrowserModule> {
    return {
      ngModule: ServerFileBrowserModule,
      providers: [
        ServerFileBrowserService,
        {
          provide: SERVER_FILE_BROWSER_TOKEN,
          useValue: config,
        },
      ],
    };
  }
}
