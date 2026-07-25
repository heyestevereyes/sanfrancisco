"use client";

import { useId, useState, type FocusEvent, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ArrowIcon from "@/components/icons/ArrowIcon";
import {
  validateContactField,
  type ContactFieldName,
  type ContactValues,
} from "@/lib/contactValidation";

type Errors = Partial<Record<ContactFieldName, string>>;

export interface ContactoFormProps {
  submitLabel: string;
  successMessage: string;
}

const initialValues: ContactValues = { nombre: "", email: "", telefono: "" };

/**
 * Lógica y UX del formulario compartidas entre el layout desktop y
 * mobile/tablet de Contacto — un solo componente (no el patrón
 * Desktop/Mobile de Hero/Distintivos) para no perder lo que el usuario
 * ya escribió si la ventana cambia de ancho entre breakpoints.
 */
export default function ContactoForm({ submitLabel, successMessage }: ContactoFormProps) {
  const [values, setValues] = useState<ContactValues>(initialValues);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<ContactFieldName, boolean>>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const idPrefix = useId();

  const setValue = (name: ContactFieldName, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateContactField(name, value) }));
    }
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    const name = event.target.name as ContactFieldName;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateContactField(name, values[name]) }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);

    const fieldNames = Object.keys(values) as ContactFieldName[];
    const nextErrors: Errors = {};
    for (const name of fieldNames) {
      const error = validateContactField(name, values[name]);
      if (error) nextErrors[name] = error;
    }
    setErrors(nextErrors);
    setTouched({ nombre: true, email: true, telefono: true });

    const firstInvalid = fieldNames.find((name) => nextErrors[name]);
    if (firstInvalid) {
      document.getElementById(`${idPrefix}-${firstInvalid}`)?.focus();
      return;
    }

    setStatus("submitting");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data: { ok?: boolean; error?: string } = await response.json();

      if (!response.ok || !data.ok) {
        setSubmitError(data.error ?? "No pudimos enviar tu mensaje. Intenta de nuevo.");
        setStatus("idle");
        return;
      }

      setStatus("success");
      setValues(initialValues);
      setTouched({});
      setErrors({});
    } catch {
      setSubmitError("No pudimos enviar tu mensaje. Revisa tu conexión e intenta de nuevo.");
      setStatus("idle");
    }
  };

  return (
    <AnimatePresence mode="wait">
      {status === "success" ? (
        <motion.p
          key="success"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          role="status"
          className="font-balimo text-lg leading-relaxed text-cream"
        >
          {successMessage}
        </motion.p>
      ) : (
        <motion.form
          key="form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          noValidate
          onSubmit={handleSubmit}
          className="flex w-full flex-col gap-5 xl:w-[clamp(33.556rem,39.297vw,47.156rem)] xl:gap-[clamp(1.152rem,1.349vw,1.6194rem)]"
        >
          <TextField
            id={`${idPrefix}-nombre`}
            name="nombre"
            type="text"
            label="Nombre completo"
            value={values.nombre}
            error={touched.nombre ? errors.nombre : undefined}
            onChange={(value) => setValue("nombre", value)}
            onBlur={handleBlur}
          />
          <TextField
            id={`${idPrefix}-email`}
            name="email"
            type="email"
            label="Email"
            value={values.email}
            error={touched.email ? errors.email : undefined}
            onChange={(value) => setValue("email", value)}
            onBlur={handleBlur}
          />
          <TextField
            id={`${idPrefix}-telefono`}
            name="telefono"
            type="tel"
            label="Teléfono"
            value={values.telefono}
            error={touched.telefono ? errors.telefono : undefined}
            onChange={(value) => setValue("telefono", value)}
            onBlur={handleBlur}
          />

          <button
            type="submit"
            disabled={status === "submitting"}
            className="mt-3 flex w-fit items-center gap-3 rounded-[10px] bg-gold px-6 py-3.5 transition-colors duration-200 hover:bg-white disabled:cursor-not-allowed disabled:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream xl:mt-[clamp(1.7304rem,2.026vw,2.4319rem)] xl:gap-[clamp(0.534rem,0.625vw,0.75rem)] xl:rounded-[clamp(0.445rem,0.521vw,0.625rem)] xl:px-[clamp(1.067rem,1.25vw,1.5rem)] xl:py-[clamp(0.6225rem,0.729vw,0.875rem)]"
          >
            <span className="whitespace-nowrap font-balimo font-medium text-forest text-sm leading-6 xl:text-[clamp(0.712rem,0.833vw,1rem)] xl:leading-[clamp(1.067rem,1.25vw,1.5rem)]">
              {status === "submitting" ? "Enviando..." : submitLabel}
            </span>
            <ArrowIcon className="size-[18px] shrink-0 text-forest xl:size-[clamp(0.8rem,0.938vw,1.125rem)]" />
          </button>

          {submitError ? (
            <p
              role="alert"
              className="rounded-[10px] border border-red-400 bg-red-400/10 px-4 py-3 text-sm text-red-300"
            >
              {submitError}
            </p>
          ) : null}
        </motion.form>
      )}
    </AnimatePresence>
  );
}

function TextField({
  id,
  name,
  type,
  label,
  value,
  error,
  onChange,
  onBlur,
}: {
  id: string;
  name: ContactFieldName;
  type: "text" | "email" | "tel";
  label: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  onBlur: (event: FocusEvent<HTMLInputElement>) => void;
}) {
  const errorId = `${id}-error`;
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1 block font-balimo text-white-80 text-sm xl:text-[clamp(0.7235rem,0.8474vw,1.0169rem)]"
      >
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={`w-full border-b bg-transparent pb-2 font-balimo text-cream transition-colors duration-200 focus:border-b-2 focus:outline-none text-base xl:text-[clamp(0.8rem,0.938vw,1.125rem)] ${
          error ? "border-red-400" : "border-cream focus:border-gold"
        }`}
      />
      {error ? (
        <p id={errorId} role="alert" className="mt-1 text-xs text-red-300">
          {error}
        </p>
      ) : null}
    </div>
  );
}
