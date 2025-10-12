const db = require("../config/database");

//  Listar todos los envíos
async function listarEnvios() {
  try {
    const [rows] = await db.query(
      "SELECT * FROM envios ORDER BY id_envio DESC"
    );
    return { ok: true, total: rows.length, data: rows };
  } catch (error) {
    console.error("Error al listar envíos:", error);
    return {
      ok: false,
      message: "Error al listar envíos",
      error: error.message,
    };
  }
}

// Obtener un envío por su ID
async function obtenerEnvio(id_envio) {
  try {
    const [rows] = await db.query("SELECT * FROM envios WHERE id_envio = ?", [
      id_envio,
    ]);
    if (rows.length === 0) {
      return {
        ok: false,
        message: "Envío no encontrado.",
      };
    }
    return { ok: true, data: rows[0] };
  } catch (error) {
    console.error("Error al obtener envío:", error);
    return {
      ok: false,
      message: "Error al obtener el envío.",
      error: error.message,
    };
  }
}

// Crear nuevo envío
async function crearEnvio(datos) {
  try {
    const {
      id_pedido,
      destinatario,
      direccion_envio,
      ciudad,
      provincia,
      pais,
      codigo_postal,
      empresa_envio,
      numero_seguimiento,
      estado_envio,
      fecha_envio,
    } = datos;

    // Verificamos que el pedido exista antes de crear el envío
    const [pedido] = await db.query(
      "SELECT id_pedido FROM pedidos WHERE id_pedido = ?",
      [id_pedido]
    );
    if (pedido.length === 0) {
      return {
        ok: false,
        message: "El pedido asociado no existe.",
      };
    }

    // Insertamos el nuevo registro en 'envios'
    const [result] = await db.query(
      `INSERT INTO envios 
       (id_pedido, destinatario, direccion_envio, ciudad, provincia, pais, codigo_postal, empresa_envio, numero_seguimiento, estado_envio)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id_pedido,
        destinatario,
        direccion_envio,
        ciudad,
        provincia,
        pais,
        codigo_postal,
        empresa_envio,
        numero_seguimiento,
        estado_envio,
        fecha_envio,
      ]
    );

    return {
      ok: true,
      message: "Envío creado correctamente.",
      id_envio: result.insertId,
    };
  } catch (error) {
    console.error("Error interno al crear el envío:", error);
    return {
      ok: false,
      message: "Error interno al crear el envío.",
      error: error.message,
    };
  }
}

// Actualizar datos del envío
async function actualizarDatosEnvio(id_envio, nuevosDatos) {
  try {
    const [result] = await db.query("UPDATE envios SET ? WHERE id_envio = ?", [
      nuevosDatos,
      id_envio,
    ]);
    if (result.affectedRows === 0) {
      return { ok: false, message: "Envío no encontrado." };
    }
    return { ok: true, message: "Datos del envío actualizados correctamente." };
  } catch (error) {
    console.error("Error al actualizar envío:", error);
    return {
      ok: false,
      message: "Error al actualizar envío.",
      error: error.message,
    };
  }
}

// Cambiar estado del envío
async function cambiarEstadoEnvio(id_envio, nuevoEstado) {
  try {
    // Validamos que el envío exista antes de actualizarlo
    const [envio] = await db.query("SELECT * FROM envios WHERE id_envio = ?", [
      id_envio,
    ]);
    if (envio.length === 0) {
      return { ok: false, message: "Envío no encontrado." };
    }

    // Actualizamos el estado según la lógica del modelo
    let camposExtra = "";
    if (nuevoEstado === "en_camino") camposExtra = ", fecha_envio = NOW()";
    if (nuevoEstado === "entregado") camposExtra = ", fecha_entrega = NOW()";

    const [result] = await db.query(
      `UPDATE envios
       SET estado_envio = ? ${camposExtra}, updated_at = NOW()
       WHERE id_envio = ?`,
      [nuevoEstado, id_envio]
    );

    if (result.affectedRows === 0) {
      return { ok: false, message: "No se pudo actualizar el estado." };
    }

    return {
      ok: true,
      message: `Estado del envío actualizado a '${nuevoEstado}'.`,
    };
  } catch (error) {
    console.error("❌ Error en cambiarEstadoEnvio (service):", error);
    return {
      ok: false,
      message: "Error al cambiar estado.",
      error: error.message,
    };
  }
}

// Eliminar un envío
async function eliminarEnvio(id_envio) {
  try {
    const [result] = await db.query("DELETE FROM envios WHERE id_envio = ?", [
      id_envio,
    ]);
    if (result.affectedRows === 0) {
      return {
        ok: false,
        message: "Envío no encontrado.",
      };
    }
    return { ok: true, message: "Envío eliminado correctamente." };
  } catch (error) {
    console.error("Error al eliminar envío:", error);
    return {
      ok: false,
      message: "Error al eliminar envío.",
      error: error.message,
    };
  }
}

module.exports = {
  listarEnvios,
  obtenerEnvio,
  crearEnvio,
  actualizarDatosEnvio,
  cambiarEstadoEnvio,
  eliminarEnvio,
};
