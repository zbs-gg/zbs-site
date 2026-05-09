import { ReactNode } from "react";

export function HL({
  children,
  tip,
  className = "",
}: {
  children: ReactNode;
  tip: string;
  className?: string;
}) {
  return (
    <span className={`hl ${className}`.trim()} data-tip={tip}>
      {children}
    </span>
  );
}
