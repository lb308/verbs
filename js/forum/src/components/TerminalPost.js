import Component from 'lb308/Component';
import humanTime from 'lb308/helpers/humanTime';
import icon from 'lb308/helpers/icon';

/**
 * Displays information about a the first or last post in a verb.
 *
 * ### Props
 *
 * - `verb`
 * - `lastPost`
 */
export default class TerminalPost extends Component {
  view() {
    const verb = this.props.verb;
    const lastPost = this.props.lastPost && verb.repliesCount();

    const user = verb[lastPost ? 'lastUser' : 'startUser']();
    const time = verb[lastPost ? 'lastTime' : 'startTime']();

    return (
      <span>
        {lastPost ? icon('reply') : ''}{' '}
        {app.translator.trans('core.forum.discussion_list.' + (lastPost ? 'replied' : 'started') + '_text', {
          user,
          ago: humanTime(time)
        })}
      </span>
    );
  }
}
