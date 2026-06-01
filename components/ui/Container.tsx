import { CSSProperties, ReactNode } from "react";

export default function Container({
  children,
  style,
  className,
}: {
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
}) {
  return (
    <div
      className={className}
      style={{ maxWidth: 1200, margin: "0 auto", padding: "0 40px", ...style }}
    >
      {children}
    </div>
  );
}
