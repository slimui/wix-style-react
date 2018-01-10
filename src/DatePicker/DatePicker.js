import React from 'react';
import WixComponent from '../BaseComponents/WixComponent';
import PropTypes from 'prop-types';
import {LocaleUtils} from 'react-day-picker';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import DatePickerInput from './DatePickerInput';
import classnames from 'classnames';
import css from './DatePicker.scss';
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
import nb from 'date-fns/locale/nb';
import nl from 'date-fns/locale/nl';
import da from 'date-fns/locale/da';

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
  no: nb,
  nl,
  da
};

/**
 * DatePicker component
 *
 * ### Keyboard support
 * * `Left`: Move to the previous day.
 * * `Right`: Move to the next day.
 * * `Up`: Move to the previous week.
 * * `Down`: Move to the next week.
 * * `PgUp`: Move to the previous month.
 * * `PgDn`: Move to the next month.
 * * `Home`: Move to the previous year.
 * * `End`: Move to the next year.
 * * `Enter`/`Esc`/`Tab`: close the calendar. (`Enter` & `Esc` calls `preventDefault`)
 *
 */
export default class DatePicker extends WixComponent {
  static displayName = 'DatePicker';

  static propTypes = {
    /** Can provide Input with your custom props */
    customInput: PropTypes.node,
    dataHook: PropTypes.string,

    /** Custom date format */
    dateFormat: PropTypes.string,

    /** DatePicker instance locale */
    locale: PropTypes.string,

    /** Is the DatePicker disabled */
    disabled: PropTypes.bool,
    error: PropTypes.bool,
    errorMessage: PropTypes.string,

    /** Past dates are unselectable */
    excludePastDates: PropTypes.bool,

    /** Only the truthy dates are selectable */
    filterDate: PropTypes.func,

    /** dataHook for the DatePicker's Input */
    inputDataHook: PropTypes.string,

    /** Called upon every value change */
    onChange: PropTypes.func.isRequired,
    onEnterPressed: PropTypes.func,

    /** placeholder of the Input */
    placeholderText: PropTypes.string,

    /** Icon for the DatePicker's Input */
    prefix: PropTypes.node,

    /** Is the input field readOnly */
    readOnly: PropTypes.bool,

    /** RTL mode */
    rtl: PropTypes.bool,

    /** Display a selectable yearDropdown */
    showYearDropdown: PropTypes.bool,

    /** Display a selectable monthDropdown */
    showMonthDropdown: PropTypes.bool,

    style: PropTypes.object,

    /** Theme of the Input */
    theme: PropTypes.string,

    /** The selected date */
    value: PropTypes.object,

    /** should the calendar close on day selection */
    shouldCloseOnSelect: PropTypes.bool,

    /** controls the whether the calendar will be visible or not */
    isOpen: PropTypes.bool,

    /** called when calendar visibility changes */
    setOpen: PropTypes.func,

    /** When set to true, this input will have no rounded corners on its left */
    noLeftBorderRadius: PropTypes.string,

    /** When set to true, this input will have no rounded corners on its right */
    noRightBorderRadius: PropTypes.string
  };

  static defaultProps = {
    style: {
      width: 150
    },
    dateFormat: 'YYYY/MM/DD',
    filterDate: () => true,
    shouldCloseOnSelect: true
  };

  constructor(props) {
    super(props);
    this.filterDate = this.filterDate.bind(this);
  }

  filterDate(date) {
    if (this.props.excludePastDates) {
      if (date < moment().startOf('d')) {
        return false;
      }
    }

    return this.props.filterDate(date);
  }


  /** open the calendar */
  open() {
    this.calendar.setOpen(true);
  }

  /** close the calendar */
  close() {
    this.calendar.setOpen(false);
  }

  render() {
    const {
      value,
      readOnly,
      showYearDropdown,
      showMonthDropdown,
      rtl,
      style,
      theme,
      prefix,
      inputDataHook: dataHook,
      onEnterPressed,
      error,
      errorMessage,
      customInput,
      noLeftBorderRadius,
      noRightBorderRadius,
      dateFormat,
      placeholderText = dateFormat,
      locale
    } = this.props;
    const cssClasses = [css.wrapper, noLeftBorderRadius, noRightBorderRadius];
    if (showYearDropdown || showMonthDropdown) {
      cssClasses.push({'react-datepicker--hide-header': true});
    } else {
      cssClasses.push({'react-datepicker--hide-header__dropdown': true});
    }

    const localeUtils = {
      ...LocaleUtils,
      formatMonthTitle:
        date => console.log('cat', date) || format(date, 'MMMM YYYY', {
          locale: locales[locale]
        })
    };

    const dayPickerProps = {
      ref: calendar => this.calendar = calendar,
      selectedDay: value,
      filterDate: this.filterDate,
      readOnly,
      showYearDropdown,
      locale,
      localeUtils
    };

    const inputProps = {
      rtl,
      style,
      theme,
      prefix,
      dataHook,
      onEnterPressed,
      error,
      errorMessage,
      customInput,
      noLeftBorderRadius,
      noRightBorderRadius
    };

    return (
      <div className={classnames(cssClasses)}>
        <DayPickerInput
          component={DatePickerInput}
          dayPickerProps={{...dayPickerProps}}
          inputProps={{...inputProps}}
          onDayChange={day => console.log(day)}
          placeholder={placeholderText}
          format={dateFormat}
          formatDate={(date, dateFormat, locale) => format(date, dateFormat, {locale: locales[locale]})}
          />
      </div>
    );
  }
}
