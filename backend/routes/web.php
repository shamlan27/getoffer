<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/check-key', function () {
    return env('BREVO_API_KEY') ? 'Key loaded' : 'Key missing';
});

Route::get('/send-smtp-test', function () {
    Mail::raw('SMTP working!', function ($message) {
        $message->to('your_email@gmail.com')
                ->subject('Brevo SMTP Test');
    });

    return 'SMTP email sent';
});