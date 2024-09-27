import { createElement, CSSProperties, FC } from "react";

interface TypographyCustomProps {
  variant?: keyof typeof variantMap;
  weight?: keyof typeof weightMap;
  className?: string;
  style?: CSSProperties;
  children: React.ReactNode;
}

const variantMap = {
  h1: { tag: "h1", class: "text-4xl" },
  h2: { tag: "h2", class: "text-2xl md:text-3xl" },
  h3: { tag: "h3", class: "text-xl md:text-2xl" },
  h4: { tag: "h4", class: "text-xl" },
  h5: { tag: "h5", class: "text-lg" },
  h6: { tag: "h6", class: "text-base" },
  small: { tag: "p", class: "text-sm" },
  tiny: { tag: "p", class: "text-tiny" },
  paragraph: { tag: "p", class: "text-base" },
  display: { tag: "h1", class: "text-3xl md:text-2xl lg:text-2xl" },
} as const;

const weightMap = {
  light: "font-light",
  normal: "font-normal",
  medium: "font-medium",
  semiBold: "font-semibold",
  bold: "font-bold",
  extraBold: "font-extrabold",
  black: "font-black",
} as const;

const Typography_Custom: FC<TypographyCustomProps> = ({
  variant = "paragraph",
  weight = "normal",
  className = "",
  style,
  children,
}) => {
  const { tag, class: variantClass } =
    variantMap[variant] || variantMap["paragraph"];
  const weightClass = weightMap[weight] || "";

  const combinedClass = `${variantClass} ${weightClass} ${className}`.trim();

  return createElement(
    tag,
    { className: combinedClass || undefined, style: style || undefined },
    children
  );
};

export default Typography_Custom;
