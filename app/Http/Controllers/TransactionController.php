<?php

namespace App\Http\Controllers;

use App\Enums\TransactionStatus;
use App\Models\Product;
use App\Models\Transaction;
use App\Models\TransactionDetail;
use Carbon\Carbon;
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
            'transaction_date' => 'required|date',
            'grand_total' => 'required|decimal:0,2',
            'payment' => 'required|decimal:0,2',
            'change' => 'required|decimal:0,2',
            'user_id' => 'required|integer',
        ]);

        $validated['transaction_code'] = Carbon::now()->format('dmY-Hi-') . $validated['user_id'];
        $validated['status'] = TransactionStatus::PENDING->value;

        $create = Transaction::create($validated);
        foreach($request->products as $item) {
            $product = Product::find($item['productId']);
            $subTotal = $item['quantity'] * $product->selling_price;
            $profit = ($product->selling_price - $product->purchase_price) * $item['quantity'];

            TransactionDetail::create([
                'transaction_id' => $create->id,
                'product_id' => $item['productId'],
                'price' => $product->selling_price,
                'quantity' => $item['quantity'],
                'sub_total' => $subTotal,
                'profit' => $profit,
            ]);
        }

        if ($create) {
            return to_route('transaction')->with('success', 'Transaction created successfully');
        } else {
            return to_route('transaction')->with('error', 'Transaction created failed');
        }
    }

    public function edit(Request $request)
    {
        $transaction = Transaction::find($request->transaction);
        $detail = [];
        foreach($transaction->transactionDetail()->get() as $item) {
            $detail[] = [
                'id' => $item->id,
                'productId' => $item->product_id,
                'price' => $item->price,
                'quantity' => $item->quantity,
            ];
        }
        $transactionStatus = TransactionStatus::cases();

        return inertia('Transaction/Edit', [
            'transaction' => $transaction,
            'transactionDetail' => $detail,
            'products' => Product::get(),
            'transactionStatus' => $transactionStatus,
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'grand_total' => 'required|decimal:0,2',
            'payment' => 'required|decimal:0,2',
            'change' => 'required|decimal:0,2',
            'status' => 'required|integer',
        ]);

        $transaction = Transaction::find($request->id);
        $update = $transaction->update([
            'grand_total' => $validated['grand_total'],
            'payment' => $validated['payment'],
            'change' => $validated['change'],
            'status' => $validated['status'],
        ]);

        $transaction->transactionDetail()->delete();
        foreach($request->products as $item) {
            $product = Product::find($item['productId']);
            $subTotal = $item['quantity'] * $product->selling_price;
            $profit = ($product->selling_price - $product->purchase_price) * $item['quantity'];

            TransactionDetail::create([
                'transaction_id' => $transaction->id,
                'product_id' => $item['productId'],
                'price' => $product->selling_price,
                'quantity' => $item['quantity'],
                'sub_total' => $subTotal,
                'profit' => $profit,
            ]);
        }

        if ($update) {
            return to_route('transaction')->with('success', 'Transaction updated successfully');
        } else {
            return to_route('transaction')->with('error', 'Transaction updated failed');
        }
    }

    public function delete(Request $request)
    {
        $transaction = Transaction::find($request->transaction);
        $deleteDetail = $transaction->transactionDetail()->delete();
        $delete = $transaction->delete();
        if ($delete && $deleteDetail) {
            return to_route('transaction')->with('success', 'Transaction deleted successfully');
        } else {
            return to_route('transaction')->with('error', 'Transaction deleted failed');
        }
    }
}
