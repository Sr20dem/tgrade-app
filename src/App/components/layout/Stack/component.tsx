import * as React from "react";
import { HTMLAttributes } from "react";

interface StackProps extends HTMLAttributes<HTMLOrSVGElement> {
  readonly tag?: keyof JSX.IntrinsicElements;
}

export default function Stack({ tag: Tag = "div", children, ...props }: StackProps): JSX.Element {
  return <Tag {...props}>{children}</Tag>;
}
