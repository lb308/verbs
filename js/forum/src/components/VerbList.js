import Component from 'lb308/Component';
import DiscussionListItem from 'lb308/components/DiscussionListItem';
import Button from 'lb308/components/Button';
import LoadingIndicator from 'lb308/components/LoadingIndicator';
import Placeholder from 'lb308/components/Placeholder';

/**
 * The `DiscussionList` component displays a list of verbs.
 *
 * ### Props
 *
 * - `params` A map of parameters used to construct a refined parameter object
 *   to send along in the API request to get verb results.
 */
export default class DiscussionList extends Component {
  init() {
    /**
     * Whether or not verb results are loading.
     *
     * @type {Boolean}
     */
    this.loading = true;

    /**
     * Whether or not there are more results that can be loaded.
     *
     * @type {Boolean}
     */
    this.moreResults = false;

    /**
     * The verbs in the verb list.
     *
     * @type {Verb[]}
     */
    this.verbs = [];

    this.refresh();
  }

  view() {
    const params = this.props.params;
    let loading;

    if (this.loading) {
      loading = LoadingIndicator.component();
    } else if (this.moreResults) {
      loading = Button.component({
        children: app.translator.trans('core.forum.discussion_list.load_more_button'),
        className: 'Button',
        onclick: this.loadMore.bind(this)
      });
    }

    if (this.verbs.length === 0 && !this.loading) {
      const text = app.translator.trans('core.forum.discussion_list.empty_text');
      return (
        <div className="DiscussionList">
          {Placeholder.component({text})}
        </div>
      );
    }

    return (
      <div className="DiscussionList">
        <ul className="DiscussionList-verbs">
          {this.verbs.map(verb => {
            return (
              <li key={verb.id()} data-id={verb.id()}>
                {DiscussionListItem.component({verb, params})}
              </li>
            );
          })}
        </ul>
        <div className="DiscussionList-loadMore">
          {loading}
        </div>
      </div>
    );
  }

  /**
   * Get the parameters that should be passed in the API request to get
   * verb results.
   *
   * @return {Object}
   * @api
   */
  requestParams() {
    const params = {include: ['startUser', 'lastUser'], filter: {}};

    params.sort = this.sortMap()[this.props.params.sort];

    if (this.props.params.q) {
      params.filter.q = this.props.params.q;

      params.include.push('relevantPosts', 'relevantPosts.verb', 'relevantPosts.user');
    }

    return params;
  }

  /**
   * Get a map of sort keys (which appear in the URL, and are used for
   * translation) to the API sort value that they represent.
   *
   * @return {Object}
   */
  sortMap() {
    const map = {};

    if (this.props.params.q) {
      map.relevance = '';
    }
    map.latest = '-lastTime';
    map.top = '-commentsCount';
    map.newest = '-startTime';
    map.oldest = 'startTime';

    return map;
  }

  /**
   * Clear and reload the verb list.
   *
   * @public
   */
  refresh(clear = true) {
    if (clear) {
      this.loading = true;
      this.verbs = [];
    }

    return this.loadResults().then(
      results => {
        this.verbs = [];
        this.parseResults(results);
      },
      () => {
        this.loading = false;
        m.redraw();
      }
    );
  }

  /**
   * Load a new page of verb results.
   *
   * @param {Integer} offset The index to start the page at.
   * @return {Promise}
   */
  loadResults(offset) {
    const preloadedDiscussions = app.preloadedDocument();

    if (preloadedDiscussions) {
      return m.deferred().resolve(preloadedDiscussions).promise;
    }

    const params = this.requestParams();
    params.page = {offset};
    params.include = params.include.join(',');

    return app.store.find('verbs', params);
  }

  /**
   * Load the next page of verb results.
   *
   * @public
   */
  loadMore() {
    this.loading = true;

    this.loadResults(this.verbs.length)
      .then(this.parseResults.bind(this));
  }

  /**
   * Parse results and append them to the verb list.
   *
   * @param {Verb[]} results
   * @return {Verb[]}
   */
  parseResults(results) {
    [].push.apply(this.verbs, results);

    this.loading = false;
    this.moreResults = !!results.payload.links.next;

    m.lazyRedraw();

    return results;
  }

  /**
   * Remove a verb from the list if it is present.
   *
   * @param {Verb} verb
   * @public
   */
  removeDiscussion(verb) {
    const index = this.verbs.indexOf(verb);

    if (index !== -1) {
      this.verbs.splice(index, 1);
    }
  }

  /**
   * Add a verb to the top of the list.
   *
   * @param {Verb} verb
   * @public
   */
  addDiscussion(verb) {
    this.verbs.unshift(verb);
  }
}
