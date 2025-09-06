export default function SparkBar({
  values,
  max,
}: {
  values: number[];
  max?: number;
}) {
  const M = max ?? Math.max(1, ...values);
  return (
    <div className="flex items-end gap-1 h-16">
      {values.map((v, i) => (
        <div
          key={i}
          className="w-2 rounded-t bg-indigo-600"
          style={{ height: `${Math.max(4, (v / M) * 100)}%` }}
          title={`${v}`}
        />
      ))}
    </div>
  );
}
