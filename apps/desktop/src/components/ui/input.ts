type InputOptions = {
  value?: string;
  placeholder?: string;
  className?: string;
  readonly?: boolean;
};

export function renderInput({
  value = '',
  placeholder = '',
  className = '',
  readonly = false,
}: InputOptions = {}): string {
  const classes = ['ui-input', className].filter(Boolean).join(' ');
  const readonlyAttr = readonly ? ' readonly' : '';

  return `<input data-ui="input" class="${classes}" value="${value}" placeholder="${placeholder}"${readonlyAttr} />`;
}
