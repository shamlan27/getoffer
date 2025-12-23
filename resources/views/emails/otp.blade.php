@extends('emails.layout')

@section('content')
    <h2 style="margin-top: 0;">Verification Code</h2>
    <p>Hello,</p>
    <p>Please use the following verification code to complete your request. This code will expire in 10 minutes.</p>
    
    <div class="otp-code">
        {{ $otp }}
    </div>

    <p>If you did not request this code, please ignore this email.</p>

    <p style="margin-top: 30px;">
        Thanks,<br>
        The GetOffer Team
    </p>
@endsection
