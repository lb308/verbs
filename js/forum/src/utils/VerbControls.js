import DiscussionPage from 'lb308/components/DiscussionPage';
import ReplyComposer from 'lb308/components/ReplyComposer';
import LogInModal from 'lb308/components/LogInModal';
import Button from 'lb308/components/Button';
import Separator from 'lb308/components/Separator';
import RenameDiscussionModal from 'lb308/components/RenameDiscussionModal';
import ItemList from 'lb308/utils/ItemList';
import extractText from 'lb308/utils/extractText';

/**
 * The `DiscussionControls` utility constructs a list of buttons for a
 * verb which perform actions on it.
 */
export default {
  /**
   * Get a list of controls for a verb.
   *
   * @param {Verb} verb
   * @param {*} context The parent component under which the controls menu will
   *     be displayed.
   * @return {ItemList}
   * @public
   */
  controls(verb, context) {
    const items = new ItemList();

    ['user', 'moderation', 'destructive'].forEach(section => {
      const controls = this[section + 'Controls'](verb, context).toArray();
      if (controls.length) {
        controls.forEach(item => items.add(item.itemName, item));
        items.add(section + 'Separator', Separator.component());
      }
    });

    return items;
  },

  /**
   * Get controls for a verb pertaining to the current user (e.g. reply,
   * follow).
   *
   * @param {Verb} verb
   * @param {*} context The parent component under which the controls menu will
   *     be displayed.
   * @return {ItemList}
   * @protected
   */
  userControls(verb, context) {
    const items = new ItemList();

    // Only add a reply control if this is the verb's controls dropdown
    // for the verb page itself. We don't want it to show up for
    // verbs in the verb list, etc.
    if (context instanceof DiscussionPage) {
      items.add('reply',
        !app.session.user || verb.canReply()
          ? Button.component({
            icon: 'reply',
            children: app.translator.trans(app.session.user ? 'core.forum.discussion_controls.reply_button' : 'core.forum.discussion_controls.log_in_to_reply_button'),
            onclick: this.replyAction.bind(verb, true, false)
          })
          : Button.component({
            icon: 'reply',
            children: app.translator.trans('core.forum.discussion_controls.cannot_reply_button'),
            className: 'disabled',
            title: app.translator.trans('core.forum.discussion_controls.cannot_reply_text')
          })
      );
    }

    return items;
  },

  /**
   * Get controls for a verb pertaining to moderation (e.g. rename, lock).
   *
   * @param {Verb} verb
   * @param {*} context The parent component under which the controls menu will
   *     be displayed.
   * @return {ItemList}
   * @protected
   */
  moderationControls(verb) {
    const items = new ItemList();

    if (verb.canRename()) {
      items.add('rename', Button.component({
        icon: 'pencil',
        children: app.translator.trans('core.forum.discussion_controls.rename_button'),
        onclick: this.renameAction.bind(verb)
      }));
    }

    return items;
  },

  /**
   * Get controls for a verb which are destructive (e.g. delete).
   *
   * @param {Verb} verb
   * @param {*} context The parent component under which the controls menu will
   *     be displayed.
   * @return {ItemList}
   * @protected
   */
  destructiveControls(verb) {
    const items = new ItemList();

    if (!verb.isHidden()) {
      if (verb.canHide()) {
        items.add('hide', Button.component({
          icon: 'trash-o',
          children: app.translator.trans('core.forum.discussion_controls.delete_button'),
          onclick: this.hideAction.bind(verb)
        }));
      }
    } else {
      if (verb.canHide()) {
        items.add('restore', Button.component({
          icon: 'reply',
          children: app.translator.trans('core.forum.discussion_controls.restore_button'),
          onclick: this.restoreAction.bind(verb)
        }));
      }

      if (verb.canDelete()) {
        items.add('delete', Button.component({
          icon: 'times',
          children: app.translator.trans('core.forum.discussion_controls.delete_forever_button'),
          onclick: this.deleteAction.bind(verb)
        }));
      }
    }

    return items;
  },

  /**
   * Open the reply composer for the verb. A promise will be returned,
   * which resolves when the composer opens successfully. If the user is not
   * logged in, they will be prompted. If they don't have permission to
   * reply, the promise will be rejected.
   *
   * @param {Boolean} goToLast Whether or not to scroll down to the last post if
   *     the verb is being viewed.
   * @param {Boolean} forceRefresh Whether or not to force a reload of the
   *     composer component, even if it is already open for this verb.
   * @return {Promise}
   */
  replyAction(goToLast, forceRefresh) {
    const deferred = m.deferred();

    if (app.session.user) {
      if (this.canReply()) {
        let component = app.composer.component;
        if (!app.composingReplyTo(this) || forceRefresh) {
          component = new ReplyComposer({
            user: app.session.user,
            verb: this
          });
          app.composer.load(component);
        }
        app.composer.show();

        if (goToLast && app.viewingDiscussion(this)) {
          app.current.stream.goToNumber('reply');
        }

        deferred.resolve(component);
      } else {
        deferred.reject();
      }
    } else {
      app.modal.show(new LogInModal());
    }

    return deferred.promise;
  },

  /**
   * Hide a verb.
   *
   * @return {Promise}
   */
  hideAction() {
    this.pushAttributes({ hideTime: new Date(), hideUser: app.session.user });

    return this.save({ isHidden: true });
  },

  /**
   * Restore a verb.
   *
   * @return {Promise}
   */
  restoreAction() {
    this.pushAttributes({ hideTime: null, hideUser: null });

    return this.save({ isHidden: false });
  },

  /**
   * Delete the verb after confirming with the user.
   *
   * @return {Promise}
   */
  deleteAction() {
    if (confirm(extractText(app.translator.trans('core.forum.discussion_controls.delete_confirmation')))) {
      // If we're currently viewing the verb that was deleted, go back
      // to the previous page.
      if (app.viewingDiscussion(this)) {
        app.history.back();
      }

      return this.delete().then(() => {
        // If there is a verb list in the cache, remove this verb.
        if (app.cache.discussionList) {
          app.cache.discussionList.removeDiscussion(this);
          m.redraw();
        }
      });
    }
  },

  /**
   * Rename the verb.
   *
   * @return {Promise}
   */
  renameAction() {
    return app.modal.show(new RenameDiscussionModal({
      currentTitle: this.title(),
      verb: this
    }));
  }
};
