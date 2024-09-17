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
                <div className='flex items-center justify-between'>
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Product Details</h2>
                    <div className='flex items-center gap-x-2'>
                        <Link href={route('product.edit', product.id)} className="btn btn-warning btn-sm">
                            <i className='ri-pencil-fill'></i>
                            Edit
                        </Link>
                        <Link href={route('product')} className="btn btn-neutral btn-sm">
                            <i className='ri-arrow-left-fill'></i>
                            Return Back
                        </Link>
                    </div>
                </div>
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
                                    <p className="pt-6 pb-1 font-semibold">Description:</p>
                                    <p>{product.description}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
