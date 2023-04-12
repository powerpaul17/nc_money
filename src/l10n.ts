import Vue from 'vue';

import l10n from '@nextcloud/l10n';

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import localizedFormat from 'dayjs/plugin/localizedFormat';

Vue.prototype.t = l10n.translate;
Vue.prototype.n = l10n.translatePlural;

dayjs.extend(customParseFormat);
dayjs.extend(localizedFormat);

import.meta.glob('../node_modules/dayjs/locale/*.js', { eager: true });
dayjs.locale(l10n.getLocale().toLowerCase().replace('_', '-'));

declare module 'vue' {
  interface ComponentCustomProperties {
    t: (appName: 'money', text: string) => string
  }
}
