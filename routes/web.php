<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TransactionController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::group([
    'middleware' => ['auth', 'verified'],
], function() {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::group([
        'prefix' => 'product',
    ], function() {
        Route::get('/', [ProductController::class, 'index'])->name('product');
        Route::get('/show/{product:id}', [ProductController::class, 'show'])->name('product.show');
        Route::get('/create', [ProductController::class, 'create'])->name('product.create');
        Route::post('/create', [ProductController::class, 'store'])->name('product.store');
        Route::get('/edit/{product:id}', [ProductController::class, 'edit'])->name('product.edit');
        Route::post('/edit/{product:id}', [ProductController::class, 'update'])->name('product.update');
        Route::delete('/delete/{product:id}', [ProductController::class, 'delete'])->name('product.delete');
    });

    Route::group([
        'prefix' => 'transaction',
    ], function() {
        Route::get('/', [TransactionController::class, 'index'])->name('transaction');
        Route::get('/show/{transaction:id}', [TransactionController::class, 'show'])->name('transaction.show');
        Route::get('/create', [TransactionController::class, 'create'])->name('transaction.create');
        Route::post('/create', [TransactionController::class, 'store'])->name('transaction.store');
        Route::get('/edit/{transaction:id}', [TransactionController::class, 'edit'])->name('transaction.edit');
        Route::post('/edit/{transaction:id}', [TransactionController::class, 'update'])->name('transaction.update');
        Route::delete('/delete/{transaction:id}', [TransactionController::class, 'delete'])->name('transaction.delete');
    });

    Route::group([
        'prefix' => 'transaction-detail',
    ], function() {
        Route::get('/', [TransactionController::class, 'index'])->name('transaction-detail');
        Route::get('/show/{transaction:id}', [TransactionController::class, 'show'])->name('transaction-detail.show');
        Route::get('/create', [TransactionController::class, 'create'])->name('transaction-detail.create');
        Route::post('/create', [TransactionController::class, 'store'])->name('transaction-detail.store');
        Route::get('/edit/{transaction:id}', [TransactionController::class, 'edit'])->name('transaction-detail.edit');
        Route::post('/edit/{transaction:id}', [TransactionController::class, 'update'])->name('transaction-detail.update');
        Route::delete('/delete/{transaction:id}', [TransactionController::class, 'delete'])->name('transaction-detail.delete');
    });
});

require __DIR__.'/auth.php';
