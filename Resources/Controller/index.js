

require ('json-bigint-patch')
import Validation from './Validation'
import { ApolloError, UserInputError } from 'apollo-server-express'


class Controller extends Validation {


    constructor ( Data, Fields, Schema ) {

        super()
        this.Data = Data
        this.Fields = Fields
        this.Model = Schema

    }


    async Create ( Exception = 'Excepcion en el guardado de datos' ) {

        try {

            console.log(this.Data)
            return await this.Model( this.Data ).save()

        } catch ({ message }) {

            console.log(message)

            throw await new ApolloError ( message || Exception )

        }

    }


    async FindOne ( Filter, Excepcion = 'Excepcion en la consulta' ) {

        try {

        const Data = await this.Model.findOne(JSON.parse(JSON.stringify(Filter)))
        console.log(Data)
        return Data // await this.Model.findOne(JSON.parse(JSON.stringify(Filter)))

        } catch ({ message }) {

            throw new ApolloError ( message || Excepcion )

        }

    }


    async Find ( Limit = 1, OffSet, Excepcion = 'Excepcion en la consulta' ) {

        try {

            return await this.Model.find(this.Data && JSON.parse(JSON.stringify(this.Data)), this.Fields).limit(Limit).skip(OffSet)

        } catch ({ message }) {

            throw new ApolloError ( message || Excepcion )

        }

    }


    async FindOneAndUpdateBy ( Filter, Exception = 'Excepcion en la actualizacion del dato', UpSert ) {

        try {

            await this.Model.updateOne(JSON.parse(JSON.stringify(Filter)), this.Data, { upsert: UpSert, runValidators: true })

            console.log(await this.FindOne(Object.assign(Filter, this.Data)))

            return await this.FindOne(Object.assign(Filter, this.Data)) || new UserInputError (Exception)

        } catch ({ message }) {

            throw await new ApolloError ( message || Exception )

        }

    }


    async FindOneAndRemove ( Filter, Exception = 'Excepcion en la eliminacion del dato' ) {

        try {

            console.log(await this.FindOne(Object.assign(Filter, this.Data)))
            return await this.Model.findOneAndRemove(JSON.parse(JSON.stringify(Filter))) || new UserInputError ('El elemento a eleminar no se encontro')

        } catch ({ message }) {

            throw await new ApolloError ( message || Exception )

        }

    }


    async API_REST_FindOneAndRemove ( Filter, Response, Exception = 'Excepcion en la eliminacion del dato' ) {

            return await this.Model.findOneAndRemove(JSON.parse(JSON.stringify(Filter)))
            .then( async data => {
                if (!data)
                  await Response.status(404).send({ message: `No se encontro el registro ${ _id }, probablemente ya fue eliminado` })
                else
                  await Response.status(201).json({ data, message: 'Registro eliminado exitosamente' }) } )
            .catch( async e => { console.error('Exception from API REST Find One And Remove', e); await Response.status(404).json({ message: e.message || Exception }) } )

    }


    async API_REST_FindOneAndUpdateBy ( Filter, Response, Exception = 'Excepcion en la actualizacion del dato' ) {

        this.Model.findByIdAndUpdate(Filter, this.Model, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        Response.status(404).send({
          message: `Cannot update Tutorial with id = ${ Filter }. Maybe Tutorial was not found!`
        });
      } else Response.send({ message: "Tutorial was updated successfully." });
    })
    .catch(err => {
        Response.status(500).send({
        message: "Error updating Tutorial with id=" + Filter
      });
    })

    }


    async isOwner (ID, Filter, Excepcion) {

/*
Busco el plan
Extraigo el UsuarioID
IF de verificar si el Auth ID es Igual al del UsuarioID
THEN return true
FALSE Excepcion 'No eres el propietario de este elemento'
*/

            const Usuario = await this.FindOne({ _id: Filter, UsuarioID: ID }, Excepcion)

            console.log('Consulta', Usuario,'UsuarioID del token', ID, 'Usuario ID del recurso')

            if (Usuario && Usuario.UsuarioID)
            await console.log('Recurso encontrado', Usuario.UsuarioID)
            else throw await new UserInputError ('No eres el propietario de este elemento o no existe')

    }


}


export { Controller }

