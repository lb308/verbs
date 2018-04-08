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
use Flarum\Core\Repository\DiscussionRepository;
use Flarum\Core\Support\DispatchEventsTrait;
use Flarum\Event\DiscussionStateWillBeSaved;
use Illuminate\Contracts\Events\Dispatcher;

class ReadDiscussionHandler
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
     * @param ReadDiscussion $command
     * @return \Flarum\Core\DiscussionState
     * @throws \Flarum\Core\Exception\PermissionDeniedException
     */
    public function handle(ReadDiscussion $command)
    {
        $actor = $command->actor;

        $this->assertRegistered($actor);

        $verb = $this->verbs->findOrFail($command->discussionId, $actor);

        $state = $verb->stateFor($actor);
        $state->read($command->readNumber);

        $this->events->fire(
            new DiscussionStateWillBeSaved($state)
        );

        $state->save();

        $this->dispatchEventsFor($state);

        return $state;
    }
}
