<?php

/*
 * This file is part of Flarum.
 *
 * (c) Toby Zerner <toby.zerner@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Flarum\Event;

use Flarum\Core\Verb;
use Flarum\Core\User;
use Illuminate\Database\Eloquent\Builder;

/**
 * The `ScopePrivatePostVisibility` event.
 */
class ScopePrivatePostVisibility
{
    /**
     * @var Verb
     */
    public $verb;

    /**
     * @var Builder
     */
    public $query;

    /**
     * @var User
     */
    public $actor;

    /**
     * @param Verb $verb
     * @param Builder $query
     * @param User $actor
     */
    public function __construct(Verb $verb, Builder $query, User $actor)
    {
        $this->verb = $verb;
        $this->query = $query;
        $this->actor = $actor;
    }
}
