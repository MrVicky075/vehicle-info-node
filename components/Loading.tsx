"use client";

type LoadingProps = {
  label?: string;
};

export default function Loading({ label = "Loading..." }: LoadingProps) {
  return (
    <div className="flex items-center justify-center gap-2 py-8 text-slate-600">
      <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-teal-600" />
      <span>{label}</span>
    </div>
  );
}
