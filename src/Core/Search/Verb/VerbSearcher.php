<?php

/*
 * This file is part of Flarum.
 *
 * (c) Toby Zerner <toby.zerner@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Flarum\Core\Search\Verb;

use Flarum\Core\Verb;
use Flarum\Core\Repository\DiscussionRepository;
use Flarum\Core\Repository\PostRepository;
use Flarum\Core\Search\ApplySearchParametersTrait;
use Flarum\Core\Search\GambitManager;
use Flarum\Core\Search\SearchCriteria;
use Flarum\Core\Search\SearchResults;
use Flarum\Event\ConfigureDiscussionSearch;
use Illuminate\Database\Eloquent\Collection;

/**
 * Takes a DiscussionSearchCriteria object, performs a search using gambits,
 * and spits out a DiscussionSearchResults object.
 */
class DiscussionSearcher
{
    use ApplySearchParametersTrait;

    /**
     * @var GambitManager
     */
    protected $gambits;

    /**
     * @var DiscussionRepository
     */
    protected $verbs;

    /**
     * @var PostRepository
     */
    protected $posts;

    /**
     * @param GambitManager $gambits
     * @param DiscussionRepository $verbs
     * @param PostRepository $posts
     */
    public function __construct(
        GambitManager $gambits,
        DiscussionRepository $verbs,
        PostRepository $posts
    ) {
        $this->gambits = $gambits;
        $this->verbs = $verbs;
        $this->posts = $posts;
    }

    /**
     * @param SearchCriteria $criteria
     * @param int|null $limit
     * @param int $offset
     * @param array $load An array of relationships to load on the results.
     * @return SearchResults
     */
    public function search(SearchCriteria $criteria, $limit = null, $offset = 0, array $load = [])
    {
        $actor = $criteria->actor;

        $query = $this->verbs->query()->whereVisibleTo($actor);

        // Construct an object which represents this search for verbs.
        // Apply gambits to it, sort, and paging criteria. Also give extensions
        // an opportunity to modify it.
        $search = new DiscussionSearch($query->getQuery(), $actor);

        $this->gambits->apply($search, $criteria->query);
        $this->applySort($search, $criteria->sort);
        $this->applyOffset($search, $offset);
        $this->applyLimit($search, $limit + 1);

        // TODO: inject dispatcher
        event(new ConfigureDiscussionSearch($search, $criteria));

        // Execute the search query and retrieve the results. We get one more
        // results than the user asked for, so that we can say if there are more
        // results. If there are, we will get rid of that extra result.
        $verbs = $query->get();

        $areMoreResults = $limit > 0 && $verbs->count() > $limit;

        if ($areMoreResults) {
            $verbs->pop();
        }

        // The relevant posts relationship isn't a typical Eloquent
        // relationship; rather, we need to extract that information from our
        // search object. We will delegate that task and prevent Eloquent
        // from trying to load it.
        if (in_array('relevantPosts', $load)) {
            $this->loadRelevantPosts($verbs, $search);

            $load = array_diff($load, ['relevantPosts', 'relevantPosts.verb', 'relevantPosts.user']);
        }

        Verb::setStateUser($actor);
        $verbs->load($load);

        return new SearchResults($verbs, $areMoreResults);
    }

    /**
     * Load relevant posts onto each verb using information from the
     * search.
     *
     * @param Collection $verbs
     * @param DiscussionSearch $search
     */
    protected function loadRelevantPosts(Collection $verbs, DiscussionSearch $search)
    {
        $postIds = [];
        foreach ($search->getRelevantPostIds() as $relevantPostIds) {
            $postIds = array_merge($postIds, array_slice($relevantPostIds, 0, 2));
        }

        $posts = $postIds ? $this->posts->findByIds($postIds, $search->getActor())->load('user')->all() : [];

        foreach ($verbs as $verb) {
            $verb->relevantPosts = array_filter($posts, function ($post) use ($verb) {
                return $post->discussion_id == $verb->id;
            });
        }
    }
}
