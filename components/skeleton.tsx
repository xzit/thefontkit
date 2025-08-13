"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLElement> {
  loading?: boolean;
  children?: React.ReactNode;
  width?: string | number;
  height?: string | number;
}

function Skeleton({
  loading = true,
  className,
  children,
  width,
  height,
  style,
  ...props
}: SkeletonProps) {
  if (!loading) return children;

  const isElement = React.isValidElement(children);
  const Comp = isElement ? Slot : "span";

  const inlineStyles = {
    width: width ?? (!isElement && !children ? "100%" : undefined),
    height: height ?? (!isElement && !children ? "1rem" : undefined),
    ...style,
  };

  return (
    <Comp
      data-slot="skeleton"
      aria-hidden
      tabIndex={-1}
      className={cn(
        "bg-muted pointer-events-none inline-flex animate-pulse rounded-sm select-none",
        !isElement && "rounded-md",
        "border-transparent leading-none text-transparent caret-transparent placeholder:text-transparent",
        className,
      )}
      style={inlineStyles}
      {...props}
    >
      {isElement ? (
        React.cloneElement(children as React.ReactElement<any>, {
          className: cn(
            "text-transparent select-none pointer-events-none caret-transparent border-transparent",
            (children as React.ReactElement<any>).props.className,
          ),
          tabIndex: -1,
          "aria-hidden": true,
        })
      ) : children ? (
        <span className="invisible">{children}</span>
      ) : null}
    </Comp>
  );
}

export { Skeleton };
