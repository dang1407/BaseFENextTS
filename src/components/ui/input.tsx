import * as React from "react"

import { cn } from "@/lib/utils"
import { Label } from '@radix-ui/react-label';
import { FieldValidator, FieldValidatorRef } from '@/components/custom/FieldValidator';
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement>{
  onEnter?: () => void;
  required?: boolean;
  title?: string;
  inputValue?: string | number | readonly string[] | undefined;
}
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, inputValue: inputValue, onChange, onEnter, required, title, ...props }, ref) => {
    const fieldValidatorRef = React.useRef<FieldValidatorRef>(null);
    return (
      <div className='w-full'>
        <div className={`flex w-full justify-between`}>
        <Label htmlFor={props.id}>
          {title}
          {required && <span className='text-red-500 ml-1'>*</span>}
          </Label>
          {
            required &&
            <FieldValidator ref={fieldValidatorRef} value={inputValue} required={required} />
          }
        </div>
        <input
          type={type}
          className={cn(
            "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            className
          )}
          ref={ref}
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
          {...props}
        />
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
export type { InputProps }

