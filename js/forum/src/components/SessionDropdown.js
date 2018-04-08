import avatar from 'lb308/helpers/avatar';
import username from 'lb308/helpers/username';
import Dropdown from 'lb308/components/Dropdown';
import LinkButton from 'lb308/components/LinkButton';
import Button from 'lb308/components/Button';
import ItemList from 'lb308/utils/ItemList';
import Separator from 'lb308/components/Separator';
import Group from 'lb308/models/Group';

/**
 * The `SessionDropdown` component shows a button with the current user's
 * avatar/name, with a dropdown of session controls.
 */
export default class SessionDropdown extends Dropdown {
  static initProps(props) {
    super.initProps(props);

    props.className = 'SessionDropdown';
    props.buttonClassName = 'Button Button--user Button--flat';
    props.menuClassName = 'Dropdown-menu--right';
  }

  view() {
    this.props.children = this.items().toArray();

    return super.view();
  }

  getButtonContent() {
    const user = app.session.user;

    return [
      avatar(user), ' ',
      <span className="Button-label">{username(user)}</span>
    ];
  }

  /**
   * Build an item list for the contents of the dropdown menu.
   *
   * @return {ItemList}
   */
  items() {
    const items = new ItemList();
    const user = app.session.user;

    items.add('profile',
      LinkButton.component({
        icon: 'user',
        children: app.translator.trans('core.forum.header.profile_button'),
        href: app.route.user(user)
      }),
      100
    );

    items.add('settings',
      LinkButton.component({
        icon: 'cog',
        children: app.translator.trans('core.forum.header.settings_button'),
        href: app.route('settings')
      }),
      50
    );

    if (user.groups().some(group => group.id() === Group.ADMINISTRATOR_ID)) {
      items.add('administration',
        LinkButton.component({
          icon: 'wrench',
          children: app.translator.trans('core.forum.header.admin_button'),
          href: app.forum.attribute('baseUrl') + '/admin',
          target: '_blank',
          config: () => {}
        }),
        0
      );
    }

    items.add('separator', Separator.component(), -90);

    items.add('logOut',
      Button.component({
        icon: 'sign-out',
        children: app.translator.trans('core.forum.header.log_out_button'),
        onclick: app.session.logout.bind(app.session)
      }),
      -100
    );

    return items;
  }
}
