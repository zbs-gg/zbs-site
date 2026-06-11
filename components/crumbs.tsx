import Link from "next/link";
import { Fragment } from "react";

type Crumb = { label: string; href?: string };

export function Crumbs({ trail }: { trail: Crumb[] }) {
  return (
    <nav className="crumbs" aria-label="breadcrumb">
      {trail.map((crumb, i) => (
        <Fragment key={crumb.label}>
          {i > 0 && (
            <span className="crumb-sep" aria-hidden="true">
              /
            </span>
          )}
          {crumb.href ? (
            <Link href={crumb.href}>{crumb.label}</Link>
          ) : (
            <span className="crumb-here" aria-current="page">
              {crumb.label}
            </span>
          )}
        </Fragment>
      ))}
    </nav>
  );
}
