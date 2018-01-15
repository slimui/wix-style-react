import React from 'react';
import PropTypes from 'prop-types';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import {LocaleUtils} from 'react-day-picker';
import classNames from 'classnames';
import pick from 'lodash/pick';
import isFunction from 'lodash/isFunction';
import addDays from 'date-fns/add_days';
import subDays from 'date-fns/sub_days';
import addMonths from 'date-fns/add_months';
import subMonths from 'date-fns/sub_months';
import addYears from 'date-fns/add_years';
import subYears from 'date-fns/sub_years';
import parse from 'date-fns/parse';
import isSameDay from 'date-fns/is_same_day';
import WixComponent from '../BaseComponents/WixComponent';
import DatePickerInput from './DatePickerInput';
import {DropdownPicker, DropdownCaption, StaticCaption} from './DropdownPicker';
import {
  createFormatMonthTitle,
  createFormatWeekdayLong,
  createFormatWeekdayShort,
  formatDate,
  getMonths,
  getYears
} from './LocaleUtils';
import styles from './DatePicker.scss';

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

  toggleDropdownPicker = picker => () => this.setState({[`is${picker}PickerOpen`]: !this.state[`is${picker}PickerOpen`]});

  closeDropdownPicker = () => this.setState({isYearPickerOpen: false, isMonthPickerOpen: false});

  handleDropdownSelect = date => this.setState({calendarView: date, isMonthPickerOpen: false, isYearPickerOpen: false});

  getDisabledDays() {
    if (this.props.excludePastDates) {
      return [{
        before: new Date()//todo adjust with tz
      }];
    }

    return date => !this.props.filterDate(date);
  }

  openCalendar() {
    this.dayPickerInput.showDayPicker();
  }

  closeCalendar() {
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
      this.closeCalendar();
    }
  }

  get keyMapping() {
    return {
      37: day => this.goPrevDay(day),
      38: day => this.goPrevWeek(day),
      39: day => this.goNextDay(day),
      40: day => this.goNextWeek(day),
      27: () => this.closeCalendar(),
      9: () => this.closeCalendar(),
      13: day => this.selectDay(day),
      33: day => this.goPrevMonth(day),
      34: day => this.goNextMonth(day),
      36: day => this.goPrevYear(day),
      35: day => this.goNextYear(day),
      ...this.props.keyMappings
    };
  }

  createDayPickerProps() {
    const value = this.state.value || this.props.value;
    const {locale, showMonthDropdown, showYearDropdown, showOutsideDays = true} = this.props;
    const {calendarView, focusedDay} = this.state;
    const localeUtils = {
      ...LocaleUtils,
      formatMonthTitle: createFormatMonthTitle(locale),
      formatWeekdayShort: createFormatWeekdayShort(locale),
      formatWeekdayLong: createFormatWeekdayLong(locale)
    };

    const modifiers = focusedDay ? {'keyboard-selected': focusedDay} : {};
    const modifiersStyles = {'keyboard-selected': {}};
    const showCustomCaption = showMonthDropdown || showYearDropdown ? {
      // eslint-disable-next-line react/prop-types
      captionElement: ({date, localeUtils}) => (
        <DropdownCaption>
          {showMonthDropdown ? this.createMonthDropdown({date, localeUtils}) :
          <StaticCaption caption={localeUtils.getMonths()[date.getMonth()]}/>}
          {showYearDropdown ? this.createYearDropdown({date}) : <StaticCaption caption={date.getFullYear()}/>}
        </DropdownCaption>
      )
    } : {};

    return {
      disabledDays: this.getDisabledDays(),
      initialMonth: calendarView,
      initialYear: calendarView,
      selectedDays: parse(value),
      month: calendarView,
      year: calendarView,
      firstDayOfWeek: 1,
      showYearDropdown,
      locale,
      localeUtils,
      showOutsideDays,
      modifiers,
      modifiersStyles,
      ...showCustomCaption
    };
  }

  createDayPickerInputProps() {
    const value = this.state.value || this.props.value;
    const {dateFormat, locale, placeholderText, shouldCloseOnSelect, disabled, onChange} = this.props;
    const dayPickerInputProps = {
      value: formatDate(value, dateFormat, locale),
      placeholder: placeholderText,
      format: dateFormat,
      formatDate,
      hideOnDayClick: shouldCloseOnSelect,
      onDayChange: day => {
        if (!isSameDay(day, value)) {
          onChange(day);
        }
      }
    };

    if (disabled) {
      dayPickerInputProps.overlayComponent = () => null;
    }

    return dayPickerInputProps;
  }

  createInputProps() {
    const onKeyDown = e => {
      const handleKey = this.keyMapping[e.keyCode];
      if (isFunction(handleKey)) {
        e.preventDefault();
        handleKey(this.state.focusedDay || this.props.value);
      }
    };

    return {
      onKeyDown,
      dataHook: this.props.inputDataHook,
      ...pick(this.props, [
        'rtl',
        'style',
        'theme',
        'prefix',
        'onEnterPressed',
        'error',
        'errorMessage',
        'customInput',
        'noLeftBorderRadius',
        'noRightBorderRadius',
        'disabled',
        'readOnly'
      ])
    };
  }

  createMonthDropdown({date, localeUtils}) {
    return (
      <DropdownPicker
        dataHook="show-month-dropdown"
        value={date.getMonth()}
        caption={localeUtils.getMonths()[date.getMonth()]}
        options={getMonths(localeUtils)}
        onClick={this.toggleDropdownPicker('Month')}
        closeDropdownPicker={this.closeDropdownPicker}
        onSelect={({id}) => this.handleDropdownSelect(new Date(date.getFullYear(), id))}
        isOpen={this.state.isMonthPickerOpen}
        />
    );
  }

  createYearDropdown({date}) {
    return (
      <DropdownPicker
        dataHook="show-year-dropdown"
        value={date.getFullYear()}
        caption={date.getFullYear()}
        options={getYears()}
        onClick={this.toggleDropdownPicker('Year')}
        closeDropdownPicker={this.closeDropdownPicker}
        onSelect={({value}) => this.handleDropdownSelect(new Date(value, date.getMonth()))}
        isOpen={this.state.isYearPickerOpen}
        />
    );
  }

  render() {
    const {inputDataHook: dataHook, noLeftBorderRadius, noRightBorderRadius} = this.props;
    const cssClasses = [styles.wrapper, noLeftBorderRadius, noRightBorderRadius];

    return (
      <div data-hook={dataHook} className={classNames(cssClasses)}>
        <DayPickerInput
          ref={dayPickerInput => this.dayPickerInput = dayPickerInput}
          component={DatePickerInput}
          dayPickerProps={this.createDayPickerProps()}
          inputProps={this.createInputProps()}
          {...this.createDayPickerInputProps()}
          />
      </div>
    );
  }
}
