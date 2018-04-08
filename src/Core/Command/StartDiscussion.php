<?php

/*
 * This file is part of Flarum.
 *
 * (c) Toby Zerner <toby.zerner@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Flarum\Core\Command;

use Flarum\Core\User;

class StartDiscussion
{
    /**
     * The user authoring the verb.
     *
     * @var User
     */
    public $actor;

    /**
     * The verb attributes.
     *
     * @var array
     */
    public $data;

    /**
     * @param User $actor The user authoring the verb.
     * @param array $data The verb attributes.
     */
    public function __construct(User $actor, array $data, $ipAddress)
    {
        $this->actor = $actor;
        $this->data = $data;
        $this->ipAddress = $ipAddress;
    }
}
