export function RoleSwitchHint({ onClose }: { onClose: () => void }) {
  return (
    <>
      <button type="button" aria-label="Dismiss" onClick={onClose} className="fixed inset-0 z-40 cursor-default" />
      <div
        role="dialog"
        aria-label="Switch between roles"
        className="animate-fade-in absolute right-0 top-full z-50 mt-[12px] w-[280px] rounded-xl bg-text-primary p-[16px] text-white shadow-popover"
      >
        <span className="absolute -top-[6px] right-[28px] size-[12px] rotate-45 bg-text-primary" />
        <p className="text-[13px] font-medium">Three ways to view this request</p>
        <ul className="mt-[10px] flex flex-col gap-[8px]">
          <li className="text-[12px] leading-[1.45] text-white/75">
            <span className="font-medium text-white">Requester</span> — the person who submitted it.
          </li>
          <li className="text-[12px] leading-[1.45] text-white/75">
            <span className="font-medium text-white">Approver</span> — reviews and signs off each stage.
          </li>
          <li className="text-[12px] leading-[1.45] text-white/75">
            <span className="font-medium text-white">Admin</span> — oversees the whole workflow.
          </li>
        </ul>
        <button
          type="button"
          onClick={onClose}
          className="mt-[14px] w-full cursor-pointer rounded-md bg-white/10 py-[7px] text-[12px] font-medium text-white transition-colors duration-120 hover:bg-white/15"
        >
          Got it
        </button>
      </div>
    </>
  );
}
