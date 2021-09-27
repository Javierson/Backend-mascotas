

import { Schema, model } from 'mongoose'

require ('dotenv').config()

const { Mascota, Raza } = process.env, { ObjectId } = Schema.Types

export default model ( Mascota, new Schema ({

    Nombre: { type: String, trim: true, required: true },
    RazaID: { type: ObjectId, ref: Raza, required: true },
    Edad: { type: Number, min: 0, max: 100, required: true },
    Genero: { type: Boolean, required: true },
    Foto: { type: String, min: 7, max: 200, trim: true, required: true, validate: { validator: async Value => /^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/gm.test(Value), message: 'Ingrese el formato valido de un enlace' } }

}, { timestamps: true, versionKey: false }), Mascota )


/*

import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

export default function BasicButtons() {
  return (
    <Stack spacing={2} direction="row">
      <Button variant="text">Text</Button>
      <Button variant="contained">Contained</Button>
      <Button variant="outlined">Outlined</Button>
    </Stack>
  );
}

*/

