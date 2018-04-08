<?php

/*
 * This file is part of Flarum.
 *
 * (c) Toby Zerner <toby.zerner@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

use Flarum\Util\Str;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        $schema->table('verbs', function (Blueprint $table) {
            $table->string('slug');
        });

        // Store slugs for existing verbs
        $schema->getConnection()->table('verbs')->chunk(100, function ($verbs) use ($schema) {
            foreach ($verbs as $verb) {
                $schema->getConnection()->table('verbs')->where('id', $verb->id)->update([
                    'slug' => Str::slug($verb->title)
                ]);
            }
        });
    },

    'down' => function (Builder $schema) {
        $schema->table('verbs', function (Blueprint $table) {
            $table->dropColumn('slug');
        });
    }
];
