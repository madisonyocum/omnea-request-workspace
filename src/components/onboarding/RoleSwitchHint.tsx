import { Zap } from 'lucide-react';

const ROLES = [
  { name: 'Requester', description: 'Submitted the request' },
  { name: 'Approver', description: 'Reviews and signs off' },
  { name: 'Admin', description: 'Oversees the workflow' },
];

export function RoleSwitchHint({ onClose }: { onClose: () => void }) {
  return (
    <>
      <button type="button" aria-label="Dismiss" onClick={onClose} className="fixed inset-0 z-40 cursor-default" />
      <div
        role="dialog"
        aria-label="Switch between roles"
        className="animate-fade-in absolute left-0 top-full z-50 mt-[10px] w-max rounded-xl bg-text-primary text-white shadow-popover ring-1 ring-white/10"
      >
        <span className="absolute -top-[5px] left-[34px] size-[10px] rotate-45 rounded-[2px] bg-text-primary" />

        <header className="flex items-center gap-[9px] px-[15px] pb-[7px] pt-[13px]">
          <span className="flex size-[24px] shrink-0 items-center justify-center rounded-[7px] bg-brand-600">
            <Zap className="size-[13px] text-white" strokeWidth={2} fill="currentColor" />
          </span>
          <h2 className="text-[13px] font-medium tracking-[-0.1px]">3 ways to view this prototype</h2>
        </header>

        {/* Two columns so the descriptions line up under each other. */}
        <dl className="grid grid-cols-[auto_1fr] gap-x-[10px] gap-y-[6px] px-[15px] pb-[12px] pt-[6px]">
          {ROLES.map((role) => (
            <div key={role.name} className="contents">
              <dt className="text-[12px] font-medium leading-[1.4] whitespace-nowrap text-white">
                {role.name}
              </dt>
              <dd className="text-[12px] leading-[1.4] whitespace-nowrap text-white/60">
                {role.description}
              </dd>
            </div>
          ))}
        </dl>

        <footer className="px-[15px] pb-[13px] pt-[2px]">
          <button
            type="button"
            onClick={onClose}
            className="w-full cursor-pointer rounded-md bg-white/10 py-[7px] text-[12px] font-medium text-white transition-colors duration-150 hover:bg-white/20"
          >
            Start Exploring
          </button>
        </footer>
      </div>
    </>
  );
}
