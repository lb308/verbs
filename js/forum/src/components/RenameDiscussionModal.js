import Modal from 'lb308/components/Modal';
import Button from 'lb308/components/Button';

/**
 * The 'RenameDiscussionModal' displays a modal dialog with an input to rename a verb
 */
export default class RenameDiscussionModal extends Modal {
  init() {
    super.init();

    this.verb = this.props.verb;
    this.currentTitle = this.props.currentTitle;
    this.newTitle = m.prop(this.currentTitle);
  }

  className() {
    return 'RenameDiscussionModal Modal--small';
  }

  title() {
    return app.translator.trans('core.forum.rename_discussion.title');
  }

  content() {
    return (
      <div className="Modal-body">
        <div className="Form Form--centered">
          <div className="Form-group">
            <input className="FormControl" bidi={this.newTitle} type="text" />
          </div>
          <div className="Form-group">
            {Button.component({
              className: 'Button Button--primary Button--block',
              type: 'submit',
              loading: this.loading,
              children: app.translator.trans('core.forum.rename_discussion.submit_button')
            })}
          </div>
        </div>
      </div>
    )
  }

  onsubmit(e) {
    e.preventDefault();

    this.loading = true;

    const title = this.newTitle;
    const currentTitle = this.currentTitle;

    // If the title is different to what it was before, then save it. After the
    // save has completed, update the post stream as there will be a new post
    // indicating that the verb was renamed.
    if (title && title !== currentTitle) {
      return this.verb.save({title}).then(() => {
        if (app.viewingDiscussion(this.verb)) {
          app.current.stream.update();
        }
        m.redraw();
        this.hide();
      }).catch(() => {
        this.loading = false;
        m.redraw();
      });
    } else {
      this.hide();
    }
  }
}
