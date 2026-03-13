type CardOptions = {
  title?: string;
  description?: string;
  content?: string;
  className?: string;
  contentClassName?: string;
};

export function renderCard({
  title,
  description,
  content = '',
  className = '',
  contentClassName = '',
}: CardOptions = {}): string {
  const classes = ['ui-card', className].filter(Boolean).join(' ');
  const bodyClasses = ['ui-card__content', contentClassName].filter(Boolean).join(' ');

  return [
    `<section data-ui="card" class="${classes}">`,
    title || description
      ? [
          '<div class="ui-card__header">',
          title ? `<h2 class="ui-card__title">${title}</h2>` : '',
          description ? `<p class="ui-card__description">${description}</p>` : '',
          '</div>',
        ].join('')
      : '',
    `<div class="${bodyClasses}">${content}</div>`,
    '</section>',
  ].join('');
}
