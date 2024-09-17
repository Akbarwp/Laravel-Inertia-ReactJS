<?php

use App\Http\Controllers\TransactionController;
use Illuminate\Support\Facades\Route;

Route::group([
    // 'middleware' => ['auth', 'verified'],
], function () {
    Route::group([
        'prefix' => 'transaction',
    ], function () {
        Route::post('/checking-payment', [TransactionController::class, 'checkTotalPayment'])->name('transaction.checkTotalPayment');
        Route::post('/checking-product-price', [TransactionController::class, 'checkProductPrice'])->name('transaction.checkProductPrice');
    });
});
