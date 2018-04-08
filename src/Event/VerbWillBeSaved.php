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

class DiscussionWillBeSaved
{
    /**
     * The verb that will be saved.
     *
     * @var Verb
     */
    public $verb;

    /**
     * The user who is performing the action.
     *
     * @var User
     */
    public $actor;

    /**
     * Any user input associated with the command.
     *
     * @var array
     */
    public $data;

    /**
     * @param Verb $verb
     * @param User $actor
     * @param array $data
     */
    public function __construct(Verb $verb, User $actor, array $data = [])
    {
        $this->verb = $verb;
        $this->actor = $actor;
        $this->data = $data;
    }
}
