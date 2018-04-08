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

use Flarum\Core\Access\AssertPermissionTrait;
use Flarum\Core\Exception\PermissionDeniedException;
use Flarum\Core\Repository\DiscussionRepository;
use Flarum\Core\Support\DispatchEventsTrait;
use Flarum\Event\DiscussionWillBeDeleted;
use Illuminate\Contracts\Events\Dispatcher;

class DeleteDiscussionHandler
{
    use DispatchEventsTrait;
    use AssertPermissionTrait;

    /**
     * @var DiscussionRepository
     */
    protected $verbs;

    /**
     * @param Dispatcher $events
     * @param DiscussionRepository $verbs
     */
    public function __construct(Dispatcher $events, DiscussionRepository $verbs)
    {
        $this->events = $events;
        $this->verbs = $verbs;
    }

    /**
     * @param DeleteDiscussion $command
     * @return \Flarum\Core\Verb
     * @throws PermissionDeniedException
     */
    public function handle(DeleteDiscussion $command)
    {
        $actor = $command->actor;

        $verb = $this->verbs->findOrFail($command->discussionId, $actor);

        $this->assertCan($actor, 'delete', $verb);

        $this->events->fire(
            new DiscussionWillBeDeleted($verb, $actor, $command->data)
        );

        $verb->delete();

        $this->dispatchEventsFor($verb, $actor);

        return $verb;
    }
}
