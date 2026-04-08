import Link from "next/link";
import type { Route } from "next";

export function LogoutPanel() {
  return (
    <section className="rounded-[28px] border border-[#dcc6a4] bg-[#fff9f0] p-8 shadow-[0_14px_34px_rgba(88,60,32,0.08)]">
      <h3 className="font-serif text-4xl font-bold text-[#17344a]">सेशन कंट्रोल</h3>
      <p className="mt-4 max-w-2xl text-[16px] leading-8 text-[#605143]">
        यह page logout workflow ke liye रखा गया है। Actual auth अभी integrated नहीं है, इसलिए
        फिलहाल यह safe exit screen की तरह काम करेगा। बाद में token/session integration इसी route से जोड़ा जा सकता है।
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href={"/admin" as Route}
          className="rounded-2xl bg-[#17344a] px-5 py-3 text-sm font-semibold text-white"
        >
          डैशबोर्ड पर वापस जाएं
        </Link>
        <button className="rounded-2xl bg-[#b2553c] px-5 py-3 text-sm font-semibold text-white">
          Logout Session
        </button>
      </div>
    </section>
  );
}
