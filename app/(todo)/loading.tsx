export default function Loading() {
  return (
    <div className="space-y-3" aria-busy="true" aria-live="polite">
      <p className="sr-only">할 일을 불러오는 중...</p>
      {[1, 2, 3].map((n) => (
        <div key={n} className="h-20 animate-pulse rounded-xl bg-gray-100" />
      ))}
    </div>
  );
}
