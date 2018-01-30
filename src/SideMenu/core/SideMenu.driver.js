import ReactTestUtils from 'react-dom/test-utils';
import navigationStyles from './navigation/styles.scss';

const sideMenuDriverFactory = ({element}) => {
  const getHeader = () => element.querySelector('[data-hook=menu-header]');
  const getNavigation = () => element.querySelector('[data-hook=menu-navigation]');
  const getNavigationLinks = () => element.querySelectorAll('[data-hook=menu-navigation-link]');
  const getNavigationLinkWrappers = () => element.querySelectorAll('[data-hook=menu-navigation-link-wrapper]');
  const getNavigationSeparators = () => element.querySelectorAll('[data-hook=menu-navigation-separator]');
  const getNavigationCategories = () => element.querySelectorAll('[data-hook=menu-navigation-category]');
  const getNavigationBackLink = () => element.querySelector('[data-hook=menu-navigation-back-link]');
  const getPromotion = () => element.querySelector('[data-hook=menu-promotion]');
  const getFooter = () => element.querySelector('[data-hook=menu-footer]');
  const getBadge = link => link.querySelector('[data-hook=menu-navigation-badge]');

  return {
    exists: () => !!element,
    hasHeader: () => !!getHeader(),
    hasNavigation: () => !!getNavigation(),
    hasPromotion: () => !!getPromotion(),
    hasFooter: () => !!getFooter(),
    hasBackLink: () => !!getNavigationBackLink(),
    headerContent: () => getHeader().textContent,
    navigationLinks: () => getNavigationLinks(),
    navigationInnerLinks: () => getNavigationLinkWrappers(),
    isLinkActiveByIndex: index => getNavigationLinkWrappers()[index].classList.contains(navigationStyles.linkActive),
    isLinkBadgeVisibleByIndex: index => !!getBadge(getNavigationLinkWrappers()[index]),
    navigationSeparators: () => getNavigationSeparators(),
    navigationCategories: () => getNavigationCategories(),
    navigationCategoryContent: index => getNavigationCategories()[index].textContent,
    clickLinkByIndex: (index, eventType = 'click') => ReactTestUtils.Simulate[eventType](getNavigationLinks()[index]),
    clickInnerLinkByIndex: (index, eventType = 'click') => {
      const innerLink = getNavigationLinkWrappers()[index].querySelector('a');
      ReactTestUtils.Simulate[eventType](innerLink);
    },
    clickBackLink: (eventType = 'click') => ReactTestUtils.Simulate[eventType](getNavigationBackLink()),
    promotionContent: () => getPromotion().textContent,
    footerContent: () => getFooter().textContent
  };
};

export default sideMenuDriverFactory;
