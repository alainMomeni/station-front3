/**
 * Design System Configuration - VERSION CORRIGÉE
 * Configuration centralisée pour maintenir la cohérence visuelle
 */

export const colors = {
  primary: {
    50: 'purple-50',
    100: 'purple-100',
    200: 'purple-200',
    300: 'purple-300',
    400: 'purple-400',
    500: 'purple-500',
    600: 'purple-600',
    700: 'purple-700',
    800: 'purple-800',
    900: 'purple-900',
  },
  gray: {
    50: 'gray-50',
    100: 'gray-100',
    200: 'gray-200',
    300: 'gray-300',
    400: 'gray-400',
    500: 'gray-500',
    600: 'gray-600',
    700: 'gray-700',
    800: 'gray-800',
    900: 'gray-900',
  },
  success: {
    50: 'green-50',
    100: 'green-100',
    600: 'green-600',
    700: 'green-700',
    800: 'green-800',
  },
  warning: {
    50: 'yellow-50',
    100: 'yellow-100',
    400: 'yellow-400',
    600: 'yellow-600',
    800: 'yellow-800',
  },
  error: {
    50: 'red-50',
    100: 'red-100',
    300: 'red-300',
    500: 'red-500',
    600: 'red-600',
    800: 'red-800',
  },
  info: {
    50: 'blue-50',
    100: 'blue-100',
    200: 'blue-200',
    600: 'blue-600',
    700: 'blue-700',
    800: 'blue-800',
  }
} as const;

export const spacing = {
  xs: '1',
  sm: '2',
  md: '4',
  lg: '6',
  xl: '8',
  '2xl': '12',
  '3xl': '16',
} as const;

export const borderRadius = {
  sm: 'rounded-lg',
  md: 'rounded-xl',
  lg: 'rounded-2xl',
  xl: 'rounded-3xl',
  full: 'rounded-full',
} as const;

export const shadows = {
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
} as const;

// Configuration des composants Input - CLASSES COMPLÈTES
export const inputStyles = {
  base: `w-full transition-all duration-200 text-sm focus:outline-none`,
  
  variants: {
    default: `px-4 py-3 border rounded-xl bg-white border-gray-300 hover:border-gray-400 focus:ring-4 focus:ring-purple-100 focus:border-purple-500`,
    compact: `px-3 py-2 border rounded-lg bg-white border-gray-300 hover:border-purple-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500`,
    filled: `px-4 py-3 rounded-xl bg-gray-50 border-2 border-transparent hover:bg-gray-100 focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-100`,
  },
  
  states: {
    disabled: `bg-gray-50 border-gray-200 text-gray-600 cursor-not-allowed`,
    error: `border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500`,
    success: `border-green-600 bg-green-50 focus:ring-green-600 focus:border-green-600`,
  }
} as const;

// Configuration des boutons - CLASSES COMPLÈTES
export const buttonStyles = {
  base: `inline-flex items-center justify-center font-medium transition-all duration-200 transform focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed`,
  
  sizes: {
    sm: `px-3 py-2 text-sm rounded-lg`,
    md: `px-4 py-2 text-sm rounded-xl`,
    lg: `px-6 py-3 text-sm rounded-xl`,
    xl: `px-8 py-4 text-base rounded-2xl`,
  },
  
  variants: {
    primary: `bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg hover:from-purple-700 hover:to-purple-800 hover:scale-105 active:scale-95`,
    secondary: `bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400`,
    success: `bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg hover:from-green-700 hover:to-green-800 hover:scale-105`,
    warning: `bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-800 shadow-md hover:scale-105`,
    danger: `bg-gradient-to-r from-red-600 to-red-600 text-white shadow-lg hover:bg-red-800 hover:scale-105`,
    ghost: `text-gray-700 hover:bg-gray-100`,
    link: `text-purple-600 hover:text-purple-700 hover:underline p-0`,
  }
} as const;

// Configuration des tables - CLASSES COMPLÈTES
export const tableStyles = {
  container: `overflow-x-auto`,
  table: `w-full text-sm`,
  
  header: {
    base: `bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200`,
    cell: `px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider`,
  },
  
  body: {
    base: `bg-white divide-y divide-gray-200`,
    row: {
      default: `hover:bg-purple-50 transition-colors duration-150`,
      selected: `bg-purple-100`,
      disabled: `opacity-50`,
    },
    cell: `px-6 py-4 whitespace-nowrap`,
  }
} as const;

// Configuration des cartes - CLASSES COMPLÈTES
export const cardStyles = {
  base: `bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden`,
  
  header: {
    base: `bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4`,
    title: `flex items-center text-white`,
    icon: `mr-3 text-xl`,
    text: `text-lg font-semibold`,
  },
  
  content: `p-6`,
  
  variants: {
    default: ``,
    elevated: `shadow-xl border-0`,
    bordered: `border-2 border-gray-200`,
    gradient: `bg-gradient-to-br from-white to-gray-50`,
  }
} as const;

// Configuration des badges/status - CLASSES COMPLÈTES
export const badgeStyles = {
  base: `inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full`,
  
  variants: {
    success: `bg-green-100 text-green-800`,
    warning: `bg-yellow-100 text-yellow-800`,
    error: `bg-red-100 text-red-800`,
    info: `bg-blue-100 text-blue-800`,
    neutral: `bg-gray-100 text-gray-800`,
    primary: `bg-purple-100 text-purple-800`,
  }
} as const;

// Configuration des messages/alertes - CLASSES COMPLÈTES
export const alertStyles = {
  base: `p-4 rounded-xl flex items-start text-sm shadow-md`,
  
  variants: {
    success: `bg-green-50 text-green-800 border-l-4 border-green-600`,
    warning: `bg-yellow-50 text-yellow-800 border-l-4 border-yellow-400`,
    error: `bg-red-50 text-red-800 border-l-4 border-red-600`,
    info: `bg-blue-50 text-blue-800 border-l-4 border-blue-600`,
  }
} as const;

// Configuration des formulaires - CLASSES COMPLÈTES
export const formStyles = {
  fieldGroup: `space-y-4`,
  fieldRow: `grid grid-cols-1 md:grid-cols-2 gap-6`,
  
  label: {
    base: `block text-sm font-medium text-gray-700 mb-2`,
    required: `after:content-['*'] after:text-red-500 after:ml-1`,
  },
  
  helpText: `text-xs text-gray-500 mt-1`,
  errorText: `text-xs text-red-600 mt-1 flex items-center`,
  
  fieldset: `space-y-6 p-6 border border-gray-200 rounded-2xl`,
  legend: `text-lg font-semibold text-gray-800 px-2`,
} as const;

// Configuration des modales/overlays - CLASSES COMPLÈTES
export const modalStyles = {
  overlay: `fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4`,
  container: `bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden`,
  
  header: `px-6 py-4 border-b border-gray-200 flex items-center justify-between`,
  title: `text-lg font-semibold text-gray-800`,
  
  content: `p-6 overflow-y-auto`,
  
  footer: `px-6 py-4 border-t border-gray-200 flex justify-end space-x-3 bg-gray-50`,
} as const;

// Configuration de la pagination - CLASSES COMPLÈTES
export const paginationStyles = {
  container: `bg-white px-4 py-4 border-t border-gray-200`,
  wrapper: `flex flex-col sm:flex-row items-center justify-between gap-4`,
  
  info: `flex flex-col sm:flex-row items-center gap-4`,
  infoText: `text-sm text-gray-700`,
  
  select: `px-3 py-1 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent`,
  
  controls: `flex items-center space-x-1`,
  
  button: {
    base: `p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed`,
    page: `px-3 py-2 text-sm font-medium rounded-xl transition-colors`,
    active: `bg-purple-600 text-white`,
    inactive: `text-gray-700 hover:bg-gray-100`,
    disabled: `text-gray-400 cursor-not-allowed`,
  }
} as const;

// Utilitaires pour combiner les classes
export const cn = (...classes: (string | undefined | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

// Helper pour construire les classes dynamiquement
export const buildClass = (base: string, variants: Record<string, string> = {}, conditions: Record<string, boolean> = {}): string => {
  const classes = [base];
  
  Object.entries(variants).forEach(([key, value]) => {
    if (conditions[key]) {
      classes.push(value);
    }
  });
  
  return cn(...classes);
};