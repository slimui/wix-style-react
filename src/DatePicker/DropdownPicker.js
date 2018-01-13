import React from 'react';
import PropTypes from 'prop-types';
import DropdownLayout from '../DropdownLayout';
import Button from '../Button';
import {ArrowDownThin} from '../Icons';
import classNames from 'classnames';
import styles from './DatePicker.scss';

export const DropdownPicker = ({value, caption, options, isOpen, onClick, onSelect, dataHook}) => (
  <div className={styles.dropdownContainer}>
    <Button
      dataHook={`${dataHook}-button`}
      height="medium"
      suffixIcon={<ArrowDownThin/>}
      onClick={onClick}
      theme="dark-no-border"
      >
      {caption}
    </Button>
    <DropdownLayout
      dataHook={`${dataHook}-menu`}
      value={value}
      visible={isOpen}
      options={options}
      onSelect={onSelect}
      onClickOutside={onClick}
      closeOnSelect
      />
  </div>
);

DropdownPicker.propTypes = {
  dataHook: PropTypes.string,
  date: PropTypes.any,
  value: PropTypes.number,
  caption: PropTypes.any,
  options: PropTypes.array,
  isOpen: PropTypes.bool,
  onClick: PropTypes.func,
  onSelect: PropTypes.func
};

export const StaticCaption = ({caption}) =>
  <div className={classNames(styles.staticCaption)}>{caption}</div>;

StaticCaption.propTypes = {
  caption: PropTypes.any
};

export const DropdownCaption = ({children}) =>
  <div className={classNames(styles.dropdownCaptionContainer)}>{children}</div>;

DropdownCaption.propTypes = {
  children: PropTypes.any
};
