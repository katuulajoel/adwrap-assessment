'use client';

interface DeleteButtonProps {
  onClick: () => void;
  className?: string;
  iconOnly?: boolean;
  disabled?: boolean;
  label?: string;
}

export function DeleteButton({
  onClick,
  className = '',
  iconOnly = false,
  disabled = false,
  label = 'Delete',
}: DeleteButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`text-red-600 hover:text-red-800 disabled:text-red-300 disabled:cursor-not-allowed ${
        !iconOnly && 'flex items-center'
      } ${className}`}
      aria-label={label}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`h-4 w-4 ${!iconOnly && 'mr-1'}`}
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
      {!iconOnly && <span>{label}</span>}
    </button>
  );
}
