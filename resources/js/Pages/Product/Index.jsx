import Pagination from '@/Components/Pagination';
import TableHeading from '@/Components/TableHeading';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useEffect } from 'react';

export default function Index({ auth, products, queryParams = null, success, error }) {
    // Numbering table
    const currentPage = products.current_page;
    const perPage = products.per_page;
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
        router.get(route('product'), queryParams);
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
        router.get(route('product'), queryParams);
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            document.getElementById('alert-notif').style.display = 'none';
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Product</h2>
                    <Link href={route('product.create')} className="btn btn-primary btn-sm">
                        <i className='ri-add-line'></i>
                        Add Product
                    </Link>
                </div>
            }
        >

            <Head title="Product" />

            <div className="py-12">
                <div className="w-full px-2 mx-auto sm:px-6 lg:px-8">
                    {success && (
                        <div role="alert" className="alert alert-success mb-3" id='alert-notif'>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{success}</span>
                        </div>
                    )}
                    {error && (
                        <div role="alert" className="alert alert-error mb-3" id='alert-notif'>
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
                                        <th>Picture</th>
                                        <TableHeading
                                            name="name"
                                            sortable={true}
                                            sort_field={queryParams.sort_field}
                                            sort_direction={queryParams.sort_direction}
                                            sortChanged={sortChanged}
                                        >
                                            Name
                                        </TableHeading>
                                        <TableHeading
                                            name="category"
                                            sortable={true}
                                            sort_field={queryParams.sort_field}
                                            sort_direction={queryParams.sort_direction}
                                            sortChanged={sortChanged}
                                        >
                                            Category
                                        </TableHeading>
                                        <TableHeading
                                            name="purchase_price"
                                            sortable={true}
                                            sort_field={queryParams.sort_field}
                                            sort_direction={queryParams.sort_direction}
                                            sortChanged={sortChanged}
                                        >
                                            Purchase Price
                                        </TableHeading>
                                        <TableHeading
                                            name="selling_price"
                                            sortable={true}
                                            sort_field={queryParams.sort_field}
                                            sort_direction={queryParams.sort_direction}
                                            sortChanged={sortChanged}
                                        >
                                            Selling Price
                                        </TableHeading>
                                        <TableHeading
                                            name="created_at"
                                            sortable={true}
                                            sort_field={queryParams.sort_field}
                                            sort_direction={queryParams.sort_direction}
                                            sortChanged={sortChanged}
                                        >
                                            Created At
                                        </TableHeading>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td>
                                            <TextInput
                                                type="text"
                                                className=""
                                                placeholder="Product Name"
                                                defaultValue={queryParams.name}
                                                onBlur={(e) => searchFieldChanged('name', e.target.value)}
                                                onKeyPress={(e) => onKeyPress('name', e)}
                                            />
                                        </td>
                                        <td>
                                            <TextInput
                                                type="text"
                                                className=""
                                                placeholder="Category"
                                                defaultValue={queryParams.category}
                                                onBlur={(e) => searchFieldChanged('category', e.target.value)}
                                                onKeyPress={(e) => onKeyPress('category', e)}
                                            />
                                        </td>
                                        <td>
                                            <TextInput
                                                type="number"
                                                min="0"
                                                className=""
                                                placeholder="Price"
                                                defaultValue={queryParams.purchase_price}
                                                onBlur={(e) => searchFieldChanged('purchase_price', e.target.value)}
                                                onKeyPress={(e) => onKeyPress('purchase_price', e)}
                                            />
                                        </td>
                                        <td>
                                            <TextInput
                                                type="number"
                                                min="0"
                                                className=""
                                                placeholder="Price"
                                                defaultValue={queryParams.selling_price}
                                                onBlur={(e) => searchFieldChanged('selling_price', e.target.value)}
                                                onKeyPress={(e) => onKeyPress('selling_price', e)}
                                            />
                                        </td>
                                        <td></td>
                                        <td></td>
                                    </tr>

                                    {products.data.map((product, index) => (
                                        <tr key={product.id}>
                                            <td>{getNumbering(index)}</td>
                                            <td>
                                                {product.picture ? (
                                                    <div className="avatar">
                                                        <div className="w-10 rounded">
                                                            <img src={`/storage/products/${product.picture}`} alt='product-picture' />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="avatar">
                                                        <div className="w-10 rounded">
                                                            <img src="https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.webp" alt='product-picture' />
                                                        </div>
                                                    </div>
                                                )}
                                            </td>
                                            <td>{product.name}</td>
                                            <td>{product.category}</td>
                                            <td>{product.purchase_price}</td>
                                            <td>{product.selling_price}</td>
                                            <td>{formatDate(product.created_at)}</td>
                                            <td className='flex gap-1'>
                                                <Link href={route('product.show', product.id)} className="btn btn-accent btn-sm">
                                                    <i className="ri-eye-line text-white"></i>
                                                </Link>
                                                <Link href={route('product.edit', product.id)} className="btn btn-warning btn-sm">
                                                    <i className="ri-pencil-fill text-white"></i>
                                                </Link>
                                                <form action={route('product.delete', product.id)} method="post" encType="multipart/form-data" className="btn btn-error btn-sm">
                                                    <button type="submit">
                                                        <i className="ri-close-circle-line text-white"></i>
                                                    </button>
                                                </form>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <Pagination links={products.links} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
