import SideMenuDrill from './index';
import React, {Children} from 'react';
import styles from './DrillView.scss';
import Navigation from '../core/navigation';
import PropTypes from 'prop-types';
import NavigationLink from '../core/navigation/Link';
import NavigationBackLink from '../core/navigation/BackLink';
import NavigationCategory from '../core/navigation/Category';

const SubMenu = ({children, title, isOpen, isActive, onSelectHandler, onBackHandler, backLabel, showCategory, badge, linkDataHook, clickEventType}) => {
  if (!isOpen) {
    const clickEvent = {[clickEventType]: onSelectHandler};
    return (
      <NavigationLink isActive={isActive} {...clickEvent} badge={badge} withArrow={!badge} data-hook={linkDataHook}>
        {title}
      </NavigationLink>
    );
  }

  const wrappedNavigation = Children.map(children, child => {
    if (child.type === SideMenuDrill.Navigation) {
      return (
        <div className={styles.openSubMenu}>
          <NavigationBackLink clickEventType={clickEventType} onBackHandler={onBackHandler}>{backLabel}</NavigationBackLink>
          {showCategory && <NavigationCategory>{title}</NavigationCategory>}
          <Navigation>
            {child.props.children}
          </Navigation>
        </div>
      );
    }

    return child;
  });

  return (
    <div className={styles.subMenu} data-hook="menu-drill-sub-menu">
      {wrappedNavigation}
    </div>
  );
};

SubMenu.defaultProps = {
  isActive: false,
  isOpen: false,
  onSelectHandler: () => {},
  onBackHandler: () => {},
  backLabel: 'Back',
  showCategory: true,
  linkDataHook: 'menu-drill-sub-menu-link',
  clickEventType: 'onClick'
};

SubMenu.propTypes = {
  menuKey: PropTypes.string.isRequired,
  title: PropTypes.node.isRequired,
  isActive: PropTypes.bool,
  isOpen: PropTypes.bool,
  onSelectHandler: PropTypes.func,
  onBackHandler: PropTypes.func,
  backLabel: PropTypes.node,
  showCategory: PropTypes.bool,
  badge: PropTypes.node,
  linkDataHook: PropTypes.string,
  children: PropTypes.node.isRequired,
  clickEventType: PropTypes.oneOf(['onClick', 'onMouseDown'])
};

export default SubMenu;
