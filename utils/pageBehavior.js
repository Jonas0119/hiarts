const { updateNavigationBarTitle } = require('./i18n');

module.exports = Behavior({
  lifetimes: {
    attached() {
      updateNavigationBarTitle();
    }
  },
  
  pageLifetimes: {
    show() {
      updateNavigationBarTitle();
    }
  }
}); 