<?php

namespace App\Http\Controllers;

use App\Enums\TransactionStatus;
use App\Models\Product;
use App\Models\Transaction;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        $transaction = Transaction::get();
        $totalProducts = Product::get()->count();
        $totalTransaction = $transaction->count();
        $transactionPending = $transaction->where('status', TransactionStatus::PENDING->value)->count();
        $transactionPackaging = $transaction->where('status', TransactionStatus::PACKAGING->value)->count();
        $transactionShipment = $transaction->where('status', TransactionStatus::SHIPMENT->value)->count();
        $transactionFinished = $transaction->where('status', TransactionStatus::FINISHED->value)->count();
        $transactionCancel = $transaction->where('status', TransactionStatus::CANCEL->value)->count();

        return inertia('Dashboard', [
            'totalProducts' => $totalProducts,
            'totalTransaction' => $totalTransaction,
            'transactionPending' => $transactionPending,
            'transactionPackaging' => $transactionPackaging,
            'transactionShipment' => $transactionShipment,
            'transactionFinished' => $transactionFinished,
            'transactionCancel' => $transactionCancel,
        ]);
    }
}
