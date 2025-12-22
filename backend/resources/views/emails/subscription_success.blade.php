@extends('emails.layout')

@section('content')
    <h2 style="margin-top: 0;">Welcome to GetOffer!</h2>
    <p>Hi there,</p>
    <p>Thank you for subscribing to our newsletter! You're now on the list to receive the latest and greatest deals, coupons, and promotions from top brands in Sri Lanka.</p>
    
    <div style="text-align: center;">
        <a href="{{ env('FRONTEND_URL', 'http://localhost:3000') }}" class="btn">Start Browsing Deals</a>
    </div>

    <p style="margin-top: 30px;">
        We promise not to spam your inbox. You can unsubscribe at any time from your dashboard or via the link in our emails.
    </p>

    <p style="margin-top: 30px;">
        Happy Saving,<br>
        The GetOffer Team
    </p>
@endsection
