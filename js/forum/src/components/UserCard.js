import Component from 'lb308/Component';
import humanTime from 'lb308/utils/humanTime';
import ItemList from 'lb308/utils/ItemList';
import UserControls from 'lb308/utils/UserControls';
import avatar from 'lb308/helpers/avatar';
import username from 'lb308/helpers/username';
import icon from 'lb308/helpers/icon';
import Dropdown from 'lb308/components/Dropdown';
import UserBio from 'lb308/components/UserBio';
import AvatarEditor from 'lb308/components/AvatarEditor';
import listItems from 'lb308/helpers/listItems';

/**
 * The `UserCard` component displays a user's profile card. This is used both on
 * the `UserPage` (in the hero) and in verbs, shown when hovering over a
 * post author.
 *
 * ### Props
 *
 * - `user`
 * - `className`
 * - `editable`
 * - `controlsButtonClassName`
 */
export default class UserCard extends Component {
  view() {
    const user = this.props.user;
    const controls = UserControls.controls(user, this).toArray();
    const color = user.color();
    const badges = user.badges().toArray();

    return (
      <div className={'UserCard ' + (this.props.className || '')}
        style={color ? {backgroundColor: color} : ''}>
        <div className="darkenBackground">

          <div className="container">
            {controls.length ? Dropdown.component({
              children: controls,
              className: 'UserCard-controls App-primaryControl',
              menuClassName: 'Dropdown-menu--right',
              buttonClassName: this.props.controlsButtonClassName,
              label: app.translator.trans('core.forum.user_controls.button'),
              icon: 'ellipsis-v'
            }) : ''}

            <div className="UserCard-profile">
              <h2 className="UserCard-identity">
                {this.props.editable
                  ? [AvatarEditor.component({user, className: 'UserCard-avatar'}), username(user)]
                  : (
                    <a href={app.route.user(user)} config={m.route}>
                      <div className="UserCard-avatar">{avatar(user)}</div>
                      {username(user)}
                    </a>
                  )}
              </h2>

              {badges.length ? (
                <ul className="UserCard-badges badges">
                  {listItems(badges)}
                </ul>
              ) : ''}

              <ul className="UserCard-info">
                {listItems(this.infoItems().toArray())}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /**
   * Build an item list of tidbits of info to show on this user's profile.
   *
   * @return {ItemList}
   */
  infoItems() {
    const items = new ItemList();
    const user = this.props.user;
    const lastSeenTime = user.lastSeenTime();

    items.add('bio',
      UserBio.component({
        user,
        editable: this.props.editable
      })
    );

    if (lastSeenTime) {
      const online = user.isOnline();

      items.add('lastSeen', (
        <span className={'UserCard-lastSeen' + (online ? ' online' : '')}>
          {online
            ? [icon('circle'), ' ', app.translator.trans('core.forum.user.online_text')]
            : [icon('clock-o'), ' ', humanTime(lastSeenTime)]}
        </span>
      ));
    }

    items.add('joined', app.translator.trans('core.forum.user.joined_date_text', {ago: humanTime(user.joinTime())}));

    return items;
  }
}
