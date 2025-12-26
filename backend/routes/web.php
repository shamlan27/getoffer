<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/nuke-cache', function () {
    Artisan::call('config:clear');
    Artisan::call('cache:clear');
    Artisan::call('optimize:clear');
    return 'Cache NUKED. Now try your admin page.';
});

Route::get('/force-reset', function () {
    // 1. Physically delete the cached config file
    $file = base_path('bootstrap/cache/config.php');
    if (file_exists($file)) {
        unlink($file);
        $status = "DELETED cached config file.";
    } else {
        $status = "No cached config file found (system is already using live files).";
    }

    // 2. Clear other caches just in case
    \Illuminate\Support\Facades\Artisan::call('cache:clear');
    \Illuminate\Support\Facades\Artisan::call('view:clear');

    return response()->json([
        'status' => $status,
        'message' => 'Cache cleared. Please try uploading again.',
    ]);
});