export const metadata = { title: "Contact — Luna Blades" };

export default function ContactPage() {
  return (
    <article className="px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto grid max-w-[1230px] gap-14 md:grid-cols-2 md:gap-20">
        <div>
          <p className="eyebrow">Reach a human</p>
          <h1 className="h-display mt-5 text-[44px] leading-[0.95] md:text-[72px]">
            Write to us.
            <span className="block text-(--color-blue)">We'll write back.</span>
          </h1>
          <p className="mt-7 max-w-[44ch] text-[15px] leading-relaxed text-(--color-bone-soft)">
            Most messages get an answer the same day. We read every one — there's no chatbot in front of the door.
          </p>
          <dl className="mt-10 space-y-5 text-[14px]">
            <div className="border-t border-(--color-hairline) pt-5">
              <dt className="text-[10px] uppercase tracking-[0.22em] text-(--color-muted)">Email</dt>
              <dd className="mt-2 font-display text-[20px]">hello@lunablades.com</dd>
            </div>
            <div className="border-t border-(--color-hairline) pt-5">
              <dt className="text-[10px] uppercase tracking-[0.22em] text-(--color-muted)">Hours</dt>
              <dd className="mt-2 font-display text-[20px]">Mon–Fri · 09:00–17:00 PT</dd>
            </div>
            <div className="border-t border-(--color-hairline) pt-5">
              <dt className="text-[10px] uppercase tracking-[0.22em] text-(--color-muted)">Workshop</dt>
              <dd className="mt-2 font-display text-[20px]">Long Beach, California</dd>
            </div>
          </dl>
        </div>

        <form className="space-y-5">
          <Field label="Your name" name="name" />
          <Field label="Email" name="email" type="email" />
          <Field label="Order number (optional)" name="order" />
          <div>
            <label className="text-[10px] uppercase tracking-[0.22em] text-(--color-muted)">Message</label>
            <textarea
              rows={6}
              className="mt-2 w-full rounded-md border border-(--color-hairline-strong) bg-(--color-ink-2) p-4 text-[14px] text-(--color-bone) outline-none transition focus:border-(--color-blue)"
            />
          </div>
          <button type="submit" className="btn btn-primary w-full">Send message</button>
          <p className="text-[11px] text-(--color-muted)">
            By sending, you agree we can email you back. We don't add you to any list.
          </p>
        </form>
      </div>
    </article>
  );
}

function Field({ label, name, type = "text" }: { label: string; name: string; type?: string }) {
  return (
    <div>
      <label className="text-[10px] uppercase tracking-[0.22em] text-(--color-muted)" htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        className="mt-2 w-full rounded-md border border-(--color-hairline-strong) bg-(--color-ink-2) p-3 text-[14px] text-(--color-bone) outline-none transition focus:border-(--color-blue)"
      />
    </div>
  );
}
