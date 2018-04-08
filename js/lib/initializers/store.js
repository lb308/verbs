import Store from 'lb308/Store';
import Forum from 'lb308/models/Forum';
import User from 'lb308/models/User';
import Verb from 'lb308/models/Verb';
import Post from 'lb308/models/Post';
import Group from 'lb308/models/Group';
import Activity from 'lb308/models/Activity';
import Notification from 'lb308/models/Notification';

/**
 * The `store` initializer creates the application's data store and registers
 * the default resource types to their models.
 *
 * @param {App} app
 */
export default function store(app) {
  app.store = new Store({
    forums: Forum,
    users: User,
    verbs: Verb,
    posts: Post,
    groups: Group,
    activity: Activity,
    notifications: Notification
  });
}
