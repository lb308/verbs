import Component from 'lb308/Component';
import avatar from 'lb308/helpers/avatar';
import username from 'lb308/helpers/username';
import highlight from 'lb308/helpers/highlight';

/**
 * The `PostPreview` component shows a link to a post containing the avatar and
 * username of the author, and a short excerpt of the post's content.
 *
 * ### Props
 *
 * - `post`
 */
export default class PostPreview extends Component {
  view() {
    const post = this.props.post;
    const user = post.user();
    const excerpt = highlight(post.contentPlain(), this.props.highlight, 300);

    return (
      <a className="PostPreview" href={app.route.post(post)} config={m.route} onclick={this.props.onclick}>
        <span className="PostPreview-content">
          {avatar(user)}
          {username(user)}{' '}
          <span className="PostPreview-excerpt">{excerpt}</span>
        </span>
      </a>
    );
  }
}
