import DashboardPage from 'lb308/components/DashboardPage';
import BasicsPage from 'lb308/components/BasicsPage';
import PermissionsPage from 'lb308/components/PermissionsPage';
import AppearancePage from 'lb308/components/AppearancePage';
import ExtensionsPage from 'lb308/components/ExtensionsPage';
import MailPage from 'lb308/components/MailPage';

/**
 * The `routes` initializer defines the admin app's routes.
 *
 * @param {App} app
 */
export default function(app) {
  app.routes = {
    'dashboard': {path: '/', component: DashboardPage.component()},
    'basics': {path: '/basics', component: BasicsPage.component()},
    'permissions': {path: '/permissions', component: PermissionsPage.component()},
    'appearance': {path: '/appearance', component: AppearancePage.component()},
    'extensions': {path: '/extensions', component: ExtensionsPage.component()},
    'mail': {path: '/mail', component: MailPage.component()}
  };
}
