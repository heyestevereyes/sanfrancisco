import { NextResponse } from "next/server";
import { Resend } from "resend";
import { validateContactValues, type ContactValues } from "@/lib/contactValidation";

const PENDING_PREFIX = "PENDIENTE_";

export async function POST(request: Request) {
  let body: Partial<Record<keyof ContactValues, unknown>>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  const values: ContactValues = {
    nombre: typeof body.nombre === "string" ? body.nombre : "",
    email: typeof body.email === "string" ? body.email : "",
    telefono: typeof body.telefono === "string" ? body.telefono : "",
  };

  // Nunca confiar solo en la validación del frontend — se valida de nuevo
  // aquí con las mismas reglas (src/lib/contactValidation.ts).
  const fieldErrors = validateContactValues(values);
  if (Object.keys(fieldErrors).length > 0) {
    return NextResponse.json(
      { error: "Revisa los datos del formulario.", fieldErrors },
      { status: 400 }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_EMAIL_TO;

  const missingApiKey = !apiKey || apiKey.startsWith(PENDING_PREFIX);
  const missingToEmail = !toEmail || toEmail.startsWith(PENDING_PREFIX);
  if (missingApiKey || missingToEmail) {
    // TODO(cliente): configurar RESEND_API_KEY y CONTACT_EMAIL_TO en
    // .env.local — ver "Pendientes del cliente" en CLAUDE.md.
    console.warn(
      "⚠️ Falta configurar RESEND_API_KEY y/o CONTACT_EMAIL_TO en las variables de entorno — no se puede enviar el correo de contacto."
    );
    return NextResponse.json(
      {
        error:
          "El envío de correo todavía no está configurado. Contáctanos directamente mientras tanto.",
      },
      { status: 503 }
    );
  }

  const resend = new Resend(apiKey);

  try {
    const { error } = await resend.emails.send({
      // TODO: usar un remitente del dominio propio verificado en Resend
      // cuando exista; onboarding@resend.dev funciona sin verificación
      // mientras tanto.
      from: "San Francisco <onboarding@resend.dev>",
      to: toEmail,
      replyTo: values.email,
      subject: `Nuevo contacto de ${values.nombre} — San Francisco`,
      text: `Nombre: ${values.nombre}\nEmail: ${values.email}\nTeléfono: ${values.telefono}`,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "No pudimos enviar tu mensaje. Intenta de nuevo." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json(
      { error: "No pudimos enviar tu mensaje. Intenta de nuevo." },
      { status: 500 }
    );
  }
}
