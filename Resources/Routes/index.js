

import { Router } from 'express'

import { Raza as R, Mascota as M } from '../Database'
import { Controller as C } from '../Controller'

const ExecuteMascota = (Data, Fields) => new C ( Data, Fields, M ),
ExecuteRaza = (Data, Fields) => new C ( Data, Fields, R ),


ExceptionHandler = async (response, exception) => { console.error(exception); await response.status(404).json({ message: exception.message || 'Se presento una o mas excepciones' }) },


PetsAPI = app => {


  const router = Router()

  app.use('/api/mascotas', router)


  router.get('/:petID', async ({ params: { petID: _id } = { } }, res, next) => { await ExecuteMascota().FindOne({ _id }).then( e => res.status(200).json(e) ).catch( async e => await ExceptionHandler(res, e) ); next() } )


  router.post('/', async ({ body: { Nombre, RazaID, Edad, Genero, Foto } = { } }, res, next) => { await ExecuteMascota({ Nombre, RazaID, Edad, Genero, Foto }).Create().then( async data => await res.status(201).json({ data, message: 'Mascota registrada exitosamente' }) ).cath( async e => await ExceptionHandler(res, e) ); next() } )


  router.patch('/:petID', async ({ params: { petID: _id } = { }, body: { Nombre, RazaID, Edad, Genero, Foto } = { } }, res, next) => {
    // await ExecuteMascota({ Nombre, RazaID, Edad, Genero, Foto }).API_REST_FindOneAndUpdateBy(_id, res)

    await M.findByIdAndUpdate(_id, { Nombre, RazaID, Edad, Genero, Foto }, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Tutorial with id=${ _id }. Maybe Tutorial was not found!`
        });
      } else res.send({ data, message: "Tutorial was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Tutorial with id=" + _id
      });
    });

    next()
})


  router.delete('/:petID', async ({ params: { petID: _id } = { } }, res, next) => { await ExecuteMascota().API_REST_FindOneAndRemove({ _id }, res); next() }
  )


  /*
  router.post('/', async ({ }, res, next) => await ExecuteMascota()
  .then( e => )
  .cath( async e => await next(e) )
  ) */



}


export default PetsAPI

