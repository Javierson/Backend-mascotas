

require ('dotenv').config()
import { sign, verify } from 'jsonwebtoken'
import { Controller as C } from '../../Controller'
import { UserInputError, AuthenticationError } from 'apollo-server-express'


import { Raza as R, Mascota as M } from '../../Database'


import {
    ObjectIDResolver as ObjectID,
    URLResolver as URL,
    TimestampResolver as Timestamp,
    DateResolver as Date,
    BigIntResolver as BigInt,
    NonEmptyStringResolver as NonEmptyString,
    EmailAddressResolver as EmailAddress,
    PositiveIntResolver as PositiveInt,
    NonNegativeIntResolver as NonNegativeInt,
    PositiveFloatResolver as PositiveFloat
} from 'graphql-scalars'

import faker from 'faker'

const ExecuteMascota = (Data, Fields) => new C ( Data, Fields, M ),
ExecuteRaza = (Data, Fields) => new C ( Data, Fields, R )


export default {


    Query: {

        _: async () => await true,

        // Obtener datos del home

        getHomeData: async (_, { Cantidad }) => {

            let Data = new Array (Cantidad)

            for (let X = 0; X < Cantidad; X++)
            Data.push({
                ID: faker.datatype.uuid(),
                // Foto usuario
                UserImage: faker.internet.avatar(),
                // Nombre del usuario
                FullName: faker.name.firstName() + ' ' + faker.name.lastName(),
                // Foto de mascota
                PetImage: faker.image.animals(),
                // Nombre de mascota
                PetName: faker.random.word()
            })

            return await Data

        },

        // Raza

        getRaza: async (_, { ID: _id }) => await ExecuteRaza().FindOne({ _id }),

        getRazas: async (_, { Query: { Limit, OffSet } = { } }) => await ExecuteRaza().Find(Limit, OffSet),

        getRazasQuantity: async () => await R.countDocuments(),

        // Mascota

        getMascota: async (_, { ID: _id }) => await ExecuteMascota().FindOne({ _id }),

        getMascotas: async (_, { Query: { Limit, OffSet } = { } }) => await ExecuteMascota().Find(Limit, OffSet),

        getMascotasQuantity: async () => await M.countDocuments()

    },


    Mutation: {

        _: async () => await true,

        // Mascota

        createMascota: async (_, { Mascota }) => await ExecuteMascota(Mascota).Create(),

        updateMascota: async (_, { ID: _id, Mascota }) => await ExecuteMascota(Mascota).FindOneAndUpdateBy({ _id }),

        deleteMascota: async (_, { ID: _id }) => await ExecuteMascota().FindOneAndRemove({ _id }),

        // Raza

        createRaza: async (_, { Nombre }) => await ExecuteRaza({ Nombre }).Create(),

        updateRaza: async (_, { ID: _id, Nombre }) => await ExecuteRaza({ Nombre }).FindOneAndUpdateBy({ _id }),

        deleteRaza: async (_, { ID: _id }) => await ExecuteRaza().FindOneAndRemove({ _id }),


    },


    Mascota: { RazaID: async ({ RazaID: _id }) => await ExecuteRaza().FindOne({ _id }) },


    ObjectID, URL, Date, Timestamp, BigInt, NonEmptyString, EmailAddress, PositiveInt, NonNegativeInt, PositiveFloat


}

