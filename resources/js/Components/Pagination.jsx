import { Link } from "@inertiajs/react";

export default function Pagination({ links }) {
    return (
        <div className="flex items-center justify-center mt-4 space-x-1">
            {links.map((link) => (
                <Link
                    key={link.label}
                    href={link.url}
                    preserveScroll
                    dangerouslySetInnerHTML={{ __html: link.label }}
                    disabled={!link.url}
                    className={`px-3 py-1 rounded
                        ${link.active
                            ? 'bg-blue-500 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100'}
                        ${link.active
                            ? 'dark:bg-blue-600 dark:text-white'
                            : 'dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'}
                        ${!link.url && 'cursor-not-allowed opacity-50'}`
                    }
                />
            ))}
        </div>
    );
}
