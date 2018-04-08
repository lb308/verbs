import avatar from 'lb308/helpers/avatar';
import username from 'lb308/helpers/username';
import Dropdown from 'lb308/components/Dropdown';
import Button from 'lb308/components/Button';
import ItemList from 'lb308/utils/ItemList';

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

    items.add('logOut',
      Button.component({
        icon: 'sign-out',
        children: app.translator.trans('core.admin.header.log_out_button'),
        onclick: app.session.logout.bind(app.session)
      }),
      -100
    );

    return items;
  }
}
