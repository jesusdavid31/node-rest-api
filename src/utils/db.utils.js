
export const insertRow = async (pool, table, data) => {
    // 1. Obtenemos las llaves (columnas) y valores
    const columns = Object.keys(data);
    const values = Object.values(data);

    // 2. Generamos los placeholders ($1, $2, etc.) dinámicamente
    // Resultado: "$1, $2, $3, ..."
    const placeholders = columns.map((_, index) => `$${index + 1}`).join(", ");

    // 3. Construimos la query
    const query = `
        INSERT INTO ${table} (${columns.join(", ")}) 
        VALUES (${placeholders}) 
        RETURNING *
    `;

    // 4. Ejecutamos
    const { rows } = await pool.query(query, values);
    return rows[0];
};