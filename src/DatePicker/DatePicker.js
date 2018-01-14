import React from 'react';
import rangeRight from 'lodash/rangeRight';
import WixComponent from '../BaseComponents/WixComponent';
import PropTypes from 'prop-types';
import {LocaleUtils} from 'react-day-picker';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import DatePickerInput from './DatePickerInput';
import {DropdownPicker, DropdownCaption, StaticCaption} from './DropdownPicker';
import classNames from 'classnames';
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

import addDays from 'date-fns/add_days';
import subDays from 'date-fns/sub_days';
import addMonths from 'date-fns/add_months';
import subMonths from 'date-fns/sub_months';
import addYears from 'date-fns/add_years';
import subYears from 'date-fns/sub_years';
import parse from 'date-fns/parse';
import isSameDay from 'date-fns/is_same_day';
import setDay from 'date-fns/set_day';

import styles from './DatePicker.scss';

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
    noRightBorderRadius: PropTypes.string,

    /** Mappings can be passed in format {keyCode: fn},
     * example { 39: () => console.log('ArrowRight is pressed') }  */
    keyMappings: PropTypes.object
  };

  static defaultProps = {
    style: {
      width: 150
    },
    locale: 'en',
    dateFormat: 'MM/DD/YYYY',
    filterDate: () => true,
    shouldCloseOnSelect: true,
    keyMappings: {}
  };

  constructor(props) {
    super(props);

    this.state = {
      isMonthPickerOpen: false,
      isYearPickerOpen: false,
      calendarView: props.value || new Date()
    };
  }

  toggleDropdownPicker = picker => this.setState({[`is${picker}PickerOpen`]: !this.state[`is${picker}PickerOpen`]});

  handleDropdownSelect = date => this.setState({calendarView: date, isMonthPickerOpen: false, isYearPickerOpen: false});

  getDisabledDays() {
    if (this.props.excludePastDates) {
      return [{
        before: new Date()//todo adjust with tz
      }];
    }

    return date => !this.props.filterDate(date);
  }

  /** open the calendar */
  open() {
    this.dayPickerInput.showDayPicker();
  }

  /** close the calendar */
  close() {
    this.dayPickerInput.hideDayPicker();
  }

  goNextDay(day) {
    const focusedDay = addDays(day, 1);
    this.setState({
      focusedDay,
      calendarView: focusedDay
    });
  }

  goPrevDay(day) {
    const focusedDay = subDays(day, 1);
    this.setState({
      focusedDay,
      calendarView: focusedDay
    });
  }

  goNextWeek(day) {
    const focusedDay = addDays(day, 7);
    this.setState({
      focusedDay,
      calendarView: focusedDay
    });
  }

  goPrevWeek(day) {
    const focusedDay = subDays(day, 7);
    this.setState({
      focusedDay,
      calendarView: focusedDay
    });
  }

  goNextMonth(day) {
    const focusedDay = addMonths(this.state.focusedDay || day, 1);
    this.setState({
      focusedDay,
      calendarView: focusedDay
    });
  }

  goPrevMonth(day) {
    const focusedDay = subMonths(this.state.focusedDay || day, 1);
    this.setState({
      focusedDay,
      calendarView: focusedDay
    });
  }

  goNextYear(day) {
    const focusedDay = addYears(this.state.focusedDay || day, 1);
    this.setState({
      focusedDay,
      calendarView: focusedDay
    });
  }

  goPrevYear(day) {
    const focusedDay = subYears(this.state.focusedDay || day, 1);
    this.setState({
      focusedDay,
      calendarView: focusedDay
    });
  }

  selectDay(day) {
    this.setState({
      value: day
    });

    if (!isSameDay(day, this.state.value || this.props.value)) {
      this.props.onChange(day);
    }
    if (this.props.shouldCloseOnSelect) {
      this.close();
    }
  }

  get keyMapping() {
    return {
      37: day => this.goPrevDay(day),
      38: day => this.goPrevWeek(day),
      39: day => this.goNextDay(day),
      40: day => this.goNextWeek(day),
      27: () => this.close(),
      9: () => this.close(),
      13: day => this.selectDay(day),
      33: day => this.goPrevMonth(day),
      34: day => this.goNextMonth(day),
      36: day => this.goPrevYear(day),
      35: day => this.goNextYear(day),
      ...this.props.keyMappings
    };
  }

  formatDate(date, dateFormat, locale) {
    return format(date, dateFormat || locale.dateFormat, {locale: locales[locale]});
  }

  render() {
    const value = this.state.value || this.props.value;

    const {
      showYearDropdown,
      showMonthDropdown,
      showOutsideDays = true,
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
      locale,
      shouldCloseOnSelect,
      onChange,
      disabled,
      readOnly
    } = this.props;

    const {isMonthPickerOpen, isYearPickerOpen, calendarView, focusedDay} = this.state;

    const cssClasses = [styles.wrapper, noLeftBorderRadius, noRightBorderRadius];

    const localeUtils = {
      ...LocaleUtils,
      formatMonthTitle: date => format(date, 'MMMM YYYY', {
        locale: locales[locale]
      }),
      formatWeekdayShort: index => format(setDay(new Date(), index), 'dd', {
        locale: locales[locale]
      }),
      formatWeekdayLong: index => format(setDay(new Date(), index), 'dddd', {
        locale: locales[locale]
      })
    };

    const modifiers = focusedDay ? {'keyboard-selected': focusedDay} : {};
    const modifiersStyles = {'keyboard-selected': {}};

    const showCustomCaption = showMonthDropdown || showYearDropdown ? {
      //eslint-disable-next-line
      captionElement: ({date, localeUtils}) => (
        <DropdownCaption>
          {showMonthDropdown ? <DropdownPicker
            dataHook="show-month-dropdown"
            value={date.getMonth()}
            caption={localeUtils.getMonths()[date.getMonth()]}
            options={localeUtils.getMonths().map((month, i) => ({value: month, id: i}))}
            onClick={() => this.toggleDropdownPicker('Month')}
            onSelect={({id}) => this.handleDropdownSelect(new Date(date.getFullYear(), id))}
            isOpen={isMonthPickerOpen}
            /> : <StaticCaption caption={localeUtils.getMonths()[date.getMonth()]}/>}
          {showYearDropdown ? <DropdownPicker
            dataHook="show-year-dropdown"

            value={date.getFullYear()}
            caption={date.getFullYear()}
            options={rangeRight(1907, new Date().getFullYear() + 1).map((year, i) => ({value: year, id: i}))}
            onClick={() => this.toggleDropdownPicker('Year')}
            onSelect={({value}) => this.handleDropdownSelect(new Date(value, date.getMonth()))}
            isOpen={isYearPickerOpen}
            /> : <StaticCaption caption={date.getFullYear()}/>}
        </DropdownCaption>
      )
    } : {};

    const dayPickerProps = {
      initialMonth: calendarView,
      initialYear: calendarView,
      selectedDays: parse(value),
      month: calendarView,
      year: calendarView,
      showYearDropdown,
      locale,
      localeUtils,
      disabledDays: this.getDisabledDays(),
      showOutsideDays,
      modifiers,
      modifiersStyles,
      firstDayOfWeek: 1,
      ...showCustomCaption
    };

    const onKeyDown = e => {
      const keyHandle = this.keyMapping[e.keyCode];
      if (keyHandle && typeof keyHandle === 'function') {
        e.preventDefault();
        keyHandle(focusedDay || value);
      }
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
      noRightBorderRadius,
      onKeyDown,
      disabled,
      readOnly
    };

    const dayPickerInputProps = {
      value: this.formatDate(value, dateFormat, locale),
      placeholder: placeholderText,
      format: dateFormat,
      formatDate: this.formatDate,
      onDayChange: day => {
        if (!isSameDay(day, value)) {
          onChange(day);
        }
      },
      hideOnDayClick: shouldCloseOnSelect
    };

    if (disabled) {
      dayPickerInputProps.overlayComponent = () => null;
    }

    return (
      <div data-hook={dataHook} className={classNames(cssClasses)}>
        <DayPickerInput
          ref={dayPickerInput => (this.dayPickerInput = dayPickerInput)}
          component={DatePickerInput}
          dayPickerProps={dayPickerProps}
          inputProps={inputProps}
          {...dayPickerInputProps}
          />
      </div>
    );
  }
}
