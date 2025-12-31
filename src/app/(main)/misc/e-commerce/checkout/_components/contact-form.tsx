export function CheckoutContactForm() {
  return (
    <section className="space-y-4">
      <h2 className="text-xs tracking-wider uppercase">CONTACT INFORMATION</h2>

      <input
        type="email"
        placeholder="Email"
        className="w-full border border-black bg-white px-4 py-3 text-sm uppercase placeholder:normal-case focus:border-black/60 focus:outline-none"
      />

      <label className="flex cursor-pointer items-start gap-3">
        <input type="checkbox" className="mt-1 h-4 w-4 border border-black" />
        <span className="text-xs">Subscribe to updates and notifications</span>
      </label>
    </section>
  );
}
