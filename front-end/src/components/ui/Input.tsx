import React from "react";
import CSS from "../../styles/ui.module.css";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  isDisabled: boolean;
  width: string;
  height: string;
  fontSize: string;
  icon: JSX.Element;
  margin?: string | 0;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ isDisabled, width, height, fontSize, margin, icon, ...props }, ref) => {
    return (
      <div
        className={CSS.inputContainer}
        style={{ width: width, height: height, margin: margin }}
      >
        <div className={CSS.icon}>{icon}</div>
        <input
          className={CSS.input}
          style={{
            fontSize: fontSize,
            margin: margin,
          }}
          ref={ref}
          disabled={isDisabled}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
