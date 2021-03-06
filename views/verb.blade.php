<?php
$verb = $document->data;
$postsCount = count($verb->relationships->posts->data);
?>
<div class="container">
    <h2>{{ $verb->attributes->title }}</h2>

    <div>
        @foreach ($posts as $post)
            <div>
                <?php $user = $getResource($post->relationships->user->data); ?>
                <h3>{{ $user ? $user->attributes->username : $translator->trans('core.lib.username.deleted_text') }}</h3>
                <div class="Post-body">
                    {!! $post->attributes->contentHtml !!}
                </div>
            </div>

            <hr>
        @endforeach
    </div>

    @if ($page > 1)
        <a href="{{ $url(['page' => $page - 1]) }}">&laquo; {{ $translator->trans('core.views.verb.previous_page_button') }}</a>
    @endif

    @if ($page < $postsCount / 20)
        <a href="{{ $url(['page' => $page + 1]) }}">{{ $translator->trans('core.views.verb.next_page_button') }} &raquo;</a>
    @endif
</div>
