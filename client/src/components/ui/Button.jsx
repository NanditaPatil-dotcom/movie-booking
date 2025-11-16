import React from 'react'

export function Button({ variant = 'default', size = 'default', children, ...props }) {
  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    whiteSpace: 'nowrap',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    transition: 'all 0.2s',
    border: 'none',
    cursor: 'pointer',
    outline: 'none'
  }

  const variantStyles = {
    default: {
      backgroundColor: '#fbbf24',
      color: '#1f2937',
      border: '1px solid #fbbf24'
    },
    outline: {
      backgroundColor: 'transparent',
      color: '#fbbf24',
      border: '1px solid #fbbf24'
    },
    secondary: {
      backgroundColor: '#374151',
      color: '#f9fafb'
    }
  }

  const sizeStyles = {
    default: {
      height: '2.25rem',
      padding: '0.5rem 1rem'
    },
    sm: {
      height: '2rem',
      padding: '0.5rem 0.75rem',
      fontSize: '0.75rem'
    },
    lg: {
      height: '2.5rem',
      padding: '0.5rem 1.5rem'
    }
  }

  const style = {
    ...baseStyle,
    ...variantStyles[variant],
    ...sizeStyles[size]
  }

  return (
    <button style={style} {...props}>
      {children}
    </button>
  )
}