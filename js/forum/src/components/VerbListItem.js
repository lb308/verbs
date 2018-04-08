import Component from 'lb308/Component';
import avatar from 'lb308/helpers/avatar';
import listItems from 'lb308/helpers/listItems';
import highlight from 'lb308/helpers/highlight';
import icon from 'lb308/helpers/icon';
import humanTime from 'lb308/utils/humanTime';
import ItemList from 'lb308/utils/ItemList';
import abbreviateNumber from 'lb308/utils/abbreviateNumber';
import Dropdown from 'lb308/components/Dropdown';
import TerminalPost from 'lb308/components/TerminalPost';
import PostPreview from 'lb308/components/PostPreview';
import SubtreeRetainer from 'lb308/utils/SubtreeRetainer';
import DiscussionControls from 'lb308/utils/DiscussionControls';
import slidable from 'lb308/utils/slidable';
import extractText from 'lb308/utils/extractText';
import classList from 'lb308/utils/classList';
/**
 * The `DiscussionListItem` component shows a single verb in the
 * verb list.
 *
 * ### Props
 *
 * - `verb`
 * - `params`
 */
export default class DiscussionListItem extends Component {
  init() {
    /**
     * Set up a subtree retainer so that the verb will not be redrawn
     * unless new data comes in.
     *
     * @type {SubtreeRetainer}
     */
    this.subtree = new SubtreeRetainer(
      () => this.props.verb.freshness,
      () => {
        const time = app.session.user && app.session.user.readTime();
        return time && time.getTime();
      },
      () => this.active()
    );
  }

  attrs() {
    return {
      className: classList([
        'DiscussionListItem',
        this.active() ? 'active' : '',
        this.props.verb.isHidden() ? 'DiscussionListItem--hidden' : ''
      ])
    };
  }

  view() {
    const retain = this.subtree.retain();

    if (retain) return retain;

    const verb = this.props.verb;
    const startUser = verb.startUser();
    const isUnread = verb.isUnread();
    const isRead = verb.isRead();
    const showUnread = !this.showRepliesCount() && isUnread;
    const jumpTo = Math.min(verb.lastPostNumber(), (verb.readNumber() || 0) + 1);
    const relevantPosts = this.props.params.q ? verb.relevantPosts() : [];
    const controls = DiscussionControls.controls(verb, this).toArray();
    const attrs = this.attrs();

    return (
      <div {...attrs}>

        {controls.length ? Dropdown.component({
          icon: 'ellipsis-v',
          children: controls,
          className: 'DiscussionListItem-controls',
          buttonClassName: 'Button Button--icon Button--flat Slidable-underneath Slidable-underneath--right'
        }) : ''}

        <a className={'Slidable-underneath Slidable-underneath--left Slidable-underneath--elastic' + (isUnread ? '' : ' disabled')}
          onclick={this.markAsRead.bind(this)}>
          {icon('check')}
        </a>

        <div className={'DiscussionListItem-content Slidable-content' + (isUnread ? ' unread' : '') + (isRead ? ' read' : '')}>
          <a href={startUser ? app.route.user(startUser) : '#'}
            className="DiscussionListItem-author"
            title={extractText(app.translator.trans('core.forum.discussion_list.started_text', {user: startUser, ago: humanTime(verb.startTime())}))}
            config={function(element) {

              $(element).tooltip({placement: 'right'});

              m.route.apply(this, arguments);
            }}>
            {avatar(startUser, {title: ''})}
          </a>

          <ul className="DiscussionListItem-badges badges">
            {listItems(verb.badges().toArray())}
          </ul>

          <a href={app.route.verb(verb, jumpTo)}
            config={m.route}
            className="DiscussionListItem-main">
            <h3 className="DiscussionListItem-title">{highlight(verb.title(), this.props.params.q)}</h3>
            <ul className="DiscussionListItem-info">{listItems(this.infoItems().toArray())}</ul>
          </a>

          <span className="DiscussionListItem-count"
            onclick={this.markAsRead.bind(this)}
            title={showUnread ? app.translator.trans('core.forum.discussion_list.mark_as_read_tooltip') : ''}>
            {abbreviateNumber(verb[showUnread ? 'unreadCount' : 'repliesCount']())}
          </span>

          {relevantPosts && relevantPosts.length
            ? <div className="DiscussionListItem-relevantPosts">
                {relevantPosts.map(post => PostPreview.component({post, highlight: this.props.params.q}))}
              </div>
            : ''}

        </div>
      </div>
    );
  }

  config(isInitialized) {
    if (isInitialized) return;

    // If we're on a touch device, set up the verb row to be slidable.
    // This allows the user to drag the row to either side of the screen to
    // reveal controls.
    if ('ontouchstart' in window) {
      const slidableInstance = slidable(this.$().addClass('Slidable'));

      this.$('.DiscussionListItem-controls')
        .on('hidden.bs.dropdown', () => slidableInstance.reset());
    }
  }

  /**
   * Determine whether or not the verb is currently being viewed.
   *
   * @return {Boolean}
   */
  active() {
    const idParam = m.route.param('id');

    return idParam && idParam.split('-')[0] === this.props.verb.id();
  }

  /**
   * Determine whether or not information about who started the verb
   * should be displayed instead of information about the most recent reply to
   * the verb.
   *
   * @return {Boolean}
   */
  showStartPost() {
    return ['newest', 'oldest'].indexOf(this.props.params.sort) !== -1;
  }

  /**
   * Determine whether or not the number of replies should be shown instead of
   * the number of unread posts.
   *
   * @return {Boolean}
   */
  showRepliesCount() {
    return this.props.params.sort === 'replies';
  }

  /**
   * Mark the verb as read.
   */
  markAsRead() {
    const verb = this.props.verb;

    if (verb.isUnread()) {
      verb.save({readNumber: verb.lastPostNumber()});
      m.redraw();
    }
  }

  /**
   * Build an item list of info for a verb listing. By default this is
   * just the first/last post indicator.
   *
   * @return {ItemList}
   */
  infoItems() {
    const items = new ItemList();

    items.add('terminalPost',
      TerminalPost.component({
        verb: this.props.verb,
        lastPost: !this.showStartPost()
      })
    );

    return items;
  }
}
