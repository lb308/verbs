/*global FastClick*/

import ScrollListener from 'lb308/utils/ScrollListener';
import Drawer from 'lb308/utils/Drawer';
import mapRoutes from 'lb308/utils/mapRoutes';

import Navigation from 'lb308/components/Navigation';
import HeaderPrimary from 'lb308/components/HeaderPrimary';
import HeaderSecondary from 'lb308/components/HeaderSecondary';
import AdminNav from 'lb308/components/AdminNav';
import ModalManager from 'lb308/components/ModalManager';
import AlertManager from 'lb308/components/AlertManager';

/**
 * The `boot` initializer boots up the admin app. It initializes some app
 * globals, mounts components to the page, and begins routing.
 *
 * @param {ForumApp} app
 */
export default function boot(app) {
  m.startComputation();

  m.mount(document.getElementById('app-navigation'), Navigation.component({className: 'App-backControl', drawer: true}));
  m.mount(document.getElementById('header-navigation'), Navigation.component());
  m.mount(document.getElementById('header-primary'), HeaderPrimary.component());
  m.mount(document.getElementById('header-secondary'), HeaderSecondary.component());
  m.mount(document.getElementById('admin-navigation'), AdminNav.component());

  app.drawer = new Drawer();
  app.modal = m.mount(document.getElementById('modal'), ModalManager.component());
  app.alerts = m.mount(document.getElementById('alerts'), AlertManager.component());
  app.history = {
    canGoBack: () => true,
    getPrevious: () => {},
    backUrl: () => app.forum.attribute('baseUrl'),
    back: function() {
      window.location = this.backUrl();
    }
  };

  m.route.mode = 'hash';
  m.route(document.getElementById('content'), '/', mapRoutes(app.routes));

  m.endComputation();

  // Add a class to the body which indicates that the page has been scrolled
  // down.
  new ScrollListener(top => {
    const $app = $('#app');
    const offset = $app.offset().top;

    $app
      .toggleClass('affix', top >= offset)
      .toggleClass('scrolled', top > offset);
  }).start();

  app.booted = true;

  // If an extension has just been enabled, then we will run its settings
  // callback.
  const enabled = localStorage.getItem('enabledExtension');
  if (enabled && app.extensionSettings[enabled]) {
    app.extensionSettings[enabled]();
    localStorage.removeItem('enabledExtension');
  }
}
