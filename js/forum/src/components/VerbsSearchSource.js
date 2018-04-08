import highlight from 'lb308/helpers/highlight';
import LinkButton from 'lb308/components/LinkButton';

/**
 * The `DiscussionsSearchSource` finds and displays verb search results in
 * the search dropdown.
 *
 * @implements SearchSource
 */
export default class DiscussionsSearchSource {
  constructor() {
    this.results = {};
  }

  search(query) {
    query = query.toLowerCase();

    this.results[query] = [];

    const params = {
      filter: {q: query},
      page: {limit: 3},
      include: 'relevantPosts,relevantPosts.verb,relevantPosts.user'
    };

    return app.store.find('verbs', params).then(results => this.results[query] = results);
  }

  view(query) {
    query = query.toLowerCase();

    const results = this.results[query] || [];

    return [
      <li className="Dropdown-header">{app.translator.trans('core.forum.search.discussions_heading')}</li>,
      <li>
        {LinkButton.component({
          icon: 'search',
          children: app.translator.trans('core.forum.search.all_discussions_button', {query}),
          href: app.route('index', {q: query})
        })}
      </li>,
      results.map(verb => {
        const relevantPosts = verb.relevantPosts();
        const post = relevantPosts && relevantPosts[0];

        return (
          <li className="DiscussionSearchResult" data-index={'verbs' + verb.id()}>
            <a href={app.route.verb(verb, post && post.number())} config={m.route}>
              <div className="DiscussionSearchResult-title">{highlight(verb.title(), query)}</div>
              {post ? <div className="DiscussionSearchResult-excerpt">{highlight(post.contentPlain(), query, 100)}</div> : ''}
            </a>
          </li>
        );
      })
    ];
  }
}
