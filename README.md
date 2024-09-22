# Laravel Inertia

Laravel Inertia is a website that provides CRUD (Create, Read, Update, Delete) functionality for products and transactions. Built with Laravel and Inertia, the website allows users to efficiently manage product data and transactions through a modern and responsive interface.

## Tech Stack

- **Laravel 11**
- **Laravel Breeze**
- **MySQL Database**
- **Inertia - ReactJS**
- **TailwindCSS**
- **daisyUI**

## Features

- Main features available in this application:
  - CRUD Product
  - Transaction Management

## Installation

Follow the steps below to clone and run the project in your local environment:

1. Clone repository:

    ```bash
    git clone https://github.com/Akbarwp/Laravel-Inertia.git
    ```

2. Install dependencies use Composer and NPM:

    ```bash
    composer install
    npm install
    ```

3. Copy file `.env.example` to `.env`:

    ```bash
    cp .env.example .env
    ```

4. Generate application key:

    ```bash
    php artisan key:generate
    ```

5. Setup database in the `.env` file:

    ```plaintext
    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_DATABASE=laravel_inertia
    DB_USERNAME=root
    DB_PASSWORD=
    ```

6. Run migration database:

    ```bash
    php artisan migrate
    ```

7. Run website:

    ```bash
    npm run dev
    php artisan serve
    ```

## Screenshot

- ### **Dashboard**

<img src="https://github.com/user-attachments/assets/3557faf6-0d39-4bfd-bcc1-7e6dd89c4a43" alt="Halaman Dashboard" width="" />
<br><br>

- ### **Product page**

<img src="https://github.com/user-attachments/assets/c24283fa-4450-42c1-898c-948ac74fa716" alt="Halaman Produk" width="" />
&nbsp;&nbsp;&nbsp;
<img src="https://github.com/user-attachments/assets/23e8b8c5-b23f-4924-be0e-c93562814514" alt="Halaman Tambah Produk" width="" />
<br><br>

- ### **Transaction page**

<img src="https://github.com/user-attachments/assets/6367b0fa-ba5d-4a9e-9995-6e4c43960322" alt="Halaman Transaksi" width="" />
&nbsp;&nbsp;&nbsp;
<img src="https://github.com/user-attachments/assets/a0fbb1b4-6cd9-4c56-a054-7045af1d131f" alt="Halaman Tambah Transaksi" width="" />
<br><br>
