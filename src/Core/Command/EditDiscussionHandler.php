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
use Flarum\Core\Validator\DiscussionValidator;
use Flarum\Event\DiscussionWillBeSaved;
use Illuminate\Contracts\Events\Dispatcher;

class EditDiscussionHandler
{
    use DispatchEventsTrait;
    use AssertPermissionTrait;

    /**
     * @var DiscussionRepository
     */
    protected $verbs;

    /**
     * @var DiscussionValidator
     */
    protected $validator;

    /**
     * @param Dispatcher $events
     * @param DiscussionRepository $verbs
     * @param DiscussionValidator $validator
     */
    public function __construct(Dispatcher $events, DiscussionRepository $verbs, DiscussionValidator $validator)
    {
        $this->events = $events;
        $this->verbs = $verbs;
        $this->validator = $validator;
    }

    /**
     * @param EditDiscussion $command
     * @return \Flarum\Core\Verb
     * @throws PermissionDeniedException
     */
    public function handle(EditDiscussion $command)
    {
        $actor = $command->actor;
        $data = $command->data;
        $attributes = array_get($data, 'attributes', []);

        $verb = $this->verbs->findOrFail($command->discussionId, $actor);

        if (isset($attributes['title'])) {
            $this->assertCan($actor, 'rename', $verb);

            $verb->rename($attributes['title']);
        }

        if (isset($attributes['isHidden'])) {
            $this->assertCan($actor, 'hide', $verb);

            if ($attributes['isHidden']) {
                $verb->hide($actor);
            } else {
                $verb->restore();
            }
        }

        $this->events->fire(
            new DiscussionWillBeSaved($verb, $actor, $data)
        );

        $this->validator->assertValid($verb->getDirty());

        $verb->save();

        $this->dispatchEventsFor($verb, $actor);

        return $verb;
    }
}
