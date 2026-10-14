/** Wordmark: "Prism" in the surrounding text colour, "Go" in coral. */
export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`font-semibold tracking-tight ${className}`}>
      Prism<span className="text-coral-500">Go</span>
    </span>
  );
}
