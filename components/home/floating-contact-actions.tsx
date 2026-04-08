import { MessageCircle, PhoneCall } from "lucide-react";

const CONTACT_NUMBER = "9098959811";
const WHATSAPP_NUMBER = "919098959811";

export function FloatingContactActions() {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 px-4 md:bottom-6">
      <div className="mx-auto flex max-w-[1560px] items-end justify-between">
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}`}
          target="_blank"
          rel="noreferrer"
          className="pointer-events-auto inline-flex items-center gap-3 rounded-full border border-[#126c37] bg-[#22c55e] px-4 py-3 text-sm font-semibold text-[#082412] shadow-[0_16px_35px_rgba(22,163,74,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_38px_rgba(22,163,74,0.42)] md:px-5"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
            <MessageCircle size={18} />
          </span>
          <span className="hidden sm:inline">WhatsApp</span>
        </a>

        <a
          href={`tel:+91${CONTACT_NUMBER}`}
          className="pointer-events-auto inline-flex items-center gap-3 rounded-full border border-[#c8812d] bg-[#ffb45f] px-4 py-3 text-sm font-semibold text-[#3d220c] shadow-[0_16px_35px_rgba(255,180,95,0.3)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_38px_rgba(255,180,95,0.38)] md:px-5"
        >
          <span className="hidden sm:inline">Call</span>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/25">
            <PhoneCall size={18} />
          </span>
        </a>
      </div>
    </div>
  );
}
