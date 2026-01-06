
export const validateSchema = (schema) => (req, res, next) => {
    try {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            // .flatten() convierte el array de errores en un objeto simple:
            // { email: ["El email es inválido"], name: ["El nombre es corto"] }
            const errorMessages = result.error.flatten().fieldErrors;

            console.log(errorMessages);
            
            // Esto es mucho más seguro que hacer .map() directo al error
            const formattedErrors = Object.entries(errorMessages).map(([field, messages]) => ({
                field,
                message: messages.join(", ") // Une mensajes si hay más de uno por campo
            }));

            return res.status(400).json({
                message: "Error en los datos enviados",
                errors: formattedErrors
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({ message: "Error interno del servidor" });
    }
};