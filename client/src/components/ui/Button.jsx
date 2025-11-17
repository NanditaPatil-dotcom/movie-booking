import React from 'react'

export function Button({ variant = 'default', size = 'default', children, ...props }) {
  const colors = {
    red: '#BD292C',
    white: '#FFFFFF',
    light: '#D9D9D9',
    gray: '#3F3B3B'
  }

  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    whiteSpace: 'nowrap',
    borderRadius: '9999px',
    fontSize: '0.875rem',
    fontWeight: '600',
    transition: 'all 0.2s',
    border: '1px solid transparent',
    cursor: 'pointer',
    outline: 'none'
  }

  const variantStyles = {
    default: {
      backgroundColor: colors.red,
      color: colors.white,
      borderColor: colors.red
    },
    outline: {
      backgroundColor: colors.white,
      color: colors.red,
      borderColor: colors.red
    },
    secondary: {
      backgroundColor: colors.light,
      color: colors.gray,
      borderColor: '#C8C8C8'
    }
  }

  const sizeStyles = {
    default: {
      height: '2.25rem',
      padding: '0.5rem 1rem'
    },
    sm: {
      height: '2rem',
      padding: '0.25rem 0.75rem',
      fontSize: '0.75rem'
    },
    lg: {
      height: '2.75rem',
      padding: '0.5rem 1.5rem',
      fontSize: '1rem'
    }
  }

  const style = {
    ...baseStyle,
    ...variantStyles[variant],
    ...sizeStyles[size]
  }

  const hoverStyle = (e, isOver) => {
    if (variant === 'default') {
      e.currentTarget.style.backgroundColor = isOver ? '#A72326' : colors.red
      e.currentTarget.style.borderColor = isOver ? '#A72326' : colors.red
    } else if (variant === 'outline') {
      e.currentTarget.style.backgroundColor = isOver ? '#FFF5F5' : colors.white
    }
  }

  return (
    <button
      style={style}
      onMouseEnter={(e) => hoverStyle(e, true)}
      onMouseLeave={(e) => hoverStyle(e, false)}
      {...props}
    >
      {children}
    </button>
  )
}