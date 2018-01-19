import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import pick from 'lodash/pick';

import {LocaleUtils} from 'react-day-picker';
import DayPickerInput from 'react-day-picker/DayPickerInput';

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
import {
  DropdownPicker,
  DropdownCaption,
  StaticCaption
} from './DropdownPicker';
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
    noRightBorderRadius: PropTypes.string
  };

  static defaultProps = {
    style: {
      width: 150
    },
    locale: 'en',
    dateFormat: 'MM/DD/YYYY',
    filterDate: () => true,
    shouldCloseOnSelect: true
  };

  constructor(props) {
    super(props);

    const initialValue = props.value || new Date();

    this.state = {
      isMonthPickerOpen: false,
      isYearPickerOpen: false,
      value: initialValue,
      focusedValue: initialValue
    };
  }

  toggleDropdownPicker = picker =>
    () => this.setState({[`is${picker}PickerOpen`]: !this.state[`is${picker}PickerOpen`]});

  closeDropdownPicker = () =>
    this.setState({
      isYearPickerOpen: false,
      isMonthPickerOpen: false
    });

  handleDropdownSelect = date =>
    this.setState({
      value: date,
      isMonthPickerOpen: false,
      isYearPickerOpen: false
    });

  openCalendar = () =>
    this.dayPickerInput.showDayPicker();

  closeCalendar = () =>
    this.dayPickerInput.hideDayPicker();

  setFocusedValue = focusedValue => this.setState({focusedValue})

  createDayPickerProps() {
    const {locale, showMonthDropdown, showYearDropdown, showOutsideDays = true, filterDate, excludePastDates} = this.props;
    const {value, focusedValue} = this.state;
    const localeUtils = {
      ...LocaleUtils,
      formatMonthTitle: createFormatMonthTitle(locale),
      formatWeekdayShort: createFormatWeekdayShort(locale),
      formatWeekdayLong: createFormatWeekdayLong(locale)
    };

    const modifiers = focusedValue ? {'keyboard-selected': focusedValue} : {};
    const modifiersStyles = {'keyboard-selected': {}};
    const showCustomCaption = showMonthDropdown || showYearDropdown ? {
      // eslint-disable-next-line react/prop-types
      captionElement: ({date, localeUtils}) => (
        <DropdownCaption>
          {showMonthDropdown ? this.createMonthDropdown({date, localeUtils}) : <StaticCaption caption={localeUtils.getMonths()[date.getMonth()]}/>}
          {showYearDropdown ? this.createYearDropdown({date}) : <StaticCaption caption={date.getFullYear()}/>}
        </DropdownCaption>
      )
    } : {};

    return {
      disabledDays:
        excludePastDates ?
          [{before: new Date()}] : // todo adjust with tz
          date => !filterDate(date),

      initialMonth: focusedValue,
      initialYear: focusedValue,
      selectedDays: parse(value),
      month: focusedValue,
      year: focusedValue,
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
    // map some of our prop names to react-day-picker prop names
    const {
      dateFormat: format,
      disabled,
      locale,
      onChange,
      placeholderText: placeholder,
      shouldCloseOnSelect: hideOnDayClick
    } = this.props;

    const dayPickerInputProps = {
      value: formatDate(this.state.focusedValue, format, locale),
      placeholder,
      format,
      formatDate,
      hideOnDayClick,
      onDayChange: day => {
        if (!isSameDay(day, this.state.focusedValue)) {
          onChange(day);
        }
      }
    };

    if (disabled) {
      dayPickerInputProps.overlayComponent = () => null;
    }

    return dayPickerInputProps;
  }

  keyHandlers = {
    // enter
    13: value => {
      this.setState({
        value,
        focusedValue: value
      });

      if (!isSameDay(value, this.state.value || this.props.value)) {
        this.props.onChange(value);
      }

      if (this.props.shouldCloseOnSelect) {
        this.closeCalendar();
      }
    },

    // escape
    27: this.closeCalendar,

    // page up
    33: value =>
      this.setFocusedValue(subMonths(this.state.focusedValue || value, 1)),

    // page down
    34: value =>
      this.setFocusedValue(addMonths(this.state.focusedValue || value, 1)),

    // end
    35: value =>
      this.setFocusedValue(addYears(this.state.focusedValue || value, 1)),

    // home
    36: value =>
      this.setFocusedValue(subYears(this.state.focusedValue || value, 1)),

    // left arrow
    37: value =>
      this.setFocusedValue(subDays(value, 1)),

    // up arrow
    38: value =>
      this.setFocusedValue(subDays(value, 7)),

    // right arrow
    39: value =>
      this.setFocusedValue(addDays(value, 1)),

    // down arrow
    40: value =>
      this.setFocusedValue(addDays(value, 7)),

    // tab
    9: this.closeCalendar
  };

  createInputProps() {
    const onKeyDown = event => {
      const keyHandler = this.keyHandlers[event.keyCode] || (() => event.preventDefault());

      keyHandler(this.state.focusedValue || this.props.value);
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
    const {inputDataHook, noLeftBorderRadius, noRightBorderRadius} = this.props;

    return (
      <div
        data-hook={inputDataHook}
        className={classNames(styles.wrapper, noLeftBorderRadius, noRightBorderRadius)}
        >
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
