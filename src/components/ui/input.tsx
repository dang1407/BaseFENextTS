import * as React from "react"

import { cn } from "@/lib/utils"
import { Label } from '@radix-ui/react-label';
import { FieldValidator, FieldValidatorRef } from '@/components/custom/FieldValidator';
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement>{
  onEnter?: () => void;
  required?: boolean;
  title?: string;
  value?: string | number | readonly string[] | undefined;
}
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, value, onChange, onEnter, required, title, ...props }, ref) => {
    const fieldValidatorRef = React.useRef<FieldValidatorRef>(null);
    const innerRef = React.useRef<HTMLInputElement>(null);
    const fieldRef = (ref as React.MutableRefObject<HTMLInputElement | null>) ?? innerRef;
     React.useEffect(() => {
      const inputEl = fieldRef.current;
      if (!inputEl) return;

      // Theo dõi khi trình duyệt autofill thay đổi giá trị
      const observer = new MutationObserver(() => {
        const event = new Event("input", { bubbles: true });
        inputEl.dispatchEvent(event);
      });

      observer.observe(inputEl, { attributes: true, attributeFilter: ["value"] });

      return () => observer.disconnect();
    }, []);
    return (
      <div className='w-full'>
        <div className={`flex w-full justify-between`}>
        <Label htmlFor={props.id}>
          {title}
          {required && <span className='text-red-500 ml-1'>*</span>}
          </Label>
          {
            required &&
            <FieldValidator ref={fieldValidatorRef} value={value} required={required} />
          }
        </div>
        <input
          type={type}
          className={cn(
            "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            className
          )}
          ref={fieldRef}
          onChange={(e) => {
            if(fieldValidatorRef?.current?.isTouched === false){
              fieldValidatorRef?.current?.setTouched(true);
            }
            if(onChange){
              onChange(e);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (onEnter && typeof(onEnter) === "function") {
                onEnter();
              }
            }
            if (props.onKeyDown) {
              props.onKeyDown(e)
            }
          }}
          value={value ?? ''}
          {...props}
        />
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
export type { InputProps }

