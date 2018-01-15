import rangeRight from 'lodash/rangeRight';

import setDay from 'date-fns/set_day';
import format from 'date-fns/format';
import en from 'date-fns/locale/en';
import es from 'date-fns/locale/es';
import pt from 'date-fns/locale/pt';
import fr from 'date-fns/locale/fr';
import de from 'date-fns/locale/de';
import pl from 'date-fns/locale/pl';
import it from 'date-fns/locale/it';
import ru from 'date-fns/locale/ru';
import ja from 'date-fns/locale/ja';
import ko from 'date-fns/locale/ko';
import tr from 'date-fns/locale/tr';
import sv from 'date-fns/locale/sv';
import nl from 'date-fns/locale/nl';
import da from 'date-fns/locale/da';
import * as no from 'date-fns/locale/nb';

const locales = {
  en,
  es,
  pt,
  fr,
  de,
  pl,
  it,
  ru,
  ja,
  ko,
  tr,
  sv,
  no,
  nl,
  da
};

export function createFormatMonthTitle(locale) {
  return date => format(date, 'MMMM YYYY', {
    locale: locales[locale]
  });
}

export function createFormatWeekdayShort(locale) {
  return index => format(setDay(new Date(), index), 'dd', {
    locale: locales[locale]
  });
}

export function createFormatWeekdayLong(locale) {
  return index => format(setDay(new Date(), index), 'dddd', {
    locale: locales[locale]
  });
}

export function getYears({from = new Date().getFullYear() - 11, to = new Date().getFullYear() + 11} = {}) {
  return rangeRight(from, to)
    .map((year, i) => ({value: year, id: i}));
}

export function getMonths(localeUtils) {
  return localeUtils.getMonths().map((month, i) => ({value: month, id: i}));
}

export function formatDate(date, dateFormat, locale) {
  return format(date, dateFormat, {locale: locales[locale]});
}
