import type { App } from 'vue';

import * as l10n from '@nextcloud/l10n';

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import localizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.extend(customParseFormat);
dayjs.extend(localizedFormat);

import.meta.glob('../node_modules/dayjs/locale/*.js', { eager: true });
dayjs.locale(l10n.getLocale().toLowerCase().replace('_', '-'));

export function addL10N(app: App): void {
  app.config.globalProperties.t = l10n.translate;
  app.config.globalProperties.n = l10n.translatePlural;
}

declare module 'vue' {
  interface ComponentCustomProperties {
    t: (appName: 'money', text: string) => string;
  }
}
