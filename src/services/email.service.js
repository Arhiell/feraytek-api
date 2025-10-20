const nodemailer = require('nodemailer');

function createTransportFromEnv() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE, SMTP_FROM } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !SMTP_FROM) {
    throw new Error('Configuración SMTP incompleta. Verifique variables SMTP_* en .env');
  }

  const transport = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: SMTP_SECURE ? SMTP_SECURE === 'true' : Number(SMTP_PORT) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  return { transport, from: SMTP_FROM };
}

async function sendEmail({ to, subject, text, html, attachments }) {
  const { transport, from } = createTransportFromEnv();

  const info = await transport.sendMail({
    from,
    to,
    subject,
    text,
    html,
    attachments,
  });

  return info;
}

function renderFacturaHtml({ numero_factura, fecha, total, cliente }) {
  return `
    <div style="font-family: Arial, sans-serif;">
      <h2>Factura ${numero_factura}</h2>
      <p><strong>Fecha:</strong> ${fecha}</p>
      <p><strong>Cliente:</strong> ${cliente?.nombre_usuario || cliente?.email || 'Cliente'}</p>
      <p><strong>Total:</strong> $${Number(total).toFixed(2)}</p>
      <hr/>
      <p>Gracias por su compra en Feraytek.</p>
    </div>
  `;
}

async function enviarFacturaCliente({ factura, usuario, adjuntoPdfBuffer, adjuntoNombre }) {
  const html = renderFacturaHtml({
    numero_factura: factura.numero_factura,
    fecha: factura.fecha || new Date().toISOString().slice(0, 19).replace('T', ' '),
    total: factura.total,
    cliente: usuario,
  });

  const attachments = adjuntoPdfBuffer
    ? [{ filename: adjuntoNombre || `Factura-${factura.numero_factura}.pdf`, content: adjuntoPdfBuffer }]
    : undefined;

  return await sendEmail({
    to: usuario.email,
    subject: `Factura ${factura.numero_factura}`,
    text: `Adjuntamos su factura ${factura.numero_factura}. Total: $${Number(factura.total).toFixed(2)}`,
    html,
    attachments,
  });
}

module.exports = {
  sendEmail,
  enviarFacturaCliente,
};