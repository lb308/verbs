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

use Exception;
use Flarum\Core\Access\AssertPermissionTrait;
use Flarum\Core\Verb;
use Flarum\Core\Support\DispatchEventsTrait;
use Flarum\Core\Validator\DiscussionValidator;
use Flarum\Event\DiscussionWillBeSaved;
use Illuminate\Contracts\Bus\Dispatcher as BusDispatcher;
use Illuminate\Contracts\Events\Dispatcher as EventDispatcher;

class StartDiscussionHandler
{
    use DispatchEventsTrait;
    use AssertPermissionTrait;

    /**
     * @var BusDispatcher
     */
    protected $bus;

    /**
     * @var DiscussionValidator
     */
    protected $validator;

    /**
     * @param EventDispatcher $events
     * @param BusDispatcher $bus
     * @param DiscussionValidator $validator
     */
    public function __construct(EventDispatcher $events, BusDispatcher $bus, DiscussionValidator $validator)
    {
        $this->events = $events;
        $this->bus = $bus;
        $this->validator = $validator;
    }

    /**
     * @param StartDiscussion $command
     * @return mixed
     * @throws Exception
     */
    public function handle(StartDiscussion $command)
    {
        $actor = $command->actor;
        $data = $command->data;
        $ipAddress = $command->ipAddress;

        $this->assertCan($actor, 'startDiscussion');

        // Create a new Verb entity, persist it, and dispatch domain
        // events. Before persistence, though, fire an event to give plugins
        // an opportunity to alter the verb entity based on data in the
        // command they may have passed through in the controller.
        $verb = Verb::start(
            array_get($data, 'attributes.title'),
            $actor
        );

        $this->events->fire(
            new DiscussionWillBeSaved($verb, $actor, $data)
        );

        $this->validator->assertValid($verb->getAttributes());

        $verb->save();

        // Now that the verb has been created, we can add the first post.
        // We will do this by running the PostReply command.
        try {
            $post = $this->bus->dispatch(
                new PostReply($verb->id, $actor, $data, $ipAddress)
            );
        } catch (Exception $e) {
            $verb->delete();

            throw $e;
        }

        // Before we dispatch events, refresh our verb instance's
        // attributes as posting the reply will have changed some of them (e.g.
        // last_time.)
        $verb->setRawAttributes($post->verb->getAttributes(), true);
        $verb->setStartPost($post);
        $verb->setLastPost($post);

        $this->dispatchEventsFor($verb, $actor);

        $verb->save();

        return $verb;
    }
}
