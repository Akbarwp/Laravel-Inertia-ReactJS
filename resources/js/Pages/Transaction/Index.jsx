import Pagination from '@/Components/Pagination';
import TableHeading from '@/Components/TableHeading';
import TextInput from '@/Components/TextInput';
import SelectInput from '@/Components/SelectInput';
import {
    TRANSACTION_STATUS_TEXT_MAP,
    TRANSACTION_STATUS_CLASS_MAP,
} from "@/constants.jsx";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ auth, transactions, transactionStatus, queryParams = null, success, error }) {
    // Numbering table
    const currentPage = transactions.current_page;
    const perPage = transactions.per_page;
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
        router.get(route('transaction'), queryParams, { preserveScroll: true });
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
        router.get(route('transaction'), queryParams, { preserveScroll: true });
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
    };

    const priceFormat = (price) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(price)
    }

    const deleteTransaction = (id, e) => {
        e.preventDefault();
        if (!window.confirm('Are you sure you want to delete this transaction?')) {
            return;
        }
        router.delete(route('transaction.delete', id));
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Transaction</h2>
                    <Link href={route('transaction.create')} className="btn btn-primary btn-sm">
                        <i className='ri-add-line'></i>
                        Add Transaction
                    </Link>
                </div>
            }
        >

            <Head title="Transaction" />

            <div className="py-12">
                <div className="w-full px-2 mx-auto sm:px-6 lg:px-8">
                    {success && (
                        <div role="alert" className="alert alert-success mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{success}</span>
                        </div>
                    )}
                    {error && (
                        <div role="alert" className="alert alert-error mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{error}</span>
                        </div>
                    )}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="overflow-x-auto pb-3">
                            <table className="table dark:text-white">
                                <thead className='dark:text-white'>
                                    <tr>
                                        <th></th>
                                        <th>Transaction Code</th>
                                        <TableHeading
                                            name="transaction_date"
                                            sortable={true}
                                            sort_field={queryParams.sort_field}
                                            sort_direction={queryParams.sort_direction}
                                            sortChanged={sortChanged}
                                        >
                                            Date
                                        </TableHeading>
                                        <TableHeading
                                            name="grand_total"
                                            sortable={true}
                                            sort_field={queryParams.sort_field}
                                            sort_direction={queryParams.sort_direction}
                                            sortChanged={sortChanged}
                                        >
                                            Grand Total
                                        </TableHeading>
                                        <TableHeading
                                            name="payment"
                                            sortable={true}
                                            sort_field={queryParams.sort_field}
                                            sort_direction={queryParams.sort_direction}
                                            sortChanged={sortChanged}
                                        >
                                            Payment
                                        </TableHeading>
                                        <TableHeading
                                            name="change"
                                            sortable={true}
                                            sort_field={queryParams.sort_field}
                                            sort_direction={queryParams.sort_direction}
                                            sortChanged={sortChanged}
                                        >
                                            Change
                                        </TableHeading>
                                        <TableHeading
                                            name="status"
                                            sortable={true}
                                            sort_field={queryParams.sort_field}
                                            sort_direction={queryParams.sort_direction}
                                            sortChanged={sortChanged}
                                        >
                                            Status
                                        </TableHeading>
                                        <TableHeading
                                            name="user"
                                            sortable={true}
                                            sort_field={queryParams.sort_field}
                                            sort_direction={queryParams.sort_direction}
                                            sortChanged={sortChanged}
                                        >
                                            User
                                        </TableHeading>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td></td>
                                        <td>
                                            <TextInput
                                                type="text"
                                                className=""
                                                placeholder="Transaction Code"
                                                defaultValue={queryParams.transaction_code}
                                                onBlur={(e) => searchFieldChanged('transaction_code', e.target.value)}
                                                onKeyPress={(e) => onKeyPress('transaction_code', e)}
                                            />
                                        </td>
                                        <td>
                                            <TextInput
                                                type="date"
                                                className=""
                                                placeholder="Transaction Date"
                                                defaultValue={queryParams.transaction_date}
                                                onBlur={(e) => searchFieldChanged('transaction_date', e.target.value)}
                                                onKeyPress={(e) => onKeyPress('transaction_date', e)}
                                            />
                                        </td>
                                        <td>
                                            <TextInput
                                                type="number"
                                                min="0"
                                                className=""
                                                placeholder="Grand Total"
                                                defaultValue={queryParams.grand_total}
                                                onBlur={(e) => searchFieldChanged('grand_total', e.target.value)}
                                                onKeyPress={(e) => onKeyPress('grand_total', e)}
                                            />
                                        </td>
                                        <td>
                                            <TextInput
                                                type="number"
                                                min="0"
                                                className=""
                                                placeholder="Payment"
                                                defaultValue={queryParams.payment}
                                                onBlur={(e) => searchFieldChanged('payment', e.target.value)}
                                                onKeyPress={(e) => onKeyPress('payment', e)}
                                            />
                                        </td>
                                        <td>
                                            <TextInput
                                                type="number"
                                                min="0"
                                                className=""
                                                placeholder="Change"
                                                defaultValue={queryParams.change}
                                                onBlur={(e) => searchFieldChanged('change', e.target.value)}
                                                onKeyPress={(e) => onKeyPress('change', e)}
                                            />
                                        </td>
                                        <td>
                                            <SelectInput
                                                className=""
                                                placeholder="Select status!"
                                                defaultValue={queryParams.status}
                                                onChange={(e) => searchFieldChanged('status', e.target.value)}
                                            >
                                                <option value="">All</option>
                                                {transactionStatus.map((status, index) => (
                                                    <option key={index} value={status[1]}>{status[0]}</option>
                                                ))}
                                            </SelectInput>
                                        </td>
                                        <td>
                                            <TextInput
                                                type="text"
                                                className=""
                                                placeholder="User"
                                                defaultValue={queryParams.user}
                                                onBlur={(e) => searchFieldChanged('user', e.target.value)}
                                                onKeyPress={(e) => onKeyPress('user', e)}
                                            />
                                        </td>
                                        <td></td>
                                    </tr>

                                    {transactions.data.map((transaction, index) => (
                                        <tr key={transaction.id}>
                                            <td>{getNumbering(index)}</td>
                                            <td>{transaction.transaction_code}</td>
                                            <td>{formatDate(transaction.transaction_date)}</td>
                                            <td>{priceFormat(transaction.grand_total)}</td>
                                            <td>{priceFormat(transaction.payment)}</td>
                                            <td>{priceFormat(transaction.change)}</td>
                                            <td>
                                                <div className={`${TRANSACTION_STATUS_CLASS_MAP[transaction.status]}`}>
                                                    {TRANSACTION_STATUS_TEXT_MAP[transaction.status]}
                                                </div>
                                            </td>
                                            <td>{transaction.user}</td>
                                            <td className='flex gap-1'>
                                                <Link href={route('transaction.show', transaction.id)} className="btn btn-accent btn-sm">
                                                    <i className="ri-eye-line text-white"></i>
                                                </Link>
                                                <Link href={route('transaction.edit', transaction.id)} className="btn btn-warning btn-sm">
                                                    <i className="ri-pencil-fill text-white"></i>
                                                </Link>
                                                <button onClick={(e) => deleteTransaction(transaction.id, e)} className='btn btn-error btn-sm'>
                                                    <i className="ri-close-circle-line text-white"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <Pagination links={transactions.links} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
