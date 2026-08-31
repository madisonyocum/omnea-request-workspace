import { cn } from '@/lib/cn';
import type { Person } from '@/domain/types';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const SIZES: Record<AvatarSize, string> = {
  xs: 'size-[18px] text-[9px]',
  sm: 'size-[20px] text-[8px]',
  md: 'size-[24px] text-[9px]',
  lg: 'size-[28px] text-[10px] tracking-[0.5px]',
  xl: 'size-[30px] text-[10px] tracking-[0.5px]',
};

interface AvatarProps {
  person: Person;
  size?: AvatarSize;
  ringed?: boolean;
  className?: string;
}

export function Avatar({ person, size = 'sm', ringed = false, className }: AvatarProps) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 select-none items-center justify-center rounded-full font-semibold leading-none text-white',
        SIZES[size],
        ringed && 'ring-2 ring-surface-card',
        className,
      )}
      style={{ backgroundColor: person.colour }}
      title={person.name}
    >
      {person.initials}
    </span>
  );
}

interface AvatarStackProps {
  people: Person[];
  size?: AvatarSize;
}

export function AvatarStack({ people, size = 'md' }: AvatarStackProps) {
  return (
    <div className="flex items-center">
      {people.map((p, index) => (
        <Avatar
          key={p.id}
          person={p}
          size={size}
          ringed
          className={cn(
            'transition-transform duration-150 hover:-translate-y-0.5',
            index > 0 && '-ml-[6px]',
          )}
        />
      ))}
    </div>
  );
}
