import { pool } from "../db.js";

import { insertRow } from "../utils/db.utils.js";

// Obtener usuarios con PAGINACIÓN
export const getUsers = async (req, res) => {
    try {
        // Obtenemos parámetros de consulta para paginación (por defecto página 1, 10 items)
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        // CONSULTA OPTIMIZADA (1 solo viaje a la BD)
        // Agregamos COUNT(*) OVER() AS total_count
        const result = await pool.query(
            `SELECT *, COUNT(*) OVER() AS total_count 
            FROM users 
            ORDER BY id ASC 
            LIMIT $1 OFFSET $2`,
            [limit, offset]
        );

        // Si no hay usuarios, total es 0
        const totalUsers = result.rows.length > 0 ? parseInt(result.rows[0].total_count) : 0;
        
        // Limpiamos la data para no enviar 'total_count' repetido en cada usuario al frontend
        const users = result.rows.map(user => {
            const { total_count, ...userData } = user;
            return userData;
        });

        res.status(200).json({
            message: "Usuarios obtenidos correctamente",
            data: users,
            pagination: {
                total: totalUsers,
                page: page,
                limit: limit,
                totalPages: Math.ceil(totalUsers / limit)
            }
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Obtener por ID
export const getUserById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        
        // Validar que el ID sea un número
        if (isNaN(id)) {
            return res.status(400).json({ message: "El ID debe ser un número entero" });
        }

        const response = await pool.query("SELECT * FROM users WHERE id = $1", [id]);

        if (response.rows.length === 0) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        res.status(200).json({
            message: "Usuario encontrado exitosamente",
            data: response.rows[0]
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener el usuario" });
    }
};

// Buscar usuarios por nombre (Búsqueda parcial)
export const searchUsersByName = async (req, res) => {
    try {
        const { name } = req.query; // se espera ?name=ryan

        if (!name) {
            return res.status(400).json({ message: "Debes proveer un nombre para buscar" });
        }

        // Usamos ILIKE para búsqueda insensible a mayúsculas/minúsculas
        const response = await pool.query(
            "SELECT * FROM users WHERE name ILIKE $1", 
            [`%${name}%`] 
        );

        // Mensaje dinámico según resultados
        const message = response.rows.length > 0 
            ? "Resultados de la búsqueda" 
            : "No se encontraron coincidencias";


        res.status(200).json({
            message: message,
            data: response.rows
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error en la búsqueda" });
    }
};

// Crear usuario con validación de duplicados
export const createUser = async (req, res) => {
    try {
        const { name, email } = req.body;

        // const { rows } = await pool.query(
        //     "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
        //     [name, email]
        // );
        // res.status(201).json(rows[0]);

        const newUser = await insertRow(pool, "users", req.body);

        return res.status(201).json({
            message: "Usuario creado exitosamente",
            data: newUser
        });

    } catch (error) {
        // Manejo específico de errores
        if (error.code === '23505') { // Código de violación de restricción única (Unique violation)
            return res.status(409).json({ message: "El email ya está registrado" });
        }
        
        console.error(error);
        return res.status(500).json({ message: "Error al crear usuario" });
    }
};

// Actualizar usuario (Validando existencia)
export const updateUser = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { name, email } = req.body;

        if (isNaN(id)) {
            return res.status(400).json({ message: "ID inválido" });
        }

        // COALESCE permite mantener el valor anterior si el nuevo es null (Actualización parcial)
        const { rows } = await pool.query(
            `UPDATE users 
            SET name = COALESCE($1, name), 
            email = COALESCE($2, email) 
            WHERE id = $3 RETURNING *`,
            [name, email, id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "Usuario no encontrado para actualizar" });
        }

        return res.status(200).json({
            message: "Usuario actualizado exitosamente",
            data: rows[0]
        });
        
    } catch (error) {
        if (error.code === '23505') {
            return res.status(409).json({ message: "El email ya está en uso por otro usuario" });
        }
        console.error(error);
        return res.status(500).json({ message: "Error al actualizar usuario" });
    }
};

// Eliminar usuario
export const deleteUser = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        
        if (isNaN(id)) {
            return res.status(400).json({ message: "ID inválido" });
        }

        const { rowCount } = await pool.query("DELETE FROM users where id = $1", [id]);

        if (rowCount === 0) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        return res.status(200).json({
            message: "Usuario eliminado correctamente",
            deletedId: id
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al eliminar usuario" });
    }
};