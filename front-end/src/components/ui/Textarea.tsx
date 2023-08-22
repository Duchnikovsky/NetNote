import React from "react";
import CSS from "../../styles/ui.module.css";

interface InputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  isDisabled: boolean;
  width: string;
  height: string;
  fontSize: string;
  margin?: string | 0;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, InputProps>(
  ({ isDisabled, width, height, fontSize, margin, ...props }, ref) => {
    return (
      <div
        className={CSS.textareaContainer}
        style={{ width: width, height: height, margin: margin }}
      >
        <textarea
          className={CSS.textarea}
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

Textarea.displayName = "Textarea";

export { Textarea };
