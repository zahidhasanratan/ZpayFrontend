import { FormEvent, useMemo, useState } from "react";
import toast from "react-hot-toast";

type FormState = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  consent: boolean;
  // honeypot—bots will fill this; humans won't see it
  website?: string;
};

type Errors = Partial<Record<keyof FormState, string>>;

const SUBJECTS = [
  "General inquiry",
  "Account & KYC",
  "Pricing & plans",
  "Merchant/Agent onboarding",
  "Technical issue / bug",
];

const isEmail = (v: string) => /^\S+@\S+\.\S+$/.test(v.trim());
const isPhone = (v: string) =>
  v.trim() === "" || /^[\d\s()+\-]{6,20}$/.test(v.trim());

export default function Contact() {
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    subject: SUBJECTS[0],
    message: "",
    consent: false,
    website: "", // honeypot
  });

  const errors: Errors = useMemo(() => {
    const e: Errors = {};
    if (!form.name.trim()) e.name = "Please enter your name.";
    if (!isEmail(form.email)) e.email = "Enter a valid email address.";
    if (!isPhone(form.phone)) e.phone = "Enter a valid phone number.";
    if (!form.message.trim()) e.message = "Tell us a bit about your request.";
    if (!form.consent) e.consent = "Please accept the consent checkbox.";
    return e;
  }, [form]);

  const canSubmit =
    !loading && Object.keys(errors).length === 0 && (form.website ?? "") === ""; // honeypot must be empty

  const markTouched = (k: keyof FormState) =>
    setTouched((t) => ({ ...t, [k]: true }));

  const onChange =
    (k: keyof FormState) =>
    (
      e:
        | React.ChangeEvent<HTMLInputElement>
        | React.ChangeEvent<HTMLTextAreaElement>
        | React.ChangeEvent<HTMLSelectElement>
    ) => {
      const value =
        e.currentTarget.type === "checkbox"
          ? (e.currentTarget as HTMLInputElement).checked
          : e.currentTarget.value;
      setForm((f) => ({ ...f, [k]: value as never }));
    };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // If the honeypot is filled, silently accept and bail.
    if ((form.website ?? "").length > 0) {
      toast.success("Thanks! We’ll be in touch.");
      (e.target as HTMLFormElement).reset();
      return;
    }

    // If validation fails, reveal errors and stop.
    if (!canSubmit) {
      setTouched({
        name: true,
        email: true,
        phone: true,
        subject: true,
        message: true,
        consent: true,
      });
      toast.error("Please fix the highlighted fields.");
      return;
    }

    setLoading(true);
    const payload = {
      ...form,
      submittedAt: new Date().toISOString(),
      userAgent: navigator.userAgent,
    };

    // Simulate network submit
    setTimeout(() => {
      setLoading(false);
      toast.success("Message sent — we'll get back to you shortly.");
      console.log("Contact inquiry payload:", payload);

      // Reset form
      setForm({
        name: "",
        email: "",
        phone: "",
        subject: SUBJECTS[0],
        message: "",
        consent: false,
        website: "",
      });
      setTouched({});
      (e.target as HTMLFormElement).reset();
    }, 750);
  };

  const charMax = 800;
  const charLeft = charMax - form.message.length;

  const fieldBase =
    "mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2";
  const labelCls = "block text-sm font-medium";
  const errCls = "text-xs text-red-600 mt-1";

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-extrabold mb-2">Contact us</h1>
        <p className="text-gray-600">
          Have a question about NovaPay or need help with your wallet? Send us a
          note—this is a simulated submission for now.
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="mt-8 max-w-2xl rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
        noValidate
      >
        {/* honeypot (hidden from users) */}
        <div className="hidden">
          <label>
            Leave this field empty
            <input
              name="website"
              value={form.website}
              onChange={onChange("website")}
              tabIndex={-1}
              autoComplete="off"
            />
          </label>
        </div>

        {/* Name */}
        <div className="mb-4">
          <label className={labelCls} htmlFor="name">
            Name
          </label>
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={onChange("name")}
            onBlur={() => markTouched("name")}
            className={`${fieldBase} border-gray-300 focus:ring-indigo-600 ${
              touched.name && errors.name ? "border-red-500 ring-red-200" : ""
            }`}
            aria-invalid={!!(touched.name && errors.name)}
            aria-describedby={
              touched.name && errors.name ? "name-err" : undefined
            }
            required
          />
          {touched.name && errors.name && (
            <p id="name-err" className={errCls}>
              {errors.name}
            </p>
          )}
        </div>

        {/* Email + Phone */}
        <div className="mb-4 grid md:grid-cols-2 gap-4">
          <div>
            <label className={labelCls} htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={form.email}
              onChange={onChange("email")}
              onBlur={() => markTouched("email")}
              className={`${fieldBase} border-gray-300 focus:ring-indigo-600 ${
                touched.email && errors.email
                  ? "border-red-500 ring-red-200"
                  : ""
              }`}
              aria-invalid={!!(touched.email && errors.email)}
              aria-describedby={
                touched.email && errors.email ? "email-err" : undefined
              }
              required
            />
            {touched.email && errors.email && (
              <p id="email-err" className={errCls}>
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label className={labelCls} htmlFor="phone">
              Phone (optional)
            </label>
            <input
              id="phone"
              name="phone"
              value={form.phone}
              onChange={onChange("phone")}
              onBlur={() => markTouched("phone")}
              className={`${fieldBase} border-gray-300 focus:ring-indigo-600 ${
                touched.phone && errors.phone
                  ? "border-red-500 ring-red-200"
                  : ""
              }`}
              aria-invalid={!!(touched.phone && errors.phone)}
              aria-describedby={
                touched.phone && errors.phone ? "phone-err" : undefined
              }
            />
            {touched.phone && errors.phone && (
              <p id="phone-err" className={errCls}>
                {errors.phone}
              </p>
            )}
          </div>
        </div>

        {/* Subject */}
        <div className="mb-4">
          <label className={labelCls} htmlFor="subject">
            Subject
          </label>
          <select
            id="subject"
            name="subject"
            value={form.subject}
            onChange={onChange("subject")}
            onBlur={() => markTouched("subject")}
            className={`${fieldBase} border-gray-300 focus:ring-indigo-600`}
            aria-label="Inquiry subject"
          >
            {SUBJECTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Message */}
        <div className="mb-4">
          <label className={labelCls} htmlFor="message">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            maxLength={charMax}
            value={form.message}
            onChange={onChange("message")}
            onBlur={() => markTouched("message")}
            className={`${fieldBase} border-gray-300 focus:ring-indigo-600 ${
              touched.message && errors.message
                ? "border-red-500 ring-red-200"
                : ""
            }`}
            aria-invalid={!!(touched.message && errors.message)}
            aria-describedby={
              touched.message && errors.message ? "message-err" : "message-help"
            }
            required
          />
          <div className="mt-1 flex items-center justify-between text-xs">
            {touched.message && errors.message ? (
              <p id="message-err" className="text-red-600">
                {errors.message}
              </p>
            ) : (
              <p id="message-help" className="text-gray-500">
                Max {charMax} characters.
              </p>
            )}
            <span
              className={`ml-2 ${
                charLeft < 0 ? "text-red-600" : "text-gray-500"
              }`}
            >
              {charLeft} left
            </span>
          </div>
        </div>

        {/* Consent */}
        <div className="mb-6">
          <label className="inline-flex items-start gap-2">
            <input
              type="checkbox"
              name="consent"
              checked={form.consent}
              onChange={onChange("consent")}
              onBlur={() => markTouched("consent")}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
              aria-invalid={!!(touched.consent && errors.consent)}
              aria-describedby={
                touched.consent && errors.consent ? "consent-err" : undefined
              }
              required
            />
            <span className="text-sm text-gray-700">
              I agree that NovaPay may process my data to respond to this
              inquiry.
            </span>
          </label>
          {touched.consent && errors.consent && (
            <p id="consent-err" className={errCls}>
              {errors.consent}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={!canSubmit}
          aria-disabled={!canSubmit}
          className={`w-full sm:w-auto px-6 py-3 rounded-lg text-white transition ${
            canSubmit
              ? "bg-indigo-600 hover:bg-indigo-700"
              : "bg-indigo-400 cursor-not-allowed"
          }`}
        >
          {loading ? "Sending…" : "Send message"}
        </button>
      </form>
    </div>
  );
}
