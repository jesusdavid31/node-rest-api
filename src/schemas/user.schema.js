import { z } from 'zod';

export const createUserSchema = z.object({
    name: z.string({
        required_error: "El nombre es requerido",
        invalid_type_error: "El nombre debe ser un texto"
    }).min(3, { 
        message: "El nombre debe tener al menos 3 caracteres" 
    }).max(40, { 
        message: "El nombre no debe exceder los 40 caracteres" 
    }),

    email: z.string({
        required_error: "El email es requerido",
        invalid_type_error: "El email debe ser un texto"
    }).email({ 
        message: "El email no tiene un formato válido" 
    })
});

// Usamos .partial() para hacer todos los campos opcionales en la actualización
export const updateUserSchema = createUserSchema.partial();