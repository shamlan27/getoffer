<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});


Route::get('/fix-railway', function () {
    // 1. Force clear the config cache
    Artisan::call('config:clear');
    Artisan::call('cache:clear');
    
    // 2. Debug: Show us exactly what Laravel sees for the Cloudinary config
    return response()->json([
        'message' => 'Cache cleared successfully!',
        'cloudinary_config' => config('cloudinary'), // This will show us if the 'cloud' key exists
    ]);
});