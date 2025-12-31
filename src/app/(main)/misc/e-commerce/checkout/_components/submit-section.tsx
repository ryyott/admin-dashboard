export function CheckoutSubmit() {
  return (
    <section className="space-y-4">
      <div className="border border-green-200 bg-green-50 p-4">
        <p className="text-xs">✓ Success! Your payment information is secure.</p>
      </div>

      <div className="flex items-center justify-center gap-2 text-xs text-black/60">
        <span>🔒 Secured by Cloudflare</span>
      </div>

      <button
        type="submit"
        className="w-full bg-black py-4 text-sm tracking-wider text-white uppercase transition-colors hover:bg-black/90"
      >
        SUBMIT ORDER
      </button>
    </section>
  );
}
