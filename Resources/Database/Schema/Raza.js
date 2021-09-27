

import { Schema, model } from 'mongoose'

require ('dotenv').config()

const { Raza } = process.env

export default model ( Raza, new Schema ({

    Nombre: { type: String, trim: true, unique: true, required: true },

}, { versionKey: false }), Raza )

