<?php

namespace Database\Seeders;

use App\Enums\TransactionStatus;
use App\Models\Product;
use App\Models\Transaction;
use App\Models\TransactionDetail;
use App\Models\User;
use Carbon\Carbon;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Admin admin',
            'email' => 'admin@gmail.com',
        ]);

        $products = Product::factory(10)->create();

        $transaction = Transaction::create([
            'transaction_code' => Carbon::now()->format('dmY-Hi-') . '1',
            'transaction_date' => Carbon::now(),
            'grand_total' => 1,
            'status' => TransactionStatus::PENDING,
            'user_id' => 1,
        ]);

        $detail1 = TransactionDetail::create([
            'transaction_id' => $transaction->id,
            'product_id' => $products[0]->id,
            'price' => $products[0]->selling_price,
            'quantity' => 3,
            'sub_total' => $products[0]->selling_price * 3,
            'profit' => ($products[0]->selling_price - $products[0]->purchase_price) * 3,
        ]);
        $detail2 = TransactionDetail::create([
            'transaction_id' => $transaction->id,
            'product_id' => $products[1]->id,
            'price' => $products[1]->selling_price,
            'quantity' => 2,
            'sub_total' => $products[1]->selling_price * 2,
            'profit' => ($products[1]->selling_price - $products[1]->purchase_price) * 2,
        ]);

        $transaction->update([
            'grand_total' => $detail1->sub_total + $detail2->sub_total,
        ]);
    }
}
