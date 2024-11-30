import Button from '@/components/ui/button';
import Scrollbar from '@/components/ui/scrollbar';
import {
  useTable,
  useResizeColumns,
  useFlexLayout,
  // useSortBy,
  usePagination,
  useGlobalFilter,
} from 'react-table';

// import icons
// import { ChevronDown } from '@/components/icons/chevron-down';
import { LongArrowRight } from '@/components/icons/long-arrow-right';
import { LongArrowLeft } from '@/components/icons/long-arrow-left';

function InvestmentAccordionTable({
  // @ts-ignore
  columns,
  // @ts-ignore
  data,
}) {
  const {
    getTableProps,
    getTableBodyProps,
    canPreviousPage,
    canNextPage,
    pageOptions,
    state,
    // setGlobalFilter,
    headerGroups,
    page,
    nextPage,
    previousPage,
    prepareRow,
  } = useTable(
    {
      // @ts-ignore
      columns,
      // @ts-ignore
      data,
      initialState: { pageSize: 17 },
    },
    useGlobalFilter,
    // useSortBy,
    useResizeColumns,
    useFlexLayout,
    usePagination,
  );
  const { pageIndex } = state;
  //   const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative flex flex-col overflow-hidden lg:-ms-4 lg:flex-row">
      <div className="w-full transform transition duration-300 ease-in">
        <Scrollbar style={{ width: '100%' }} autoHide="never">
          <div className="relative z-10">
            <table
              {...getTableProps()}
              className="-mt-[2px] w-full border-separate border-0"
            >
              <thead className="block bg-white text-sm text-gray-500 dark:bg-light-dark dark:text-gray-300">
                {headerGroups.map((headerGroup, idx) => (
                  <tr {...headerGroup.getHeaderGroupProps()} key={idx}>
                    {headerGroup.headers.map((column, idx) => (
                      <th
                        {...column
                          .getHeaderProps
                          // column.getSortByToggleProps()
                          ()}
                        key={idx}
                        className={`group px-3 py-5 font-normal`}
                      >
                        <div className="flex items-center justify-center">
                          {column.render('Header')}
                          {column.canResize && (
                            <div
                              {...column.getResizerProps()}
                              className={`resizer ${
                                column.isResizing ? 'isResizing' : ''
                              }`}
                            />
                          )}
                          {/* <span className="ltr:ml-1 rtl:mr-1">
                              {column.isSorted ? (
                                column.isSortedDesc ? (
                                  <ChevronDown />
                                ) : (
                                  <ChevronDown className="rotate-180" />
                                )
                              ) : (
                                <ChevronDown className="rotate-180 opacity-0 transition group-hover:opacity-50" />
                              )}
                            </span> */}
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody
                {...getTableBodyProps()}
                className="grid text-xs font-medium text-gray-900  dark:bg-light-dark dark:text-white 3xl:text-sm"
              >
                {page.map((row, idx) => {
                  prepareRow(row);
                  return (
                    <tr
                      {...row.getRowProps()}
                      key={idx + 1}
                      className="items-center rounded py-3 uppercase transition-all last:mb-0 dark:bg-light-dark hover:dark:bg-gray-700 xl:py-4"
                      // onClick={() => setIsOpen(!isOpen)}
                    >
                      {row.cells.map((cell, idx) => {
                        return (
                          <td
                            {...cell.getCellProps()}
                            key={idx}
                            className={`flex items-center px-3 text-center tracking-[1px]`}
                          >
                            {cell.render('Cell')}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Scrollbar>
        <div
          className={`-mt-[2px] flex items-center justify-center rounded-bl-lg rounded-br-lg bg-white px-4 py-4 text-sm shadow-card dark:bg-light-dark lg:py-6`}
        >
          <div className="flex items-center gap-5">
            <Button
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
              title="Previous"
              shape="circle"
              variant="transparent"
              size="small"
              className="text-gray-700 disabled:text-gray-400 dark:text-white disabled:dark:text-gray-400"
            >
              <LongArrowLeft className="h-auto w-4 rtl:rotate-180" />
            </Button>
            <div>
              Page{' '}
              <strong className="font-semibold">
                {pageIndex + 1} of {pageOptions.length}
              </strong>{' '}
            </div>
            <Button
              onClick={() => nextPage()}
              disabled={!canNextPage}
              title="Next"
              shape="circle"
              variant="transparent"
              size="small"
              className="text-gray-700 disabled:text-gray-400 dark:text-white disabled:dark:text-gray-400"
            >
              <LongArrowRight className="h-auto w-4 rtl:rotate-180" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InvestmentAccordionTable;
