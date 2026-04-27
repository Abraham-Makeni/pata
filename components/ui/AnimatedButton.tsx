'use client'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface AnimatedButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  className?: string
  type?: 'button' | 'submit' | 'reset'
}

const buttonVariants = {
  primary: 'bg-black text-white hover:bg-gray-800',
  secondary: 'bg-gray-100 text-black hover:bg-gray-200',
  outline: 'border border-black text-black hover:bg-black hover:text-white',
  ghost: 'text-black hover:bg-gray-100'
}

const buttonSizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base'
}

export function AnimatedButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className,
  type = 'button',
  ...props
}: AnimatedButtonProps) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        'relative overflow-hidden rounded-xl font-medium transition-all duration-200',
        buttonVariants[variant],
        buttonSizes[size],
        (disabled || loading) && 'opacity-50 cursor-not-allowed',
        className
      )}
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      {...props}
    >
      {/* Ripple effect */}
      <motion.div
        className="absolute inset-0 bg-white opacity-0"
        initial={false}
        animate={loading ? { opacity: 0.1 } : { opacity: 0 }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Loading spinner */}
      {loading && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>
      )}
      
      {/* Button content */}
      <motion.span
        className={cn('relative z-10', loading && 'opacity-0')}
        animate={loading ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.span>
    </motion.button>
  )
}

// Animated card component
interface AnimatedCardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  hover?: boolean
}

export function AnimatedCard({ children, className, onClick, hover = true }: AnimatedCardProps) {
  return (
    <motion.div
      className={cn('rounded-2xl bg-white border border-gray-200', className)}
      whileHover={hover ? { 
        y: -4, 
        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
      } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onClick={onClick}
    >
      {children}
    </motion.div>
  )
}

// Animated icon button
interface AnimatedIconButtonProps {
  icon: React.ReactNode
  onClick?: () => void
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'secondary' | 'ghost'
  disabled?: boolean
  className?: string
  ariaLabel?: string
}

export function AnimatedIconButton({
  icon,
  onClick,
  size = 'md',
  variant = 'ghost',
  disabled = false,
  className,
  ariaLabel
}: AnimatedIconButtonProps) {
  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  const buttonStyles = {
    primary: 'bg-black text-white hover:bg-gray-800',
    secondary: 'bg-gray-100 text-black hover:bg-gray-200',
    ghost: 'text-black hover:bg-gray-100'
  }

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'p-2 rounded-xl transition-all duration-200',
        iconSizes[size],
        buttonStyles[variant],
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      whileHover={!disabled ? { scale: 1.1 } : {}}
      whileTap={!disabled ? { scale: 0.9 } : {}}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      aria-label={ariaLabel}
    >
      {icon}
    </motion.button>
  )
}

// Animated toggle switch
interface AnimatedToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function AnimatedToggle({ checked, onChange, disabled = false, size = 'md' }: AnimatedToggleProps) {
  const toggleSizes = {
    sm: 'w-8 h-4',
    md: 'w-11 h-6',
    lg: 'w-14 h-8'
  }

  const dotSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-6 h-6'
  }

  return (
    <motion.button
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={cn(
        'relative rounded-full transition-colors duration-200',
        toggleSizes[size],
        checked ? 'bg-black' : 'bg-gray-300',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
    >
      <motion.div
        className={cn(
          'absolute top-1 rounded-full bg-white transition-transform duration-200',
          dotSizes[size],
          checked ? (size === 'sm' ? 'left-4' : size === 'md' ? 'left-6' : 'left-7') : 'left-1'
        )}
        layout
      />
    </motion.button>
  )
}
