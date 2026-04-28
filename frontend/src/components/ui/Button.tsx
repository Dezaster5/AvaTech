import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

import styles from "../../styles/ui.module.css";

type BaseButtonProps = {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
};

type ButtonAsButton = BaseButtonProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type ButtonAsLink = BaseButtonProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };
type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button({ children, href, variant = "primary", className = "", ...props }: ButtonProps) {
  const classNames = [styles.button, styles[variant], className].filter(Boolean).join(" ");

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
