<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/brevo-test', function () {
    return Http::timeout(10)
        ->withHeaders([
            'api-key' => env('BREVO_API_KEY'),
            'accept' => 'application/json',
            'content-type' => 'application/json'
        ])
        ->post('https://api.brevo.com/v3/smtp/email', [
            'sender' => ['email' => 'no-reply@get-offer.live'],
            'to' => [['email' => 'your_email@gmail.com']],
            'subject' => 'Brevo API OK',
            'htmlContent' => 'It works!'
        ])
        ->json();
});