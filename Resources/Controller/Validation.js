

require ('dotenv').config()
import { verify } from 'jsonwebtoken'
import { UserInputError, AuthenticationError } from 'apollo-server-core'


export default class Validation {


    static async TelephoneNumber ( Value ) {

        if (Value.toString().length !== 10)
            return new UserInputError ('El formato del nuemro del telefono no es correcto')

    }


    static async DecodeToken (Token) {

        const Data = await verify(Token, process.env.API_KEY, (err, data) => {
            if (err) throw new AuthenticationError ('Token invalido')
                return data
          })

          return Data

    }


}

