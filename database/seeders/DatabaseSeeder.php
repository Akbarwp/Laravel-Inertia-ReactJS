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
        User::factory()->create([
            'name' => 'Admin admin',
            'email' => 'admin@gmail.com',
        ]);
        User::factory(11)->create();

        $products = Product::factory(10)->create();

        $transaction = Transaction::create([
            'transaction_code' => Carbon::now()->format('dmY-Hi-') . '1',
            'transaction_date' => Carbon::now(),
            'grand_total' => 1,
            'payment' => 2,
            'change' => 3,
            'status' => TransactionStatus::SHIPMENT,
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

        $grandTotal = $detail1->sub_total + $detail2->sub_total;
        $transaction->update([
            'grand_total' => $grandTotal,
            'payment' => $grandTotal + 20000,
            'change' => 20000,
        ]);

        $transaction2 = Transaction::create([
            'transaction_code' => Carbon::tomorrow()->format('dmY-Hi-') . '1',
            'transaction_date' => Carbon::tomorrow(),
            'grand_total' => 1,
            'payment' => 2,
            'change' => 3,
            'status' => TransactionStatus::PENDING,
            'user_id' => 2,
        ]);

        $detail3 = TransactionDetail::create([
            'transaction_id' => $transaction2->id,
            'product_id' => $products[2]->id,
            'price' => $products[2]->selling_price,
            'quantity' => 3,
            'sub_total' => $products[2]->selling_price * 3,
            'profit' => ($products[2]->selling_price - $products[2]->purchase_price) * 3,
        ]);
        $detail4 = TransactionDetail::create([
            'transaction_id' => $transaction2->id,
            'product_id' => $products[3]->id,
            'price' => $products[3]->selling_price,
            'quantity' => 2,
            'sub_total' => $products[3]->selling_price * 2,
            'profit' => ($products[3]->selling_price - $products[3]->purchase_price) * 2,
        ]);

        $grandTotal = $detail3->sub_total + $detail4->sub_total;
        $transaction2->update([
            'grand_total' => $grandTotal,
            'payment' => $grandTotal + 30000,
            'change' => 30000,
        ]);
    }
}
