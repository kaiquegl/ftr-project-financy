import { EyeClosedIcon, EyeIcon } from "lucide-react";
import { useState } from "react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { Controller } from "react-hook-form";

import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";

type FormInputControllerProps<TFieldValues extends FieldValues> = {
  autoComplete?: string;
  control: Control<TFieldValues>;
  disabled?: boolean;
  helperText?: string;
  icon?: React.ReactNode;
  id?: string;
  label: string;
  name: FieldPath<TFieldValues>;
  placeholder?: string;
  type?: string;
};

export function FormInputController<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  type = "text",
  placeholder,
  icon,
  helperText,
  autoComplete,
  disabled,
  id
}: FormInputControllerProps<TFieldValues>) {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id ?? name;
  const isPassword = type === "password";

  function resolveInputType() {
    if (!isPassword) {
      return type;
    }
    return showPassword ? "text" : "password";
  }

  const inputType = resolveInputType();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={inputId}>{label}</FieldLabel>
          <InputGroup data-disabled={disabled} data-filled={!!field.value}>
            {icon && <InputGroupAddon align="inline-start">{icon}</InputGroupAddon>}
            <InputGroupInput
              {...field}
              aria-invalid={fieldState.invalid}
              autoComplete={autoComplete}
              disabled={disabled}
              id={inputId}
              placeholder={placeholder}
              type={inputType}
            />
            {isPassword && (
              <InputGroupAddon align="inline-end" className="text-gray-700">
                <InputGroupButton
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  onClick={() => setShowPassword((prev) => !prev)}
                  title={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? <EyeClosedIcon className="size-4" /> : <EyeIcon className="size-4" />}
                </InputGroupButton>
              </InputGroupAddon>
            )}
          </InputGroup>
          {fieldState.invalid && <FieldError className="text-gray-500" errors={[fieldState.error]} />}
          {!fieldState.invalid && helperText && <FieldDescription>{helperText}</FieldDescription>}
        </Field>
      )}
    />
  );
}
