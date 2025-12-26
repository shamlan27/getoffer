<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/debug-config', function () {
    // 1. Force Clear Cache
    Artisan::call('config:clear');
    Artisan::call('cache:clear');

    // 2. Show us the LIVE config to prove if 'key' exists
    $cloudinaryConfig = config('cloudinary.cloud');
    $filesystemConfig = config('filesystems.disks.cloudinary');

    return [
        '1_cache_status' => 'CLEARED',
        '2_cloudinary_config_check' => [
            'has_api_key' => isset($cloudinaryConfig['api_key']),
            'has_key_alias' => isset($cloudinaryConfig['key']), // <--- WE NEED THIS TO BE TRUE
            'values' => $cloudinaryConfig,
        ],
        '3_filesystem_config_check' => [
            'has_api_key' => isset($filesystemConfig['cloud']['api_key']),
            'has_key_alias' => isset($filesystemConfig['cloud']['key']), // <--- WE NEED THIS TO BE TRUE
            'values' => $filesystemConfig,
        ]
    ];
});