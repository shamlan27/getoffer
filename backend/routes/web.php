<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/check-key', function () {
    return env('BREVO_API_KEY') ? 'Key loaded' : 'Key missing';
});
