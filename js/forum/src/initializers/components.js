import CommentPost from 'lb308/components/CommentPost';
import DiscussionRenamedPost from 'lb308/components/DiscussionRenamedPost';
import DiscussionRenamedNotification from 'lb308/components/DiscussionRenamedNotification';

/**
 * The `components` initializer registers components to display the default post
 * types, activity types, and notifications type with the application.
 *
 * @param {ForumApp} app
 */
export default function components(app) {
  app.postComponents.comment = CommentPost;
  app.postComponents.discussionRenamed = DiscussionRenamedPost;

  app.notificationComponents.discussionRenamed = DiscussionRenamedNotification;
}
