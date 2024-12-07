const ErrorMessage = ({ children }: { children: React.ReactNode }) => {
  return (
    <p className="text-xs text-red-600 dark:text-red-400" role="alert">
      {children}
    </p>
  )
}

export default ErrorMessage
