import Pagination from '@/Components/Pagination';
import TableHeading from '@/Components/TableHeading';
import TextInput from '@/Components/TextInput';
import SelectInput from '@/Components/SelectInput';
import TransactionStatusLabel from '@/Components/TransactionStatusLabel';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Show({ auth, transaction, transactionDetails, products, queryParams = null, success, error }) {
    // Numbering table
    const currentPage = transactionDetails.current_page;
    const perPage = transactionDetails.per_page;
    const getNumbering = (index) => {
        return (currentPage - 1) * perPage + index + 1;
    };

    // Filtering table
    queryParams = queryParams || {};
    const searchFieldChanged = (name, value) => {
        if (value) {
            queryParams[name] = value;
        } else {
            delete queryParams[name];
        }
        router.get(route('transaction.show', transaction.id), queryParams, { preserveScroll: true });
    }

    const onKeyPress = (name, e) => {
        if (e.key !== 'Enter') return;
        searchFieldChanged(name, e.target.value);
    }

    const sortChanged = (name) => {
        if (name === queryParams.sort_field) {
            if (queryParams.sort_direction === 'asc') {
                queryParams.sort_direction = 'desc';
            } else {
                queryParams.sort_direction = 'asc';
            }
        } else {
            queryParams.sort_field = name;
            queryParams.sort_direction = 'asc';
        }
        router.get(route('transaction.show', transaction.id), queryParams, { preserveScroll: true });
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: '2-digit',
        });
    };

    const priceFormat = (price) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(price)
    }

    const deleteTransactionDetail = (id, e) => {
        e.preventDefault();
        if (!window.confirm('Are you sure you want to delete this transaction detail?')) {
            return;
        }
        router.delete(route('transaction-detail.delete', id));
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className='flex items-center justify-between'>
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Transaction Details</h2>
                    <div className='flex items-center gap-x-2'>
                        <Link href={route('transaction.edit', transaction.id)} className="btn btn-warning btn-sm">
                            <i className='ri-pencil-fill'></i>
                            Edit
                        </Link>
                        <Link href={route('transaction')} className="btn btn-neutral btn-sm">
                            <i className='ri-arrow-left-fill'></i>
                            Return Back
                        </Link>
                    </div>
                </div>
            }
        >

            <Head title="Transaction Details" />

            <div className="py-12">
                <div className="w-full px-2 mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="hero">
                            <div className="hero-content flex-col dark:text-white">
                                <img src={`/image/transaction-image.jpg`} alt='transaction-picture' className="w-full h-64 object-top rounded-lg shadow-2xl object-cover" />
                                <div className="overflow-x-auto">
                                    <table className="table">
                                        <tbody>
                                            <tr>
                                                <th>Transaction Code</th>
                                                <td>{transaction.transaction_code}</td>
                                                <th>Transaction Date</th>
                                                <td>{formatDate(transaction.transaction_date)}</td>
                                            </tr>
                                            <tr>
                                                <th>Status</th>
                                                <td><TransactionStatusLabel status={transaction.status} /></td>
                                            </tr>
                                            <tr>
                                                <th>Grand Total</th>
                                                <td>{priceFormat(transaction.grand_total)}</td>
                                            </tr>
                                            <tr>
                                                <th>Payment</th>
                                                <td>{priceFormat(transaction.payment)}</td>
                                                <th>Change</th>
                                                <td>{priceFormat(transaction.change)}</td>
                                            </tr>
                                            <tr>
                                                <th>User</th>
                                                <td>{transaction.user}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto pb-3">
                            <table className="table dark:text-white">
                                <thead className='dark:text-white'>
                                    <tr>
                                        <th></th>
                                        <TableHeading
                                            name="product"
                                            sortable={true}
                                            sort_field={queryParams.sort_field}
                                            sort_direction={queryParams.sort_direction}
                                            sortChanged={sortChanged}
                                        >
                                            Product
                                        </TableHeading>
                                        <TableHeading
                                            name="price"
                                            sortable={true}
                                            sort_field={queryParams.sort_field}
                                            sort_direction={queryParams.sort_direction}
                                            sortChanged={sortChanged}
                                        >
                                            Price
                                        </TableHeading>
                                        <TableHeading
                                            name="quantity"
                                            sortable={true}
                                            sort_field={queryParams.sort_field}
                                            sort_direction={queryParams.sort_direction}
                                            sortChanged={sortChanged}
                                        >
                                            Quantity
                                        </TableHeading>
                                        <TableHeading
                                            name="sub_total"
                                            sortable={true}
                                            sort_field={queryParams.sort_field}
                                            sort_direction={queryParams.sort_direction}
                                            sortChanged={sortChanged}
                                        >
                                            Sub Total
                                        </TableHeading>
                                        <TableHeading
                                            name="profit"
                                            sortable={true}
                                            sort_field={queryParams.sort_field}
                                            sort_direction={queryParams.sort_direction}
                                            sortChanged={sortChanged}
                                        >
                                            Profit
                                        </TableHeading>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td></td>
                                        <td>
                                            <SelectInput
                                                className=""
                                                placeholder="Select product!"
                                                defaultValue={queryParams.product}
                                                onChange={(e) => searchFieldChanged('product', e.target.value)}
                                            >
                                                <option value="">All</option>
                                                {products.map((product, index) => (
                                                    <option key={index} value={product.id}>{product.name}</option>
                                                ))}
                                            </SelectInput>
                                        </td>
                                        <td>
                                            <TextInput
                                                type="number"
                                                min="0"
                                                className=""
                                                placeholder="Price"
                                                defaultValue={queryParams.price}
                                                onBlur={(e) => searchFieldChanged('price', e.target.value)}
                                                onKeyPress={(e) => onKeyPress('price', e)}
                                            />
                                        </td>
                                        <td>
                                            <TextInput
                                                type="number"
                                                min="0"
                                                className=""
                                                placeholder="Quantity"
                                                defaultValue={queryParams.quantity}
                                                onBlur={(e) => searchFieldChanged('quantity', e.target.value)}
                                                onKeyPress={(e) => onKeyPress('quantity', e)}
                                            />
                                        </td>
                                        <td>
                                            <TextInput
                                                type="number"
                                                min="0"
                                                className=""
                                                placeholder="Sub Total"
                                                defaultValue={queryParams.sub_total}
                                                onBlur={(e) => searchFieldChanged('sub_total', e.target.value)}
                                                onKeyPress={(e) => onKeyPress('sub_total', e)}
                                            />
                                        </td>
                                        <td>
                                            <TextInput
                                                type="number"
                                                min="0"
                                                className=""
                                                placeholder="Profit"
                                                defaultValue={queryParams.profit}
                                                onBlur={(e) => searchFieldChanged('profit', e.target.value)}
                                                onKeyPress={(e) => onKeyPress('profit', e)}
                                            />
                                        </td>
                                        <td></td>
                                    </tr>

                                    {transactionDetails.data.map((detail, index) => (
                                        <tr key={detail.id}>
                                            <td>{getNumbering(index)}</td>
                                            <td>{detail.product}</td>
                                            <td>{priceFormat(detail.price)}</td>
                                            <td>{detail.quantity}</td>
                                            <td>{priceFormat(detail.sub_total)}</td>
                                            <td>{priceFormat(detail.profit)}</td>
                                            <td className='flex gap-1'>
                                                <Link href={route('transaction-detail.show', detail.id)} className="btn btn-accent btn-sm">
                                                    <i className="ri-eye-line text-white"></i>
                                                </Link>
                                                <Link href={route('transaction-detail.edit', detail.id)} className="btn btn-warning btn-sm">
                                                    <i className="ri-pencil-fill text-white"></i>
                                                </Link>
                                                <button onClick={(e) => deleteTransactionDetail(detail.id, e)} className='btn btn-error btn-sm'>
                                                    <i className="ri-close-circle-line text-white"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <Pagination links={transactionDetails.links} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
