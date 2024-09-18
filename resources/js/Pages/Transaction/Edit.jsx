import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { TRANSACTION_STATUS_TEXT_MAP } from "@/constants.jsx";
import { Head, Link, useForm } from '@inertiajs/react';

export default function Edit({ auth, products, transaction, transactionDetail, transactionStatus }) {

    const { data, setData, post, errors, reset } = useForm({
        id: transaction.id,
        transaction_date: transaction.transaction_date,
        grand_total: transaction.grand_total,
        payment: transaction.payment,
        change: transaction.change,
        status: transaction.status,
        products: transactionDetail,
    });

    const addProductForm = () => {
        setData('products', [...data.products, { id: Date.now(), productId: '', price: 0, quantity: 1 }]);
    };
    const deleteProductForm = (id) => {
        const updatedProducts = data.products.filter((product) => product.id !== id);
        setData('products', updatedProducts);
    };

    const handleInputChange = (id, updates) => {
        const updatedProducts = data.products.map((product) =>
            product.id === id ? { ...product, ...updates } : product
        );
        setData('products', updatedProducts);
    };

    const handlePayment = (e) => {
        const payment = e.target.value;
        const change = payment - data.grand_total;
        setData(data => ({
            ...data,
            payment: payment,
            change: change
        }));
    }

    const handleGrandTotal = async () => {
        try {
            const response = await fetch(route('transaction.checkTotalPayment'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ products: data.products }),
            });

            if (!response.ok) {
                throw new Error('Failed to check total payment');
            }

            const result = await response.json();
            setData(data => ({
                ...data,
                grand_total: result.totalPayment,
                change: data.payment - result.totalPayment
            }));

        } catch (error) {
            console.error('Error checking total payment:', error);
        }
    }

    const handleSelectProduct = async (id, productId) => {
        try {
            const response = await fetch(route('transaction.checkProductPrice'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productId),
            });

            if (!response.ok) {
                throw new Error('Failed to check product price');
            }

            const result = await response.json();
            handleInputChange(id, { price: result.price, productId: productId });

        } catch (error) {
            console.error('Error checking product price:', error);
        }
    }

    const onSubmit = (e) => {
        e.preventDefault();
        if (data.payment < data.grand_total || data.change < 0) {
            return alert('Payment is not enough!');
        }
        post(route('transaction.update', transaction.id));
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className='flex items-center justify-between'>
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Edit Transaction</h2>
                    <Link href={route('transaction')} className="btn btn-neutral btn-sm">
                        <i className='ri-arrow-left-fill'></i>
                        Return Back
                    </Link>
                </div>
            }
        >

            <Head title="Edit Transaction" />

            <div className="py-12">
                <div className="w-full px-2 mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className='max-w-7xl mx-auto px-10 py-6'>
                            <form onSubmit={onSubmit} method="POST" encType='multipart/form-data'>
                                <input type="text" name='id' className="input input-bordered w-full" defaultValue={data.id} hidden />
                                <label className="form-control w-full">
                                    <div className="label">
                                        <span className="label-text dark:text-white font-semibold">Transaction Date:</span>
                                    </div>
                                    <input type="date" name='transaction_date' className="input input-bordered w-full bg-slate-200" value={data.transaction_date} readOnly />
                                    <div className="label">
                                        <span className="label-text-alt text-error">{errors.transaction_date}</span>
                                    </div>
                                </label>
                                <label className="form-control w-full">
                                    <div className="label">
                                        <span className="label-text dark:text-white font-semibold">Status:</span>
                                    </div>
                                    <select
                                        className="select select-bordered"
                                        name='status'
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                        required
                                    >
                                        <option value="" selected>Select status!</option>
                                        {transactionStatus.map((status) => (
                                            <option key={status} value={status}>{TRANSACTION_STATUS_TEXT_MAP[status]}</option>
                                        ))}
                                    </select>
                                    <div className="label">
                                        <span className="label-text-alt text-error">{errors.payment}</span>
                                    </div>
                                </label>
                                <label className="form-control w-full">
                                    <div className="label">
                                        <span className="label-text dark:text-white font-semibold">Grand Total:</span>
                                    </div>
                                    <div className="relative w-full">
                                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                            Rp
                                        </div>
                                        <input type="number" min='0' name='grand_total' placeholder="Grand Total" className="input input-bordered w-full bg-slate-200 ps-10 p-2.5" value={data.grand_total} readOnly />
                                    </div>
                                    <div className="label">
                                        <span className="label-text-alt text-error">{errors.grand_total}</span>
                                    </div>
                                </label>
                                <label className="form-control w-full">
                                    <div className="label">
                                        <span className="label-text dark:text-white font-semibold">Payment:</span>
                                    </div>
                                    <div className="relative w-full">
                                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                            Rp
                                        </div>
                                        <input type="number" min="0" name='payment' placeholder="Payment" className="input input-bordered w-full ps-10 p-2.5" value={data.payment} onChange={(e) => handlePayment(e)} required />
                                    </div>
                                    <div className="label">
                                        <span className="label-text-alt text-error">{errors.payment}</span>
                                    </div>
                                </label>
                                <label className="form-control w-full">
                                    <div className="label">
                                        <span className="label-text dark:text-white font-semibold">Change:</span>
                                    </div>
                                    <div className="relative w-full">
                                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                            Rp
                                        </div>
                                        <input type="number" min='0' name='change' placeholder="Change" className="input input-bordered w-full bg-slate-200 ps-10 p-2.5" value={data.change} readOnly />
                                    </div>
                                    <div className="label">
                                        <span className="label-text-alt text-error">{errors.change}</span>
                                    </div>
                                </label>

                                <div className='mb-3'>
                                    <h1 className='my-3 text-xl font-bold'>Transaction Detail</h1>
                                    <div className='flex items-center gap-x-1'>
                                        <button type='button' className="btn btn-success btn-sm tooltip" data-tip="Add Product" onClick={addProductForm}>
                                            <i className='ri-add-fill text-white'></i>
                                        </button>
                                        <button type="button" className="btn btn-error btn-sm tooltip" data-tip="Delete Last Product" onClick={() => data.products.length > 0 && deleteProductForm(data.products[data.products.length - 1].id)} disabled={data.products.length === 0}>
                                            <i className='ri-subtract-fill text-white'></i>
                                        </button>
                                        <button type='button' className="btn btn-primary btn-sm tooltip" data-tip="Check Total Payment" onClick={handleGrandTotal}>
                                            <i className='ri-save-3-fill text-white'></i>
                                        </button>
                                    </div>

                                    <div className='mt-2'>
                                        {data.products.map((product, index) => (
                                            <div key={index} className='w-full flex justify-between items-center gap-x-3 mb-3'>
                                                <label className="form-control w-full">
                                                    <div className="label">
                                                        <span className="label-text dark:text-white font-semibold">Product {index + 1}:</span>
                                                    </div>
                                                    <select
                                                        className="select select-bordered"
                                                        name='products'
                                                        value={product.productId}
                                                        onChange={(e) => {
                                                            handleSelectProduct(product.id, e.target.value);
                                                        }}
                                                        required
                                                    >
                                                        <option value="" selected>Select product!</option>
                                                        {products.map((product) => (
                                                            <option key={product.id} value={product.id}>{product.name}</option>
                                                        ))}
                                                    </select>
                                                </label>
                                                <label className="form-control w-full">
                                                    <div className="label">
                                                        <span className="label-text dark:text-white font-semibold">Price:</span>
                                                    </div>
                                                    <div className="relative w-full">
                                                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                                            Rp
                                                        </div>
                                                        <input type="number" min='0' name='price' placeholder="Price" className="input input-bordered w-full bg-slate-300 ps-10 p-2.5" value={product.price} readOnly />
                                                    </div>
                                                </label>
                                                <label className="form-control w-full">
                                                    <div className="label">
                                                        <span className="label-text dark:text-white font-semibold">Quantity:</span>
                                                    </div>
                                                    <input type="number" min='1' name='quantity' placeholder="Quantity" className="input input-bordered w-full" value={product.quantity} onChange={(e) => handleInputChange(product.id, { quantity: e.target.value })} required />
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <button type='submit' className="btn btn-warning w-full">Update</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
