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

class DiscussionWasDeleted
{
    /**
     * @var Verb
     */
    public $verb;

    /**
     * @var User
     */
    public $actor;

    /**
     * @param Verb $verb
     * @param User $actor
     */
    public function __construct(Verb $verb, User $actor = null)
    {
        $this->verb = $verb;
        $this->actor = $actor;
    }
}
