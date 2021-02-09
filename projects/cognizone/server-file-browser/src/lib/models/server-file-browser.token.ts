import { InjectionToken } from "@angular/core";

import { ServerFileBrowserConfig } from "./server-file-browser-config";

export const SERVER_FILE_BROWSER_TOKEN = new InjectionToken<ServerFileBrowserConfig>('ServerFileBrowserConfig')
