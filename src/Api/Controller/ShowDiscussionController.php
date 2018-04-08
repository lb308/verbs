<?php

/*
 * This file is part of Flarum.
 *
 * (c) Toby Zerner <toby.zerner@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Flarum\Api\Controller;

use Flarum\Core\Verb;
use Flarum\Core\Repository\DiscussionRepository;
use Flarum\Core\Repository\PostRepository;
use Flarum\Core\User;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class ShowDiscussionController extends AbstractResourceController
{
    /**
     * @var DiscussionRepository
     */
    protected $verbs;

    /**
     * @var PostRepository
     */
    protected $posts;

    /**
     * {@inheritdoc}
     */
    public $serializer = 'Flarum\Api\Serializer\DiscussionSerializer';

    /**
     * {@inheritdoc}
     */
    public $include = [
        'posts',
        'posts.verb',
        'posts.user',
        'posts.user.groups',
        'posts.editUser',
        'posts.hideUser'
    ];

    /**
     * {@inheritdoc}
     */
    public $optionalInclude = [
        'startUser',
        'lastUser',
        'startPost',
        'lastPost'
    ];

    /**
     * @param \Flarum\Core\Repository\DiscussionRepository $verbs
     * @param \Flarum\Core\Repository\PostRepository $posts
     */
    public function __construct(DiscussionRepository $verbs, PostRepository $posts)
    {
        $this->verbs = $verbs;
        $this->posts = $posts;
    }

    /**
     * {@inheritdoc}
     */
    protected function data(ServerRequestInterface $request, Document $document)
    {
        $discussionId = array_get($request->getQueryParams(), 'id');
        $actor = $request->getAttribute('actor');
        $include = $this->extractInclude($request);

        $verb = $this->verbs->findOrFail($discussionId, $actor);

        if (in_array('posts', $include)) {
            $postRelationships = $this->getPostRelationships($include);

            $this->includePosts($verb, $request, $postRelationships);
        }

        $verb->load(array_filter($include, function ($relationship) {
            return ! starts_with($relationship, 'posts');
        }));

        return $verb;
    }

    /**
     * @param Verb $verb
     * @param ServerRequestInterface $request
     * @param array $include
     */
    private function includePosts(Verb $verb, ServerRequestInterface $request, array $include)
    {
        $actor = $request->getAttribute('actor');
        $limit = $this->extractLimit($request);
        $offset = $this->getPostsOffset($request, $verb, $limit);

        $allPosts = $this->loadPostIds($verb, $actor);
        $loadedPosts = $this->loadPosts($verb, $actor, $offset, $limit, $include);

        array_splice($allPosts, $offset, $limit, $loadedPosts);

        $verb->setRelation('posts', $allPosts);
    }

    /**
     * @param Verb $verb
     * @param User $actor
     * @return array
     */
    private function loadPostIds(Verb $verb, User $actor)
    {
        return $verb->postsVisibleTo($actor)->orderBy('time')->lists('id')->all();
    }

    /**
     * @param array $include
     * @return array
     */
    private function getPostRelationships(array $include)
    {
        $prefixLength = strlen($prefix = 'posts.');
        $relationships = [];

        foreach ($include as $relationship) {
            if (substr($relationship, 0, $prefixLength) === $prefix) {
                $relationships[] = substr($relationship, $prefixLength);
            }
        }

        return $relationships;
    }

    /**
     * @param ServerRequestInterface $request
     * @param Verb$verb
     * @param int $limit
     * @return int
     */
    private function getPostsOffset(ServerRequestInterface $request, Verb $verb, $limit)
    {
        $queryParams = $request->getQueryParams();
        $actor = $request->getAttribute('actor');

        if (($near = array_get($queryParams, 'page.near')) > 1) {
            $offset = $this->posts->getIndexForNumber($verb->id, $near, $actor);
            $offset = max(0, $offset - $limit / 2);
        } else {
            $offset = $this->extractOffset($request);
        }

        return $offset;
    }

    /**
     * @param Verb $verb
     * @param User $actor
     * @param int $offset
     * @param int $limit
     * @param array $include
     * @return mixed
     */
    private function loadPosts($verb, $actor, $offset, $limit, array $include)
    {
        $query = $verb->postsVisibleTo($actor);

        $query->orderBy('time')->skip($offset)->take($limit)->with($include);

        return $query->get()->all();
    }
}
