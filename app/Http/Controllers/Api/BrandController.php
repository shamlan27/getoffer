<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use Illuminate\Http\Request;

class BrandController extends Controller
{
    public function index(Request $request)
    {
        $query = Brand::where('is_active', true);

        if ($request->has('category')) {
            $query->whereHas('offers.category', function ($q) use ($request) {
                $q->where('slug', $request->category);
            });
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where('name', 'like', "%{$search}%");
        }

        return response()->json($query->get());
    }

    public function show($id)
    {
        $brand = Brand::where('is_active', true)->findOrFail($id);
        return response()->json($brand);
    }
}
