import Model from 'lb308/Model';
import computed from 'lb308/utils/computed';

export default class Notification extends Model {}

Object.assign(Notification.prototype, {
  contentType: Model.attribute('contentType'),
  subjectId: Model.attribute('subjectId'),
  content: Model.attribute('content'),
  time: Model.attribute('time', Model.date),

  isRead: Model.attribute('isRead'),
  unreadCount: Model.attribute('unreadCount'),
  additionalUnreadCount: computed('unreadCount', unreadCount => Math.max(0, unreadCount - 1)),

  user: Model.hasOne('user'),
  sender: Model.hasOne('sender'),
  subject: Model.hasOne('subject')
});
