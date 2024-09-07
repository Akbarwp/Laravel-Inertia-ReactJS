import Pagination from '@/Components/Pagination';
import TableHeading from '@/Components/TableHeading';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ auth, products, queryParams = null }) {
    queryParams = queryParams || {};
    const handlePageChange = (url) => {
        Inertia.get(url);
    };
    const currentPage = products.current_page;
    const perPage = products.per_page;
    const getNumbering = (index) => {
        return (currentPage - 1) * perPage + index + 1;
    };

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

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Product</h2>
            }
        >

            <Head title="Product" />

            <div className="py-12">
                <div className="w-full px-2 mx-auto sm:px-6 lg:px-8">
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
                                                            <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="avatar">
                                                        <div className="w-10 rounded">
                                                            <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
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
                            <Pagination links={products.links} onPageChange={handlePageChange} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
