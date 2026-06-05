import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="relative mt-32 overflow-hidden border-t border-(--color-hairline) bg-(--color-ink-2)">
      {/* Faint wordmark watermark */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 select-none"
        aria-hidden
      >
        <img
          src="/wordmark.webp"
          alt=""
          className="mx-auto block w-[min(90vw,1200px)] opacity-[0.05]"
        />
      </div>

      <div className="relative mx-auto max-w-[1230px] px-5 py-14 md:px-8">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo height={48} />
            <p className="mt-5 max-w-[34ch] text-[14px] leading-relaxed text-(--color-bone-soft)">
              Honest lightsabers built for the people who actually wanted one as a kid — and for the people who love them now.
            </p>
          </div>

          <FooterCol title="Shop">
            <FooterLink href="/">All sabers</FooterLink>
            <FooterLink href="/collections/originals">Sabers</FooterLink>
            <FooterLink href="/collections/accessories">Accessories</FooterLink>
          </FooterCol>

          <FooterCol title="Help">
            {/* hidden for now
            <FooterLink href="/pages/operation-guides">Operation guides</FooterLink>
            */}
            <FooterLink href="/pages/contact">Shipping</FooterLink>
            <FooterLink href="/pages/contact">Track order</FooterLink>
            <FooterLink href="/pages/contact">Contact</FooterLink>
          </FooterCol>

          <FooterCol title="Brand">
            <FooterLink href="/pages/brand">Our story</FooterLink>
            <FooterLink href="/products/luna-obi-se#reviews">Reviews</FooterLink>
            <FooterLink href="/blogs/news">Journal</FooterLink>
            <FooterLink href="/pages/contact">Ambassador program</FooterLink>
          </FooterCol>
        </div>

        {/* Payment row */}
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-(--color-hairline) pt-6">
          <p className="text-[11px] uppercase tracking-[0.18em] text-(--color-muted)">
            © {new Date().getFullYear()} Luna Blades · Forged in California
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {[
              { src: "/payment/visa.svg",        alt: "Visa" },
              { src: "/payment/mastercard.svg",  alt: "Mastercard" },
              { src: "/payment/amex.svg",        alt: "American Express" },
              { src: "/payment/discover.svg",    alt: "Discover" },
              { src: "/payment/paypal.svg",      alt: "PayPal" },
              { src: "/payment/apple-pay.svg",   alt: "Apple Pay" },
              { src: "/payment/google-pay.svg",  alt: "Google Pay" },
              { src: "/payment/shop-pay.svg",    alt: "Shop Pay" },
            ].map((p) => (
              <img
                key={p.alt}
                src={p.src}
                alt={p.alt}
                className="h-6 w-auto"
                loading="lazy"
              />
            ))}
          </div>
        </div>

        <p className="mt-4 text-[10px] uppercase tracking-[0.18em] text-(--color-muted-2)">
          Not affiliated with Lucasfilm Ltd. For fans, by fans.
        </p>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="mb-4 font-mono text-[11px] uppercase tracking-[0.22em] text-(--color-bone)">
        {title}
      </h4>
      <ul className="space-y-2.5">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="text-[13px] text-(--color-bone-soft) transition hover:text-(--color-bone)"
      >
        {children}
      </Link>
    </li>
  );
}
