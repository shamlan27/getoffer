<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/list-templates', function () {
    return \Illuminate\Support\Facades\Http::withHeaders([
        'api-key' => env('BREVO_API_KEY'),
        'accept' => 'application/json'
    ])->get('https://api.brevo.com/v3/smtp/templates')->json();
});
