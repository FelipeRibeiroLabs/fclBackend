import * as fcl from "@onflow/fcl";
import { sequelize } from '@database/sequelize';
import { Orbies } from "@models/orbies/Orbies";
import { User } from "@models/user/User";
import { getOrbiesData } from "app/cadence/scripts/getOrbiesData";
import { mintOrbies } from 'app/cadence/transactions/mintOrbies';
import AuthorizeTransaction from 'app/util/AuthorizeTransaction';
import { decode } from 'rlp';

const userRepository = sequelize.getRepository(User);

class OrbiesService {
    
    getOrbies = async (address: string): Promise<Orbies[]> => {
        let res = []
        try {
            res = await fcl.query({
                cadence: getOrbiesData,
                args: (arg, t) => [arg(address, t.Address)],
              });

              return res;
          } catch (error) {
            console.log(error.errorMessage)
          }

          return res
    }

    addOrbies = async (address: string): Promise<User> => {
        try {
            const orbies = await this.getOrbies(address);
            let user = await userRepository.findOne({ where: { address: address } });

            if(user !== null){
                user.orbiesData = orbies;
                await user.save();
            } else {
                const newUser = await userRepository.create({ address: address })
                newUser.orbiesData = orbies;
                user = newUser
                await user.save();
            }

              return user;
            
          } catch (error) {
            return error
          }
    }

    serverAuthorizationFn = async (signable: any): Promise<any> => {
        const decodedMessage = decode(Buffer.from(signable.message.slice(64), 'hex'))
        const cadenceCode = decodedMessage[0].toString();
        
        if(cadenceCode.replace(/\s/g, '') === mintOrbies.replace(/\s/g, '')){
            return AuthorizeTransaction.signTransaction(signable.message)
        } else {
            return null
        }
    }

}

export default new OrbiesService();