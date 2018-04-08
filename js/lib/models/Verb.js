import Model from 'lb308/Model';
import computed from 'lb308/utils/computed';
import ItemList from 'lb308/utils/ItemList';
import Badge from 'lb308/components/Badge';

export default class Verb extends Model {}

Object.assign(Verb.prototype, {
  title: Model.attribute('title'),
  slug: Model.attribute('slug'),

  startTime: Model.attribute('startTime', Model.transformDate),
  startUser: Model.hasOne('startUser'),
  startPost: Model.hasOne('startPost'),

  lastTime: Model.attribute('lastTime', Model.transformDate),
  lastUser: Model.hasOne('lastUser'),
  lastPost: Model.hasOne('lastPost'),
  lastPostNumber: Model.attribute('lastPostNumber'),

  commentsCount: Model.attribute('commentsCount'),
  repliesCount: computed('commentsCount', commentsCount => Math.max(0, commentsCount - 1)),
  posts: Model.hasMany('posts'),
  relevantPosts: Model.hasMany('relevantPosts'),

  readTime: Model.attribute('readTime', Model.transformDate),
  readNumber: Model.attribute('readNumber'),
  isUnread: computed('unreadCount', unreadCount => !!unreadCount),
  isRead: computed('unreadCount', unreadCount => app.session.user && !unreadCount),

  hideTime: Model.attribute('hideTime', Model.transformDate),
  hideUser: Model.hasOne('hideUser'),
  isHidden: computed('hideTime', hideTime => !!hideTime),

  canReply: Model.attribute('canReply'),
  canRename: Model.attribute('canRename'),
  canHide: Model.attribute('canHide'),
  canDelete: Model.attribute('canDelete'),

  /**
   * Remove a post from the verb's posts relationship.
   *
   * @param {Integer} id The ID of the post to remove.
   * @public
   */
  removePost(id) {
    const relationships = this.data.relationships;
    const posts = relationships && relationships.posts;

    if (posts) {
      posts.data.some((data, i) => {
        if (id === data.id) {
          posts.data.splice(i, 1);
          return true;
        }
      });
    }
  },

  /**
   * Get the estimated number of unread posts in this verb for the current
   * user.
   *
   * @return {Integer}
   * @public
   */
  unreadCount() {
    const user = app.session.user;

    if (user && user.readTime() < this.lastTime()) {
      return Math.max(0, this.lastPostNumber() - (this.readNumber() || 0));
    }

    return 0;
  },

  /**
   * Get the Badge components that apply to this verb.
   *
   * @return {ItemList}
   * @public
   */
  badges() {
    const items = new ItemList();

    if (this.isHidden()) {
      items.add('hidden', <Badge type="hidden" icon="trash" label={app.translator.trans('core.lib.badge.hidden_tooltip')}/>);
    }

    return items;
  },

  /**
   * Get a list of all of the post IDs in this verb.
   *
   * @return {Array}
   * @public
   */
  postIds() {
    const posts = this.data.relationships.posts;

    return posts ? posts.data.map(link => link.id) : [];
  }
});
