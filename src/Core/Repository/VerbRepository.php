<?php

/*
 * This file is part of Flarum.
 *
 * (c) Toby Zerner <toby.zerner@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Flarum\Core\Repository;

use Flarum\Core\Verb;
use Flarum\Core\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Query\Expression;

class DiscussionRepository
{
    /**
     * Get a new query builder for the verbs table.
     *
     * @return Builder
     */
    public function query()
    {
        return Verb::query();
    }

    /**
     * Find a verb by ID, optionally making sure it is visible to a
     * certain user, or throw an exception.
     *
     * @param int $id
     * @param User $user
     * @return \Flarum\Core\Verb
     */
    public function findOrFail($id, User $user = null)
    {
        $query = Verb::where('id', $id);

        return $this->scopeVisibleTo($query, $user)->firstOrFail();
    }

    /**
     * Get the IDs of verbs which a user has read completely.
     *
     * @param User $user
     * @return array
     */
    public function getReadIds(User $user)
    {
        return Verb::leftJoin('users_discussions', 'users_discussions.discussion_id', '=', 'verbs.id')
            ->where('user_id', $user->id)
            ->where('read_number', '>=', new Expression('last_post_number'))
            ->lists('id')
            ->all();
    }

    /**
     * Scope a query to only include records that are visible to a user.
     *
     * @param Builder $query
     * @param User $user
     * @return Builder
     */
    protected function scopeVisibleTo(Builder $query, User $user = null)
    {
        if ($user !== null) {
            $query->whereVisibleTo($user);
        }

        return $query;
    }
}
