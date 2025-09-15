import {
  useEffect,
  useState,
  useRef,
  useCallback,
  useImperativeHandle,
  forwardRef
} from "react";

// Tạo singleton lưu tất cả instance
const lstValidator: Array<ValidatorInstance> = [];

interface iProp {
  value: unknown;
  required?: boolean;
  requiredMessage?: string;
  regularExpression?: RegExp;
  regularMessage?: string;
  validationGroup?: string;
  className?: string;
  id?: string;
}

export interface FieldValidatorRef {
  isTouched: boolean;
  setTouched: (val: boolean) => void;
}

interface ValidatorInstance {
  group: string;
  value: unknown;
  checkError: (val: unknown) => { isValid: boolean; errorMessage: string };
  setState: React.Dispatch<React.SetStateAction<{ isValid: boolean; errorMessage: string }>>;
}

function FieldValidatorComponent(props: iProp, ref: React.Ref<FieldValidatorRef>) {
  const [state, setState] = useState({ isValid: true, errorMessage: "" });
  const [isTouched, setIsTouched] = useState<boolean>(false);
  const group = props.validationGroup ?? "";

  const checkError = useCallback((val: unknown) => {
    let _isValid = true;
    let _msg = "";

    if (props.required === true) {
      if (
        val === undefined ||
        val === null ||
        val.toString().trim() === "" ||
        (Array.isArray(val) && val.length <= 0)
      ) {
        _isValid = false;
        _msg = props.requiredMessage ?? "Trường này là bắt buộc";
      }
    }

    if (_isValid && props.regularExpression && typeof val === "string") {
      _isValid = props.regularExpression.test(val);
      if (!_isValid) {
        _msg = props.regularMessage ?? "Định dạng không hợp lệ";
      }
    }

    return { isValid: _isValid, errorMessage: _msg };
  }, [props.required, props.requiredMessage, props.regularExpression, props.regularMessage]);

  const validatorRef = useRef<ValidatorInstance>({
    group,
    value: props.value,
    checkError,
    setState,
  });

  useImperativeHandle(ref, () => ({
    isTouched,
    setTouched: setIsTouched,
  }), [isTouched]);

  useEffect(() => {
    validatorRef.current.group = group;
    validatorRef.current.value = props.value;
    validatorRef.current.checkError = checkError;
    validatorRef.current.setState = setState;
  }, [group, props.value, checkError]);

  useEffect(() => {
    const currentValidator = validatorRef.current;
    lstValidator.push(currentValidator);
    return () => {
      const index = lstValidator.indexOf(currentValidator);
      if (index !== -1) {
        lstValidator.splice(index, 1);
      }
    };
  }, []);

  useEffect(() => {
    if (isTouched) {
      const result = checkError(props.value);
      setState(prev => {
        if (
          result.isValid !== prev.isValid ||
          result.errorMessage !== prev.errorMessage
        ) {
          return result;
        }
        return prev;
      });
    }
  }, [checkError, props.value, isTouched]);

  return state.isValid ? null : (
    <span className={`text-red-500 text-sm ${props.className ?? ""}`}>
      {state.errorMessage}
    </span>
  );
}

export const FieldValidator = forwardRef(FieldValidatorComponent) as React.ForwardRefExoticComponent<
  iProp & React.RefAttributes<FieldValidatorRef>
> & {
  HasError: (groupToCheck?: string) => boolean;
  ValidatorSuccess: (success: boolean) => void;
  reset: (groupToCheck?: string) => void;
};

FieldValidator.HasError = (groupToCheck = ""): boolean => {
  let hasError = false;

  lstValidator.forEach((item) => {
    if (item.group === groupToCheck) {
      const result = item.checkError(item.value);
      item.setState({
        isValid: result.isValid,
        errorMessage: result.errorMessage,
      });
      if (!result.isValid) hasError = true;
    }
  });

  return hasError;
};

FieldValidator.ValidatorSuccess = (success: boolean) => {
  lstValidator.forEach((item) => {
    item.setState((prev) => ({
      isValid: success,
      errorMessage: success ? "" : prev.errorMessage,
    }));
  });
};

FieldValidator.reset = (groupToCheck = "") => {
  lstValidator.forEach((item) => {
    if (item.group === groupToCheck) {
      item.setState({ isValid: true, errorMessage: "" });
    }
  });
};
