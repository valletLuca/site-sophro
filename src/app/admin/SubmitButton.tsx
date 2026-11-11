'use client';

import type { ComponentProps } from 'react';
import { useFormStatus } from 'react-dom';

export function SubmitButton({ children, ...props }: ComponentProps<'button'>) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} aria-busy={pending} {...props} className={`${props.className ?? ''} disabled:opacity-60 disabled:cursor-wait`}>
      {pending ? 'Envoi…' : children}
    </button>
  );
}
