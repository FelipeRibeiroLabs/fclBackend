import { User } from "@models/user/User";
import OrbiesService from "app/services/orbies/OrbiesService";
import { Request, Response } from "express";

class OrbiesController {
  public async getOrbies(req: Request, res: Response): Promise<Response> {
    const { address } = req.body;
    let user: User
    
    try{
        user = await OrbiesService.addOrbies(address);
        return res.status(200).json({ result: user });
    } catch(error: any) {
        return res.status(400).json({ error: error });
    }    
  }

  public async getServerAuth(req: Request, res: Response): Promise<Response>{
    const { signable } = req.body
    const result = await OrbiesService.serverAuthorizationFn(signable)
    if(result !== null){
        return res.status(200).json({ result: result })
    } else {
        return res.status(401).json({ error: 'Not authorized' })
    }
  }

}


export default new OrbiesController();
