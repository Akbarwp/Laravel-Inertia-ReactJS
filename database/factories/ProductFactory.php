<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $purchase_price = fake()->randomNumber(4, true);
        return [
            'name' => fake()->words(2, true),
            'category' => fake()->randomElement(["Monitor", "Mouse", "Keyboard"]),
            'description' => fake()->sentence(12),
            'purchase_price' => $purchase_price,
            'selling_price' => $purchase_price + 2000,
        ];
    }
}
