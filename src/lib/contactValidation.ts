export interface ContactValues {
  nombre: string;
  email: string;
  telefono: string;
}

export type ContactFieldName = keyof ContactValues;

/**
 * Validación compartida entre el formulario (cliente, ContactoForm.tsx) y
 * la API route (servidor, src/app/api/contact/route.ts) — el servidor
 * nunca debe confiar solo en la validación del frontend, así que ambos
 * lados usan exactamente las mismas reglas.
 */
export function validateContactField(
  field: ContactFieldName,
  value: string
): string | undefined {
  switch (field) {
    case "nombre":
      return value.trim().length >= 2
        ? undefined
        : "Ingresa tu nombre completo.";
    case "email":
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
        ? undefined
        : "Ingresa un correo electrónico válido.";
    case "telefono": {
      const digits = value.replace(/[\s\-()]/g, "");
      return /^(\+?52)?\d{10}$/.test(digits)
        ? undefined
        : "Ingresa un teléfono a 10 dígitos (con o sin +52).";
    }
  }
}

export function validateContactValues(
  values: ContactValues
): Partial<Record<ContactFieldName, string>> {
  const errors: Partial<Record<ContactFieldName, string>> = {};
  (Object.keys(values) as ContactFieldName[]).forEach((field) => {
    const error = validateContactField(field, values[field]);
    if (error) errors[field] = error;
  });
  return errors;
}
