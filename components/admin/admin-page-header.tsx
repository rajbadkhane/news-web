import { BellRing } from "lucide-react";

export function AdminPageHeader({
  title,
  subtitle,
  actions
}: {
  title: string;
  subtitle: string;
  actions?: React.ReactNode;
}) {
  return (
    <header className="rounded-[28px] border border-[#d9c6a8] bg-[#fff9f0] p-6 shadow-[0_14px_34px_rgba(88,60,32,0.08)]">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#b86b2f]">
            एडमिन पैनल
          </p>
          <h2 className="mt-2 font-serif text-4xl font-bold text-[#17344a]">{title}</h2>
          <p className="mt-2 max-w-3xl text-[15px] leading-7 text-[#5f4e40]">{subtitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-3 rounded-full bg-[#edf5f4] px-4 py-3 text-sm text-[#17344a]">
            Welcome, Editor User (EDITOR)
          </div>
          <button className="inline-flex items-center gap-2 rounded-full bg-[#17344a] px-4 py-3 text-sm font-semibold text-white">
            <BellRing size={16} />
            Notifications
          </button>
          {actions}
        </div>
      </div>
    </header>
  );
}
