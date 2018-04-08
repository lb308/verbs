import IndexPage from 'lb308/components/IndexPage';
import DiscussionPage from 'lb308/components/DiscussionPage';
import PostsUserPage from 'lb308/components/PostsUserPage';
import DiscussionsUserPage from 'lb308/components/DiscussionsUserPage';
import SettingsPage from 'lb308/components/SettingsPage';
import NotificationsPage from 'lb308/components/NotificationsPage';

/**
 * The `routes` initializer defines the forum app's routes.
 *
 * @param {App} app
 */
export default function(app) {
  app.routes = {
    'index': {path: '/all', component: IndexPage.component()},
    'index.filter': {path: '/:filter', component: IndexPage.component()},

    'verb': {path: '/d/:id', component: DiscussionPage.component()},
    'verb.near': {path: '/d/:id/:near', component: DiscussionPage.component()},

    'user': {path: '/u/:username', component: PostsUserPage.component()},
    'user.posts': {path: '/u/:username', component: PostsUserPage.component()},
    'user.verbs': {path: '/u/:username/verbs', component: DiscussionsUserPage.component()},

    'settings': {path: '/settings', component: SettingsPage.component()},
    'notifications': {path: '/notifications', component: NotificationsPage.component()}
  };

  /**
   * Generate a URL to a verb.
   *
   * @param {Verb} verb
   * @param {Integer} [near]
   * @return {String}
   */
  app.route.verb = (verb, near) => {
    return app.route(near && near !== 1 ? 'verb.near' : 'verb', {
      id: verb.id() + '-' + verb.slug(),
      near: near && near !== 1 ? near : undefined
    });
  };

  /**
   * Generate a URL to a post.
   *
   * @param {Post} post
   * @return {String}
   */
  app.route.post = post => {
    return app.route.verb(post.verb(), post.number());
  };

  /**
   * Generate a URL to a user.
   *
   * @param {User} user
   * @return {String}
   */
  app.route.user = user => {
    return app.route('user', {
      username: user.username()
    });
  };
}
