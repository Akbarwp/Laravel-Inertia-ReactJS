<?php

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
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    Route::group([
        'prefix' => 'product',
    ], function() {
        Route::get('/', [ProductController::class, 'index'])->name('product');
        Route::get('/show/{product:id}', [ProductController::class, 'show'])->name('product.show');
        Route::get('/create', [ProductController::class, 'create'])->name('product.create');
        Route::post('/create', [ProductController::class, 'store'])->name('product.store');
        Route::get('/edit/{product:id}', [ProductController::class, 'edit'])->name('product.edit');
        Route::post('/edit/{product:id}', [ProductController::class, 'update'])->name('product.update');
        Route::post('/delete/{product:id}', [ProductController::class, 'delete'])->name('product.delete');
    });

    Route::group([
        'prefix' => 'transaction',
    ], function() {
        Route::get('/', [TransactionController::class, 'index'])->name('transaction');
    });
});

require __DIR__.'/auth.php';
