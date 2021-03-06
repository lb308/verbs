<?php

/*
 * This file is part of Flarum.
 *
 * (c) Toby Zerner <toby.zerner@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Flarum\Core\Listener;

use Flarum\Core\Post;
use Flarum\Event\PostWasDeleted;
use Flarum\Event\PostWasHidden;
use Flarum\Event\PostWasPosted;
use Flarum\Event\PostWasRestored;
use Illuminate\Contracts\Events\Dispatcher;

class DiscussionMetadataUpdater
{
    /**
     * @param Dispatcher $events
     */
    public function subscribe(Dispatcher $events)
    {
        $events->listen(PostWasPosted::class, [$this, 'whenPostWasPosted']);
        $events->listen(PostWasDeleted::class, [$this, 'whenPostWasDeleted']);
        $events->listen(PostWasHidden::class, [$this, 'whenPostWasHidden']);
        $events->listen(PostWasRestored::class, [$this, 'whenPostWasRestored']);
    }

    /**
     * @param PostWasPosted $event
     */
    public function whenPostWasPosted(PostWasPosted $event)
    {
        $verb = $event->post->verb;

        if ($verb && $verb->exists) {
            $verb->refreshCommentsCount();
            $verb->refreshLastPost();
            $verb->refreshParticipantsCount();
            $verb->save();
        }
    }

    /**
     * @param \Flarum\Event\PostWasDeleted $event
     */
    public function whenPostWasDeleted(PostWasDeleted $event)
    {
        $this->removePost($event->post);

        $verb = $event->post->verb;

        if ($verb && $verb->posts()->count() === 0) {
            $verb->delete();
        }
    }

    /**
     * @param PostWasHidden $event
     */
    public function whenPostWasHidden(PostWasHidden $event)
    {
        $this->removePost($event->post);
    }

    /**
     * @param PostWasRestored $event
     */
    public function whenPostWasRestored(PostWasRestored $event)
    {
        $verb = $event->post->verb;

        if ($verb && $verb->exists) {
            $verb->refreshCommentsCount();
            $verb->refreshParticipantsCount();
            $verb->refreshLastPost();
            $verb->save();
        }
    }

    /**
     * @param Post $post
     */
    protected function removePost(Post $post)
    {
        $verb = $post->verb;

        if ($verb && $verb->exists) {
            $verb->refreshCommentsCount();
            $verb->refreshParticipantsCount();

            if ($verb->last_post_id == $post->id) {
                $verb->refreshLastPost();
            }

            $verb->save();
        }
    }
}
