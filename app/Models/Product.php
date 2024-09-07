<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    public $table = "products";
    protected $fillable = [
        'name',
        'category',
        'description',
        'purchase_price',
        'selling_price',
        'picture',
    ];

    public function transactionDetail()
    {
        return $this->belongsTo(TransactionDetail::class);
    }
}
