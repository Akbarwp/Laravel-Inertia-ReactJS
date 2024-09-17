<?php

namespace App\Http\Controllers;

use App\Enums\TransactionStatus;
use App\Models\Product;
use App\Models\Transaction;
use App\Models\TransactionDetail;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    public function index(Request $request)
    {
        $transactionStatus = [];
        foreach (TransactionStatus::cases() as $status) {
            $transactionStatus[] = [$status->name, $status->value];
        }

        $query = Transaction::query()->join('users as u', 'transactions.user_id', '=', 'u.id');
        $sortFields = request('sort_field', 'transactions.created_at');
        $sortDirection = request('sort_direction', 'desc');

        if ($request->transaction_code) {
            $query->where('transactions.transaction_code', 'like', '%' . $request->transaction_code . '%');
        }
        if ($request->transaction_date) {
            $query->whereDate('transactions.transaction_date', $request->transaction_date);
        }
        if ($request->grand_total) {
            $query->where('transactions.grand_total', 'like', '%' . $request->grand_total . '%');
        }
        if ($request->payment) {
            $query->where('transactions.payment', 'like', '%' . $request->payment . '%');
        }
        if ($request->change) {
            $query->where('transactions.change', 'like', '%' . $request->change . '%');
        }
        if ($request->status) {
            $query->where('transactions.status', $request->status);
        }
        if ($request->user) {
            $query->where('u.name', 'like', '%' . $request->user . '%');
        }

        $query->select('transactions.*', 'u.name as user');

        $transactions = $query->orderBy($sortFields, $sortDirection)->paginate(5);
        return inertia('Transaction/Index', [
            'transactions' => $transactions,
            'transactionStatus' => $transactionStatus,
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
            'error' => session('error'),
        ]);
    }

    public function show(Request $request)
    {
        $products = Product::get();
        $transaction = Transaction::query()
            ->join('users as u', 'transactions.user_id', '=', 'u.id')
            ->where('transactions.id', $request->transaction)
            ->select('transactions.*', 'u.name as user')
            ->first();

        $query = TransactionDetail::query()
            ->join('products as p', 'transaction_details.product_id', '=', 'p.id')
            ->where('transaction_id', $transaction->id);

        $sortFields = request('sort_field', 'transaction_details.created_at');
        $sortDirection = request('sort_direction', 'desc');

        if ($request->product) {
            $query->where("p.id", $request->product);
        }
        if ($request->price) {
            $query->where('transaction_details.price', 'like', '%' . $request->price . '%');
        }
        if ($request->quantity) {
            $query->where('transaction_details.quantity', 'like', '%' . $request->quantity . '%');
        }
        if ($request->sub_total) {
            $query->where('transaction_details.sub_total', 'like', '%' . $request->sub_total . '%');
        }
        if ($request->profit) {
            $query->where('transaction_details.profit', 'like', '%' . $request->profit . '%');
        }

        $query->select('transaction_details.*', 'p.id as product_id', 'p.name as product');

        $transactionDetails = $query->orderBy($sortFields, $sortDirection)->paginate(5);
        return inertia('Transaction/Show', [
            'transaction' => $transaction,
            'transactionDetails' => $transactionDetails,
            'products' => $products,
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
            'error' => session('error'),
        ]);
    }

    public function create()
    {
        return inertia('Transaction/Create', [
            'products' => Product::get(),
        ]);
    }

    public function checkTotalPayment(Request $request)
    {
        $totalPayment = 0;
        foreach ($request->products as $product) {
            $price = Product::find($product['productId'])->selling_price;
            $totalPayment += $product['quantity'] * $price;
        }
        return response()->json(['totalPayment' => $totalPayment]);
    }

    public function checkProductPrice(Request $request) {
        $price = Product::find($request[0])->selling_price;
        return response()->json(['price' => $price]);
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

        $create = Transaction::create($validated);

        if ($create) {
            return to_route('transaction')->with('success', 'Transaction created successfully');
        } else {
            return to_route('transaction')->with('error', 'Transaction created failed');
        }
    }

    public function edit(Request $request)
    {
        return inertia('Transaction/Edit', [
            'transaction' => Transaction::find($request->transaction),
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

        $update = Transaction::find($request->id)->update($validated);

        if ($update) {
            return to_route('transaction')->with('success', 'Transaction updated successfully');
        } else {
            return to_route('transaction')->with('error', 'Transaction updated failed');
        }
    }

    public function delete(Request $request)
    {
        $delete = Transaction::find($request->transaction)->delete();
        if ($delete) {
            return to_route('transaction')->with('success', 'Transaction deleted successfully');
        } else {
            return to_route('transaction')->with('error', 'Transaction deleted failed');
        }
    }
}
