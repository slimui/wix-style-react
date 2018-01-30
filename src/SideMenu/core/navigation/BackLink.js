import React from 'react';
import {func, node, string} from 'prop-types';
import styles from './styles.scss';
import ArrowLeft from '../../../Icons/dist/components/ArrowLeft';

const BackLink = ({onBackHandler, children, clickEventType}) => {
  const clickEvent = {[clickEventType]: onBackHandler};
  return (
    <a className={styles.backLink} {...clickEvent} data-hook="menu-navigation-back-link">
      <span className={styles.backArrow}><ArrowLeft/></span>
      <span>{children}</span>
    </a>
  );
};

BackLink.defaultProps = {
  clickEventType: 'onClick'
};

BackLink.propTypes = {
  onBackHandler: func,
  children: node,
  clickEventType: string
};

export default BackLink;
