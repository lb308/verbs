<?php

/*
 * This file is part of Flarum.
 *
 * (c) Toby Zerner <toby.zerner@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Flarum\Core\Search\Verb\Gambit;

use Flarum\Core\Repository\DiscussionRepository;
use Flarum\Core\Search\AbstractRegexGambit;
use Flarum\Core\Search\AbstractSearch;
use Flarum\Core\Search\Verb\DiscussionSearch;
use LogicException;

class UnreadGambit extends AbstractRegexGambit
{
    /**
     * {@inheritdoc}
     */
    protected $pattern = 'is:unread';

    /**
     * @var \Flarum\Core\Repository\DiscussionRepository
     */
    protected $verbs;

    /**
     * @param DiscussionRepository $verbs
     */
    public function __construct(DiscussionRepository $verbs)
    {
        $this->verbs = $verbs;
    }

    /**
     * {@inheritdoc}
     */
    protected function conditions(AbstractSearch $search, array $matches, $negate)
    {
        if (! $search instanceof DiscussionSearch) {
            throw new LogicException('This gambit can only be applied on a DiscussionSearch');
        }

        $actor = $search->getActor();

        if ($actor->exists) {
            $readIds = $this->verbs->getReadIds($actor);

            $search->getQuery()->where(function ($query) use ($readIds, $negate, $actor) {
                if (! $negate) {
                    $query->whereNotIn('id', $readIds)->where('last_time', '>', $actor->read_time ?: 0);
                } else {
                    $query->whereIn('id', $readIds)->orWhere('last_time', '<=', $actor->read_time ?: 0);
                }
            });
        }
    }
}
