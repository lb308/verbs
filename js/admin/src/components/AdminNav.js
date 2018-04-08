/*
 * This file is part of Flarum.
 *
 * (c) Toby Zerner <toby.zerner@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Component from 'lb308/Component';
import AdminLinkButton from 'lb308/components/AdminLinkButton';
import SelectDropdown from 'lb308/components/SelectDropdown';

import ItemList from 'lb308/utils/ItemList';

export default class AdminNav extends Component {
  view() {
    return (
      <SelectDropdown
        className="AdminNav App-titleControl"
        buttonClassName="Button"
        children={this.items().toArray()}
        />
    );
  }

  /**
   * Build an item list of links to show in the admin navigation.
   *
   * @return {ItemList}
   */
  items() {
    const items = new ItemList();

    items.add('dashboard', AdminLinkButton.component({
      href: app.route('dashboard'),
      icon: 'bar-chart',
      children: app.translator.trans('core.admin.nav.dashboard_button'),
      description: app.translator.trans('core.admin.nav.dashboard_text')
    }));

    items.add('basics', AdminLinkButton.component({
      href: app.route('basics'),
      icon: 'pencil',
      children: app.translator.trans('core.admin.nav.basics_button'),
      description: app.translator.trans('core.admin.nav.basics_text')
    }));

    items.add('mail', AdminLinkButton.component({
      href: app.route('mail'),
      icon: 'envelope',
      children: app.translator.trans('core.admin.nav.email_button'),
      description: app.translator.trans('core.admin.nav.email_text')
    }));

    items.add('permissions', AdminLinkButton.component({
      href: app.route('permissions'),
      icon: 'key',
      children: app.translator.trans('core.admin.nav.permissions_button'),
      description: app.translator.trans('core.admin.nav.permissions_text')
    }));

    items.add('appearance', AdminLinkButton.component({
      href: app.route('appearance'),
      icon: 'paint-brush',
      children: app.translator.trans('core.admin.nav.appearance_button'),
      description: app.translator.trans('core.admin.nav.appearance_text')
    }));

    items.add('extensions', AdminLinkButton.component({
      href: app.route('extensions'),
      icon: 'puzzle-piece',
      children: app.translator.trans('core.admin.nav.extensions_button'),
      description: app.translator.trans('core.admin.nav.extensions_text')
    }));

    return items;
  }
}
