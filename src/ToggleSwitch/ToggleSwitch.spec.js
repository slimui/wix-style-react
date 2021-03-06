import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import toggleSwitchDriverFactory from './ToggleSwitch.driver';
import {createDriverFactory} from '../test-common';
import {toggleSwitchTestkitFactory} from '../../testkit';
import ToggleSwitch from './ToggleSwitch';
import {toggleSwitchTestkitFactory as enzymeToggleSwitchTestkitFactory} from '../../testkit/enzyme';
import {mount} from 'enzyme';

describe('ToggleSwitch', () => {

  const createDriver = createDriverFactory(toggleSwitchDriverFactory);

  describe('checked attribute', () => {
    it('should pass down to input', () => {
      const driver = createDriver(<ToggleSwitch checked onChange={() => {}}/>);
      expect(driver.isChecked()).toBeTruthy();
    });

    it('should pass down to input', () => {
      const driver = createDriver(<ToggleSwitch checked={false} onChange={() => {}}/>);
      expect(driver.isChecked()).toBeFalsy();
    });
  });

  describe('onChange attribute', () => {
    it('should be called when the input is clicked', () => {
      const onChange = jest.fn();
      const driver = createDriver(<ToggleSwitch checked={false} onChange={onChange}/>);

      driver.click();
      expect(onChange).toBeCalled();
    });
  });

  describe('size attribute', () => {
    it('should create a large toggle by default', () => {
      const driver = createDriver(<ToggleSwitch checked={false} onChange={() => {}}/>);
      expect(driver.isXSmall()).toBeFalsy();
      expect(driver.isSmall()).toBeFalsy();
      expect(driver.isLarge()).toBeTruthy();
    });

    it('should create a small toggle once given size', () => {
      const driver = createDriver(<ToggleSwitch checked={false} onChange={() => {}} size="small"/>);
      expect(driver.isXSmall()).toEqual(false);
      expect(driver.isSmall()).toEqual(true);
      expect(driver.isLarge()).toEqual(false);
    });

    it('should create a x-small toggle once given size', () => {
      const driver = createDriver(<ToggleSwitch checked={false} onChange={() => {}} size="x-small"/>);
      expect(driver.isXSmall()).toEqual(true);
      expect(driver.isSmall()).toEqual(false);
      expect(driver.isLarge()).toEqual(false);
    });
  });

  describe('disabled attribute', () => {
    it('should not be disabled by default', () => {
      const driver = createDriver(<ToggleSwitch/>);
      expect(driver.isDisabled()).toBe(false);
    });

    it('should not be clickable when disabled and unchecked', () => {
      const onChange = jest.fn();
      const driver = createDriver(<ToggleSwitch checked={false} onChange={onChange} disabled/>);
      driver.click();
      expect(onChange).toHaveBeenCalledTimes(0);
      expect(driver.isChecked()).toBe(false);
    });

    it('should not be clickable when disabled and checked', () => {
      const onChange = jest.fn();
      const driver = createDriver(<ToggleSwitch checked onChange={onChange} disabled/>);
      driver.click();
      expect(onChange).toHaveBeenCalledTimes(0);
      expect(driver.isChecked()).toBe(true);
    });
  });

  describe('colors', () => {
    it('should work with default colors', () => {
      const driver = createDriver(<ToggleSwitch checked={false} onChange={() => {}}/>);
      expect(driver.fillColor()).toBe('');

      const driverChecked = createDriver(<ToggleSwitch checked onChange={() => {}}/>);
      expect(driverChecked.fillColor()).toBe('');

      const driverDisabled = createDriver(<ToggleSwitch disabled onChange={() => {}}/>);
      expect(driverDisabled.fillColor()).toBe('');
    });

    it('should work with given colors', () => {
      const driver = createDriver(<ToggleSwitch colorUnchecked="color1" colorChecked="color2" colorDisabled="color3" onChange={() => {}}/>);
      expect(driver.fillColor()).toBe('color1');

      const driverChecked = createDriver(<ToggleSwitch colorUnchecked="color1" colorChecked="color2" colorDisabled="color3" checked onChange={() => {}}/>);
      expect(driverChecked.fillColor()).toBe('color2');

      const driverDisabled = createDriver(<ToggleSwitch colorUnchecked="color1" colorChecked="color2" colorDisabled="color3" disabled onChange={() => {}}/>);
      expect(driverDisabled.fillColor()).toBe('color3');
    });
  });

  describe('testkit', () => {
    it('should exist', () => {
      const div = document.createElement('div');
      const dataHook = 'myDataHook';
      const wrapper = div.appendChild(ReactTestUtils.renderIntoDocument(<div><ToggleSwitch dataHook={dataHook}/></div>));
      const toggleSwitchTestkit = toggleSwitchTestkitFactory({wrapper, dataHook});
      expect(toggleSwitchTestkit.exists()).toBeTruthy();
    });
  });

  describe('enzyme testkit', () => {
    it('should exist', () => {
      const dataHook = 'myDataHook';
      const wrapper = mount(<ToggleSwitch dataHook={dataHook}/>);
      const toggleSwitchTestkit = enzymeToggleSwitchTestkitFactory({wrapper, dataHook});
      expect(toggleSwitchTestkit.exists()).toBeTruthy();
    });
  });
});
