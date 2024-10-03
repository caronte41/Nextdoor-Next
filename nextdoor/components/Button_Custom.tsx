import React from "react";
import { Button, ButtonProps } from "@/components/ui/button"; // Adjust path as needed

interface ButtonCustomProps extends ButtonProps {
  // You can extend it with custom props if needed
  icon?: React.ReactNode; // Example: Optional icon prop
}

const Button_Custom: React.FC<ButtonCustomProps> = ({
  icon,
  children,
  ...props
}) => {
  return (
    <Button {...props}>
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </Button>
  );
};

export default Button_Custom;
