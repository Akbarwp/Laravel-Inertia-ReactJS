import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard({
    auth,
    totalProducts,
    totalTransaction,
    transactionPending,
    transactionPackaging,
    transactionShipment,
    transactionFinished,
    transactionCancel
}) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Dashboard - {new Date().toDateString()}</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 flex flex-wrap items-center justify-start gap-3">
                    <div className="card bg-base-100 w-96 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title text-2xl text-primary">Total Products</h2>
                            <p className='text-xl'>{totalProducts}</p>
                        </div>
                    </div>
                    <div className="card bg-base-100 w-96 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title text-2xl text-primary">Total Transaction</h2>
                            <p className='text-xl'>{totalTransaction}</p>
                        </div>
                    </div>
                    <div className="card bg-base-100 w-96 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title text-2xl text-primary">Transaction Pending</h2>
                            <p className='text-xl'>{transactionPending}</p>
                        </div>
                    </div>
                    <div className="card bg-base-100 w-96 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title text-2xl text-secondary">Transaction Packaging</h2>
                            <p className='text-xl'>{transactionPackaging}</p>
                        </div>
                    </div>
                    <div className="card bg-base-100 w-96 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title text-2xl text-accent">Transaction Shipment</h2>
                            <p className='text-xl'>{transactionShipment}</p>
                        </div>
                    </div>
                    <div className="card bg-base-100 w-96 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title text-2xl text-success">Transaction Finished</h2>
                            <p className='text-xl'>{transactionFinished}</p>
                        </div>
                    </div>
                    <div className="card bg-base-100 w-96 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title text-2xl text-error">Transaction Cancel</h2>
                            <p className='text-xl'>{transactionCancel}</p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
