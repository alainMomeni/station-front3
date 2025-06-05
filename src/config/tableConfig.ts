export const tableConfig = {
  container: {
    wrapper: "bg-white p-4 md:p-6 rounded-lg shadow-md",
    tableWrapper: "overflow-x-auto",
    table: "min-w-full divide-y divide-gray-200 text-sm"
  },
  header: {
    wrapper: "bg-gray-50",
    cell: {
      base: "px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap",
      center: "px-4 py-3 text-center font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap",
      right: "px-4 py-3 text-right font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap",
      responsive: {
        hidden: {
          md: "hidden md:table-cell",
          lg: "hidden lg:table-cell",
          sm: "hidden sm:table-cell"
        }
      }
    }
  },
  body: {
    wrapper: "bg-white divide-y divide-gray-200",
    row: {
      base: "hover:bg-purple-50/30",
      selected: "bg-purple-50"
    },
    cell: {
      base: "px-4 py-3 whitespace-nowrap",
      text: {
        primary: "font-medium text-gray-900",
        secondary: "text-gray-500",
        small: "text-xs text-gray-500"
      },
      center: "text-center",
      right: "text-right",
      responsive: {
        hidden: {
          md: "hidden md:table-cell",
          lg: "hidden lg:table-cell",
          sm: "hidden sm:table-cell"
        }
      }
    }
  },
  actions: {
    wrapper: "space-x-2 text-xs",
    button: {
      edit: "text-indigo-600 hover:text-indigo-900",
      delete: "text-red-600 hover:text-red-900",
      generic: "text-purple-600 hover:text-purple-800"
    }
  },
  empty: {
    wrapper: "text-center px-6 py-10 text-gray-500 italic"
  },
  pagination: {
    wrapper: "px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6",
    button: {
      base: "relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md",
      active: "bg-purple-600 text-white border-purple-600 hover:bg-purple-700",
      inactive: "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
    }
  }
};