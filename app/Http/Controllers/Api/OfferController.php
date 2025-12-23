<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Offer;
use App\Models\Category;
use Illuminate\Http\Request;

class OfferController extends Controller
{
    public function index(Request $request)
    {
        $query = Offer::with(['brand', 'category'])
            ->where(function ($q) {
                $q->whereNull('valid_to')->orWhere('valid_to', '>=', now());
            })
            ->orderBy('created_at', 'desc');

        if ($request->has('category')) {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('slug', $request->category);
            });
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhereHas('brand', function ($q) use ($search) {
                      $q->where('name', 'like', "%{$search}%");
                  });
            });
        }

        if ($request->has('featured')) {
            $query->where('is_featured', true);
        }

        if ($request->has('brand')) {
            $query->where('brand_id', $request->brand);
        }

        return response()->json($query->paginate(12));
    }

    public function show($id)
    {
        $offer = Offer::with(['brand', 'category'])->findOrFail($id);
        return response()->json($offer);
    }

    public function categories()
    {
        return response()->json(Category::all());
    }

    public function suggestions(Request $request)
    {
        $search = $request->search;
        if (!$search) {
            return response()->json(['offers' => [], 'categories' => []]);
        }

        $offers = Offer::with('brand')
            ->where(function ($q) {
                $q->whereNull('valid_to')->orWhere('valid_to', '>=', now());
            })
            ->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhereHas('brand', function ($q) use ($search) {
                      $q->where('name', 'like', "%{$search}%");
                  });
            })
            ->limit(5)
            ->get();

        $categories = Category::where('name', 'like', "%{$search}%")
            ->limit(3)
            ->get();

        return response()->json([
            'offers' => $offers,
            'categories' => $categories
        ]);
    }
}
