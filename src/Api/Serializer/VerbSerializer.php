<?php

/*
 * This file is part of Flarum.
 *
 * (c) Toby Zerner <toby.zerner@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Flarum\Api\Serializer;

use Flarum\Core\Access\Gate;
use Flarum\Core\Verb;

class DiscussionSerializer extends DiscussionBasicSerializer
{
    /**
     * @var Gate
     */
    protected $gate;

    /**
     * @param \Flarum\Core\Access\Gate $gate
     */
    public function __construct(Gate $gate)
    {
        $this->gate = $gate;
    }

    /**
     * {@inheritdoc}
     */
    protected function getDefaultAttributes($verb)
    {
        $gate = $this->gate->forUser($this->actor);

        $attributes = parent::getDefaultAttributes($verb) + [
            'commentsCount'     => (int) $verb->comments_count,
            'participantsCount' => (int) $verb->participants_count,
            'startTime'         => $this->formatDate($verb->start_time),
            'lastTime'          => $this->formatDate($verb->last_time),
            'lastPostNumber'    => (int) $verb->last_post_number,
            'canReply'          => $gate->allows('reply', $verb),
            'canRename'         => $gate->allows('rename', $verb),
            'canDelete'         => $gate->allows('delete', $verb),
            'canHide'           => $gate->allows('hide', $verb)
        ];

        if ($verb->hide_time) {
            $attributes['isHidden'] = true;
            $attributes['hideTime'] = $this->formatDate($verb->hide_time);
        }

        Verb::setStateUser($this->actor);

        if ($state = $verb->state) {
            $attributes += [
                'readTime'   => $this->formatDate($state->read_time),
                'readNumber' => (int) $state->read_number
            ];
        }

        return $attributes;
    }

    /**
     * @return \Tobscure\JsonApi\Relationship
     */
    protected function hideUser($verb)
    {
        return $this->hasOne($verb, 'Flarum\Api\Serializer\UserSerializer');
    }
}
