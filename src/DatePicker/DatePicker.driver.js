import ReactTestUtils from 'react-dom/test-utils';
import inputDriverFactory from '../Input/Input.driver';

const datePickerDriverFactory = ({element, wrapper, componentInstance}) => {

  const inputRoot = element && element.children[0].querySelector('.root');
  const inputDriver = inputDriverFactory({element: inputRoot, wrapper});
  const getCalendar = () => element.querySelector('.DayPicker');
  const getNthDay = n => element.querySelectorAll('[role="gridcell"]:not([class*="outside"])')[n];
  const getSelectedDay = () => element.querySelector('[role="gridcell"][aria-selected=true]');
  const getYearDropdown = () => element.querySelector('[data-hook="show-year-dropdown-button"]');
  const getNthYear = n => element.querySelector(`[data-hook="dropdown-item-${n}"]`);
  const getMonthAndYear = () => element.querySelector('[class="DayPicker-Caption"] div');
  const getNthWeekDayName = n => element.querySelectorAll('[class="DayPicker-Weekday"] abbr')[n];
  const getPrevMonthButton = () => element.querySelector('[class$="DayPicker-NavButton--prev"]');
  const getNextMonthButton = () => element.querySelector('[class$="DayPicker-NavButton--next"]');

  const driver = {
    exists: () => !!element
  };

  const calendarDriver = {
    isVisible: () => !!getCalendar(),
    getCurrentMonthWithYear: () => getMonthAndYear() ? getMonthAndYear().textContent : '',
    getNthWeekDayName: (n = 0) => getNthWeekDayName(n) ? getNthWeekDayName(n).textContent : '',
    clickOnNthDay: (n = 0) => ReactTestUtils.Simulate.click(getNthDay(n)),
    clickOnSelectedDay: () => ReactTestUtils.Simulate.click(getSelectedDay()),
    clickOnYearDropdown: () => ReactTestUtils.Simulate.click(getYearDropdown()),
    clickOnNthYear: (n = 1) => ReactTestUtils.Simulate.mouseDown(getNthYear(n)),
    clickOnPrevMonthButton: () => ReactTestUtils.Simulate.click(getPrevMonthButton()),
    clickOnNextMonthButton: () => ReactTestUtils.Simulate.click(getNextMonthButton()),
    open: () => componentInstance.open(),
    close: () => componentInstance.close(),
    isCaptionVisible: () => !!wrapper.querySelector('[class="DayPicker-Caption"]')
  };

  return {
    driver,
    inputDriver,
    calendarDriver
  };
};

export default datePickerDriverFactory;
