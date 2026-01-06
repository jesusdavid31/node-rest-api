import { Router } from "express";

import { validateSchema } from "../middlewares/validator.middleware.js";
import { createUserSchema, updateUserSchema } from "../schemas/user.schema.js";

import {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
} from "../controllers/index.controllers.js";

const router = Router();

router.get("/users", getUsers);
router.get("/users/:id", getUserById);

// Rutas con validación de esquema
router.post("/users", validateSchema(createUserSchema), createUser);
router.put("/users/:id", validateSchema(updateUserSchema), updateUser);

router.delete("/users/:id", deleteUser);

export default router;