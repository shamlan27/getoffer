<x-mail::message>
# {{ $alert->title }}

<p style="color: #666; font-size: 0.9em; margin-bottom: 20px;">
    <strong>Type:</strong> {{ $alert->type }}
</p>

{!! $alert->message !!}

@if($alert->action_url)
<x-mail::button :url="$alert->action_url">
    View Offer
</x-mail::button>
@endif

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
