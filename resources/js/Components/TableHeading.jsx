export default function TableHeading({
    name,
    children,
    sortable = true,
    sort_field = null,
    sort_direction = null,
    sortChanged = () => { }
}) {
    return (
        <th className='cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition' onClick={(e) => sortChanged(name)}>
            <div className='flex justify-between items-center'>
                {children}
                {sortable && (
                    <div className='flex flex-col gap-1'>
                        <i className={`ri-arrow-drop-up-fill text-base ${sort_field === name && sort_direction === 'asc' ? 'text-blue-500' : ''}`}></i>
                        <i className={`ri-arrow-drop-down-fill text-base -mt-5 ${sort_field === name && sort_direction === 'desc' ? 'text-blue-500' : ''}`}></i>
                    </div>
                )}
            </div>
        </th>
    )
}
