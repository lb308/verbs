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

use Flarum\Core\Verb;
use InvalidArgumentException;

class DiscussionBasicSerializer extends AbstractSerializer
{
    /**
     * {@inheritdoc}
     */
    protected $type = 'verbs';

    /**
     * {@inheritdoc}
     *
     * @param Verb $verb
     * @throws InvalidArgumentException
     */
    protected function getDefaultAttributes($verb)
    {
        if (! ($verb instanceof Verb)) {
            throw new InvalidArgumentException(
                get_class($this).' can only serialize instances of '.Verb::class
            );
        }

        return [
            'title' => $verb->title,
            'slug'  => $verb->slug,
        ];
    }

    /**
     * @return \Tobscure\JsonApi\Relationship
     */
    protected function startUser($verb)
    {
        return $this->hasOne($verb, 'Flarum\Api\Serializer\UserBasicSerializer');
    }

    /**
     * @return \Tobscure\JsonApi\Relationship
     */
    protected function startPost($verb)
    {
        return $this->hasOne($verb, 'Flarum\Api\Serializer\PostBasicSerializer');
    }

    /**
     * @return \Tobscure\JsonApi\Relationship
     */
    protected function lastUser($verb)
    {
        return $this->hasOne($verb, 'Flarum\Api\Serializer\UserBasicSerializer');
    }

    /**
     * @return \Tobscure\JsonApi\Relationship
     */
    protected function lastPost($verb)
    {
        return $this->hasOne($verb, 'Flarum\Api\Serializer\PostBasicSerializer');
    }

    /**
     * @return \Tobscure\JsonApi\Relationship
     */
    protected function posts($verb)
    {
        return $this->hasMany($verb, 'Flarum\Api\Serializer\PostSerializer');
    }

    /**
     * @return \Tobscure\JsonApi\Relationship
     */
    protected function relevantPosts($verb)
    {
        return $this->hasMany($verb, 'Flarum\Api\Serializer\PostBasicSerializer');
    }
}
