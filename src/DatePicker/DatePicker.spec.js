import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import {mount} from 'enzyme';
import {createDriverFactory} from '../test-common';
import applyPolyfills from './Polyfills';
import {datePickerTestkitFactory} from '../../testkit/index';
import {datePickerTestkitFactory as enzymeDatePickerTestkitFactory} from '../../testkit/enzyme';
import datePickerDriverFactory from './DatePicker.driver';
import Input from '../Input';
import DatePicker from './DatePicker';
import isEqual from 'date-fns/is_equal';

describe('DatePicker', () => {
  const createDriver = createDriverFactory(datePickerDriverFactory);
  let onChange;

  applyPolyfills(window, global);

  beforeEach(() => {
    onChange = jest.fn();
  });

  describe('date picker input', () => {
    it('should exist', () => {
      const {inputDriver} = createDriver(<DatePicker onChange={onChange}/>);

      expect(inputDriver.exists()).toBe(true);
    });

    it('should set inputDataHook from props', () => {
      const {inputDriver} = createDriver(<DatePicker onChange={onChange} inputDataHook={'inputDataHook'}/>);

      expect(inputDriver.getDataHook()).toBe('inputDataHook');
    });

    it('should set datePicker disabled from props', () => {
      const {inputDriver} = createDriver(<DatePicker onChange={onChange} disabled/>);

      expect(inputDriver.isDisabled()).toBeTruthy();
    });

    it('should not open calendar when disabled', () => {
      const {inputDriver, calendarDriver} = createDriver(<DatePicker onChange={onChange} disabled/>);

      inputDriver.trigger('click');
      expect(calendarDriver.isVisible()).toBe(false);
    });

    it('should show correct value from props', () => {
      const date = new Date(2017, 9, 2);
      const {inputDriver} = createDriver(<DatePicker onChange={onChange} value={date}/>);

      expect(inputDriver.getValue()).toBe('10/02/2017');
    });

    it('should show correct value from props depends on date format', () => {
      const date = new Date(2017, 9, 2);
      const {inputDriver} = createDriver(<DatePicker
        onChange={onChange} value={date}
        dateFormat={'DD/MM/YYYY'}
        />);

      expect(inputDriver.getValue()).toBe('02/10/2017');
    });

    it('should set placeholder from placeholderText property', () => {
      const {inputDriver} = createDriver(<DatePicker
        onChange={onChange}
        placeholderText={'Datepicker test placeholder'}
        />);

      expect(inputDriver.getPlaceholder()).toBe('Datepicker test placeholder');
    });

    it('should set placeholder from placeholder property for customInput', () => {
      const {inputDriver} = createDriver(<DatePicker
        onChange={onChange}
        customInput={<Input placeholder={'Input test placeholder'}/>}
        />);

      expect(inputDriver.getPlaceholder()).toBe('Input test placeholder');
    });

    it('should set placeholder from placeholder property for customInput even if placeholderText property was specified', () => {
      const {inputDriver} = createDriver(<DatePicker
        onChange={onChange}
        customInput={<Input placeholder={'customInputPlaceholder'}/>}
        placeholderText={'textPlaceholder'}
        />);

      expect(inputDriver.getPlaceholder()).toBe('customInputPlaceholder');
    });

    it('should be readonly', () => {
      const {inputDriver} = createDriver(<DatePicker
        onChange={onChange}
        readOnly
        />);

      expect(inputDriver.getReadOnly()).toBeTruthy();
    });

    it('should not be readonly', () => {
      const {inputDriver} = createDriver(<DatePicker
        onChange={onChange}
        />);

      expect(inputDriver.getReadOnly()).toBeFalsy();
    });

    it('has prefix by default', () => {
      const {inputDriver} = createDriver(<DatePicker
        onChange={onChange}
        />);

      expect(inputDriver.hasPrefix()).toBe(true);
    });

    it('has custom prefix', () => {
      const {inputDriver} = createDriver(<DatePicker
        onChange={onChange}
        prefix={<span>#</span>}
        />);

      expect(inputDriver.hasPrefix()).toBe(true);
    });
  });

  describe('calendar', () => {
    it('should not show calendar on start', () => {
      const {calendarDriver} = createDriver(<DatePicker onChange={onChange}/>);

      expect(calendarDriver.isVisible()).toBe(false);
    });

    it('should not call onChange when select selected date with enter', () => {
      const value = new Date(2017, 5, 2);
      const {inputDriver} = createDriver(<DatePicker value={value} onChange={onChange}/>);

      inputDriver.trigger('click');
      inputDriver.trigger('keyDown', {keyCode: 13});

      expect(onChange).not.toHaveBeenCalled();
    });

    it('should not call onChange when select selected date with click', () => {
      const value = new Date(2017, 5, 1);
      const {calendarDriver, inputDriver} = createDriver(<DatePicker value={value} onChange={onChange}/>);

      inputDriver.trigger('click');
      calendarDriver.clickOnNthDay();

      expect(onChange).not.toHaveBeenCalled();
    });

    describe('should be opened', () => {
      it('on click on datePickerInput', () => {
        const {calendarDriver, inputDriver} = createDriver(<DatePicker onChange={onChange}/>);

        inputDriver.trigger('click');
        expect(calendarDriver.isVisible()).toBe(true);
      });

      it('on focus', () => {
        const value = new Date(2017, 5, 2);
        const {inputDriver, calendarDriver} = createDriver(<DatePicker value={value} onChange={onChange}/>);
        inputDriver.focus();
        expect(calendarDriver.isVisible()).toBe(true);
      });
    });

    describe('should be closed', () => {
      it('on select date with Enter key', () => {
        const value = new Date(2017, 5, 2);
        const {inputDriver, calendarDriver} = createDriver(<DatePicker value={value} onChange={onChange}/>);

        inputDriver.trigger('click');
        inputDriver.trigger('keyDown', {key: 'ArrowRight', keyCode: 39});
        inputDriver.trigger('keyDown', {key: 'Enter', keyCode: 13});

        expect(calendarDriver.isVisible()).toBe(false);
      });

      it('on select date with click', () => {
        const {inputDriver, calendarDriver} = createDriver(<DatePicker onChange={onChange}/>);

        inputDriver.trigger('click');
        calendarDriver.clickOnNthDay();

        setTimeout(() => expect(calendarDriver.isVisible()).toBe(false), 0);
      });

      it('on press "Escape" key', () => {
        const {inputDriver, calendarDriver} = createDriver(<DatePicker onChange={onChange}/>);

        inputDriver.trigger('click');
        inputDriver.trigger('keyDown', {key: 'Escape', keyCode: 27});

        expect(calendarDriver.isVisible()).toBe(false);
      });

      it('on press "Tab" key', () => {
        const {inputDriver, calendarDriver} = createDriver(<DatePicker onChange={onChange}/>);

        inputDriver.trigger('click');
        inputDriver.trigger('keyDown', {key: 'Tab', keyCode: 9});

        expect(calendarDriver.isVisible()).toBe(false);
      });
    });

    it('should not close calendar on select when "shouldCloseOnSelect" property is false', () => {
      const {inputDriver, calendarDriver} = createDriver(
        <DatePicker
          onChange={onChange}
          shouldCloseOnSelect={false}
          />
      );

      inputDriver.trigger('click');
      calendarDriver.clickOnNthDay();

      expect(calendarDriver.isVisible()).toBe(true);
    });

    it('should call onChange when click on available day', () => {
      const value = new Date(2017, 7, 1);
      const expectedValue = new Date(2017, 7, 2);
      const {calendarDriver, inputDriver} = createDriver(
        <DatePicker
          value={value}
          onChange={onChange}
          />
      );
      inputDriver.trigger('click');
      calendarDriver.clickOnNthDay(1);

      const newValue = onChange.mock.calls[0][0];

      expect(onChange).toHaveBeenCalled();
      expect(isEqual(newValue, expectedValue)).toBe(true);
    });

    it('should not give an ability to select past dates if it is specified in props', () => {
      const date = new Date(2015, 9, 2);
      const {calendarDriver, inputDriver} = createDriver(
        <DatePicker
          onChange={onChange}
          value={date}
          excludePastDates
          />
      );

      inputDriver.trigger('click');
      calendarDriver.clickOnNthDay();

      expect(onChange).not.toHaveBeenCalled();
      expect(calendarDriver.isVisible()).toBe(true);
    });

    it('should select previous month on previous month button click', () => {
      const date = new Date(2015, 9, 2);
      const {calendarDriver, inputDriver} = createDriver(
        <DatePicker
          onChange={onChange}
          value={date}
          />
      );

      inputDriver.trigger('click');
      calendarDriver.clickOnPrevMonthButton();
      calendarDriver.clickOnNthDay();

      const newDate = onChange.mock.calls[0][0];
      expect(newDate.getMonth()).toEqual(8);
    });

    it('should show calendar in provided locale', () => {
      const date = new Date(2015, 9, 2);
      const {calendarDriver, inputDriver} = createDriver(
        <DatePicker
          onChange={onChange}
          locale="fr"
          value={date}
          />
      );

      inputDriver.trigger('click');
      calendarDriver.clickOnPrevMonthButton();

      expect(calendarDriver.getNthWeekDayName(0)).toEqual('lu');
      expect(calendarDriver.getNthWeekDayName(6)).toEqual('di');
      expect(calendarDriver.getCurrentMonthWithYear()).toEqual('septembre 2015');
      expect(inputDriver.getValue()).toBe('02/10/2015');
    });

    it('should show date in provided format instead of locale format', () => {
      const date = new Date(2017, 9, 2);
      const {inputDriver} = createDriver(
        <DatePicker
          onChange={onChange}
          locale="fr"
          dateFormat="YYYY/MM/DD"
          value={date}
          />
      );

      expect(inputDriver.getValue()).toBe('2017/10/02');
    });

    it('should select next month on next month button click', () => {
      const date = new Date(2015, 9, 2);
      const {calendarDriver, inputDriver} = createDriver(
        <DatePicker
          onChange={onChange}
          value={date}
          />
      );

      inputDriver.trigger('click');
      calendarDriver.clickOnNextMonthButton();
      calendarDriver.clickOnNthDay();

      const newDate = onChange.mock.calls[0][0];
      expect(newDate.getMonth()).toEqual(10);
    });

    it('should show caption by default', () => {
      const date = new Date(2015, 9, 2);
      const {calendarDriver, inputDriver} = createDriver(
        <DatePicker onChange={onChange} value={date}/>
      );

      inputDriver.trigger('click');
      expect(calendarDriver.isCaptionVisible()).toEqual(true);
    });

    it('should hide caption if year dropdown is visible', () => {
      const date = new Date(2015, 9, 2);
      const {calendarDriver, inputDriver} = createDriver(
        <DatePicker
          onChange={onChange}
          showYearDropdown
          value={date}
          />
      );

      inputDriver.trigger('click');
      expect(calendarDriver.isCaptionVisible()).toEqual(false);
    });

    it('should hide caption if month dropdown is visible', () => {
      const date = new Date(2015, 9, 2);
      const {calendarDriver, inputDriver} = createDriver(
        <DatePicker
          onChange={onChange}
          showMonthDropdown
          value={date}
          />
      );

      inputDriver.trigger('click');
      expect(calendarDriver.isCaptionVisible()).toEqual(false);
    });

    describe('with year dropdown', () => {
      it('should give a possibility to choose date from another year', () => {
        const date = new Date(2015, 9, 2);
        const {calendarDriver, inputDriver} = createDriver(
          <DatePicker
            onChange={onChange}
            showYearDropdown
            value={date}
            />
        );

        inputDriver.trigger('click');
        calendarDriver.clickOnYearDropdown();
        calendarDriver.clickOnNthYear();
        calendarDriver.clickOnNthDay();

        const newDate = onChange.mock.calls[0][0];
        expect(newDate.getFullYear()).not.toEqual(date.getFullYear());
      });
    });

    describe('When trigger open and close', () => {
      it('should open calendar using ref', () => {
        const {calendarDriver} = createDriver(<DatePicker onChange={onChange}/>);

        calendarDriver.open();

        expect(calendarDriver.isVisible()).toBe(true);
      });

      it('should close calendar using ref', () => {
        const {calendarDriver} = createDriver(<DatePicker onChange={onChange}/>);

        calendarDriver.open();
        calendarDriver.close();

        expect(calendarDriver.isVisible()).toBe(false);
      });
    });
  });

  describe('testkit', () => {
    it('should exist', () => {
      const div = document.createElement('div');
      const dataHook = 'dataHook';
      const wrapper = div.appendChild(ReactTestUtils.renderIntoDocument(
        <div>
          <DatePicker
            onChange={() => {
            }}
            dataHook={dataHook}
            />
        </div>
      ));
      const {driver, calendarDriver, inputDriver} = datePickerTestkitFactory({wrapper, dataHook});

      expect(driver.exists()).toBe(true);
      expect(inputDriver.exists()).toBe(true);
      expect(calendarDriver.isVisible()).toBe(false);
    });
  });

  describe('enzyme testkit', () => {
    it('should exist', () => {
      const dataHook = 'dataHook';
      const wrapper = mount(<DatePicker
        onChange={() => {
        }}
        dataHook={dataHook}
        />);
      const {driver, calendarDriver, inputDriver} = enzymeDatePickerTestkitFactory({wrapper, dataHook});

      expect(driver.exists()).toBe(true);
      expect(inputDriver.exists()).toBe(true);
      expect(calendarDriver.isVisible()).toBe(false);
    });
  });
});
