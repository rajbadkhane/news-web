import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BadgeCheck, Globe2, Phone } from "lucide-react";

const CONTACT_NUMBER = "9098959811";

export function SiteFooter() {
  return (
    <footer className="rounded-b-[28px] bg-[radial-gradient(circle_at_top_left,rgba(255,180,95,0.16),transparent_28%),linear-gradient(90deg,#122b3a_0%,#173f51_44%,#6e4528_100%)] px-4 py-8 text-[#fff2df] md:px-6 lg:px-8">
      <div className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0.02)_100%)] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.18)] md:p-7">
        <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr_0.85fr]">
          <div>
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f6e6cf]">
                <Image
                  src="/images/logo.png"
                  alt="जीत अपडेट लोगो"
                  width={40}
                  height={40}
                  className="h-10 w-10 object-contain"
                />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[#ffb45f]">जीत अपडेट न्यूज़</p>
                <h3 className="font-serif text-[28px] text-white">विश्वसनीय हिंदी कवरेज</h3>
              </div>
            </div>

            <p className="mt-5 max-w-[680px] text-[15px] leading-7 text-[#fce8d2]">
              तेज़ अपडेट, साफ पढ़ने लायक लेआउट और category-wise structured browsing के साथ
              desktop और mobile दोनों पर बेहतर newsroom experience।
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              {[
                "Live Categories",
                "Responsive Layout",
                "Hindi First",
                "Fast Updates"
              ].map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-[#fff2df]"
                >
                  <BadgeCheck size={14} className="text-[#ffb45f]" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#ffb45f]">Quick Access</p>
            <div className="mt-5 grid gap-3">
              {[
                { label: "होम पेज", href: "/" },
                { label: "सभी श्रेणियां", href: "/" },
                { label: "ताज़ा अपडेट", href: "/" }
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href as Route}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-[#fff2df] transition hover:bg-white/10"
                >
                  <span>{item.label}</span>
                  <ArrowUpRight size={16} className="text-[#ffb45f]" />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#ffb45f]">Contact Desk</p>
            <div className="mt-5 rounded-[26px] border border-white/10 bg-black/10 p-5">
              <div className="flex items-center gap-3 text-[#ffe0b9]">
                <Phone size={18} />
                <span className="text-sm font-semibold">Newsroom Helpline</span>
              </div>
              <a
                href={`tel:+91${CONTACT_NUMBER}`}
                className="mt-3 block font-serif text-[30px] text-white"
              >
                {CONTACT_NUMBER}
              </a>
              <p className="mt-3 text-sm leading-6 text-[#fce8d2]">
                खबर, विज्ञापन, अपडेट या coverage assistance के लिए संपर्क करें।
              </p>
              <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/8 px-3 py-2 text-sm text-[#fff2df]">
                <Globe2 size={15} className="text-[#ffb45f]" />
                Home page floating actions enabled
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-4 text-sm text-[#fce8d2]/85 md:flex md:items-center md:justify-between">
          <p>Jeet Update News. Clean browsing, category pages, and direct contact access.</p>
          <p className="mt-2 md:mt-0">Built for mobile-first reading and fast article discovery.</p>
        </div>
      </div>
    </footer>
  );
}
