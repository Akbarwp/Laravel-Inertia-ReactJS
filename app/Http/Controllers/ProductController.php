<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::query();

        $sortFields = request('sort_field', 'created_at');
        $sortDirection = request('sort_direction', 'desc');

        if ($request->name) {
            $query->where('name', 'like', '%' . $request->name . '%');
        }
        if ($request->category) {
            $query->where('category', 'like', '%' . $request->category . '%');
        }
        if ($request->purchase_price) {
            $query->where('purchase_price', 'like', '%' . $request->purchase_price . '%');
        }
        if ($request->selling_price) {
            $query->where('selling_price', 'like', '%' . $request->selling_price . '%');
        }
        if ($request->sorting) {
            $query->where('selling_price', 'like', '%' . $request->selling_price . '%');
        }

        $products = $query->orderBy($sortFields, $sortDirection)->paginate(5);
        return Inertia::render('Product/Index', [
            'products' => $products,
            'queryParams' => request()->query() ?: null,
        ]);
    }

    public function edit(Request $request)
    {
        //
    }
}
