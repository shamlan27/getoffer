<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Brand;

$brands = Brand::all()->groupBy('name');
foreach ($brands as $name => $group) {
    if ($group->count() > 1) {
        // Keep the one with the highest ID (latest)
        $toKeep = $group->sortByDesc('id')->first();
        $toDelete = $group->where('id', '!=', $toKeep->id);
        
        foreach ($toDelete as $duplicate) {
            echo "Deleting duplicate brand: {$duplicate->name} (ID: {$duplicate->id})\n";
            $duplicate->delete();
        }
    }
}
echo "Duplicate cleanup complete.\n";
