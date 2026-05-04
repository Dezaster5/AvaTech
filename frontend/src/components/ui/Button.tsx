import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { Link } from "react-router-dom";
import type { LinkProps } from "react-router-dom";

import styles from "../../styles/ui.module.css";

type BaseButtonProps = {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
};

type ButtonAsButton = BaseButtonProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type ButtonAsAnchor = BaseButtonProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; to?: never };
type ButtonAsRouterLink = BaseButtonProps & Omit<LinkProps, "to"> & { to: LinkProps["to"]; href?: never };
type ButtonProps = ButtonAsButton | ButtonAsAnchor | ButtonAsRouterLink;

export function Button({ children, href, variant = "primary", className = "", ...props }: ButtonProps) {
  const classNames = [styles.button, styles[variant], className].filter(Boolean).join(" ");

  if ("to" in props && props.to) {
    return (
      <Link className={classNames} {...(props as Omit<LinkProps, "className">)}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a className={classNames} href={href} {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </a>
    );
  }

  return (
    <button className={classNames} {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
