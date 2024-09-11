import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ auth, product }) {

    const priceFormat = (price) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(price)
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Product Details</h2>
            }
        >

            <Head title="Product Details" />

            <div className="py-12">
                <div className="w-full px-2 mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="hero">
                            <div className="hero-content flex-col dark:text-white">
                                {product.picture ? (
                                    <img src={`/storage/products/${product.picture}`} alt='product-picture' className="w-full h-64 object-top rounded-lg shadow-2xl object-cover" />
                                ) : (
                                    <img src="https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.webp" alt='product-picture' className="w-full h-64 object-top rounded-lg shadow-2xl object-cover" />
                                )}
                                <div>
                                    <h1 className="text-5xl font-bold">{product.name}</h1>
                                    <h3 className="text-xl text-slate-500 dark:text-slate-400 mb-2">{product.category}</h3>
                                    <h2 className="text-xl font-semibold">Purchasing Price : {priceFormat(product.purchase_price)}</h2>
                                    <h2 className="text-xl font-semibold">Selling Price : {priceFormat(product.selling_price)}</h2>
                                    <p className="py-6">{product.description}</p>
                                    <Link href={route('product')} className="btn btn-secondary btn-sm">
                                        <i className='ri-arrow-left-fill'></i>
                                        Return Back
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
