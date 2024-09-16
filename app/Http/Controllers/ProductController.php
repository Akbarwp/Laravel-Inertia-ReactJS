<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

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
        return inertia('Product/Index', [
            'products' => $products,
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
            'error' => session('error'),
        ]);
    }

    public function show(Request $request)
    {
        return inertia('Product/Show', [
            'product' => Product::find($request->product),
        ]);
    }

    public function create()
    {
        return inertia('Product/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'description' => 'required|string',
            'purchase_price' => 'required|decimal:0,2',
            'selling_price' => 'required|decimal:0,2',
            'picture' => 'nullable|image|max:3072',
        ]);
        $picture = '';
        if ($request->hasFile('picture')) {
            $picture = Str::random(11) . "." . $request->file('picture')->getClientOriginalExtension();
        }
        $validated['picture'] = $picture;

        $create = Product::create($validated);

        if ($create) {
            if ($request->hasFile('picture')) {
                $folderPath = "products/";
                $request->file('picture')->storeAs($folderPath, $picture);
            }
            return to_route('product')->with('success', 'Product created successfully');
        } else {
            return to_route('product')->with('error', 'Product created failed');
        }
    }

    public function edit(Request $request)
    {
        return inertia('Product/Edit', [
            'product' => Product::find($request->product),
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'description' => 'required|string',
            'purchase_price' => 'required|decimal:0,2',
            'selling_price' => 'required|decimal:0,2',
            'picture' => 'nullable|image|max:3072',
        ]);
        $product = Product::find($request->id);
        $oldPicure = $product->picture;
        if ($request->hasFile('picture')) {
            $picture = Str::random(11) . "." . $request->file('picture')->getClientOriginalExtension();
        }
        $validated['picture'] = $picture;

        $update = $product->update($validated);

        if ($update) {
            if ($request->hasFile('picture')) {
                $folderPath = "products/";
                Storage::delete($folderPath . $oldPicure);
                $request->file('picture')->storeAs($folderPath, $picture);
            }
            return to_route('product')->with('success', 'Product updated successfully');
        } else {
            return to_route('product')->with('error', 'Product updated failed');
        }
    }

    public function delete(Request $request)
    {
        $product = Product::find($request->product);
        $delete = $product->delete();
        if ($delete) {
            if ($product->hasFile('picture')) {
                $folderPath = "products/";
                Storage::delete($folderPath . $product->picture);
            }
            return to_route('product')->with('success', 'Product '.$product->name.' deleted successfully');
        } else {
            return to_route('product')->with('error', 'Product '.$product->name.' deleted failed');
        }
    }
}
