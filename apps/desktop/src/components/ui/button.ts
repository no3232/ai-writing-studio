type ButtonOptions = {
  label: string;
  className?: string;
  variant?: 'default' | 'secondary' | 'ghost';
  type?: 'button' | 'submit';
};

export function renderButton({
  label,
  className = '',
  variant = 'default',
  type = 'button',
}: ButtonOptions): string {
  const classes = ['ui-button', `ui-button--${variant}`, className].filter(Boolean).join(' ');

  return `<button data-ui="button" class="${classes}" type="${type}">${label}</button>`;
}
