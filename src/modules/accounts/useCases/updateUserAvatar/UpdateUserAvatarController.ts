import { Request, Response } from "express";
import { container } from "tsyringe";
import { UpdateUserAvatarUseCase } from "./UpdateUserAvatarUseCase";

class UpdateUserAvatarController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id } = req.user;

    //Receber arquivo
    const avatar_file = req.file.filename;

    const updateUserAvatarUseCade = container.resolve(UpdateUserAvatarUseCase);
    await updateUserAvatarUseCade.execute({ user_id: id, avatar_file });

    return res.status(204).send();
  }
}

export { UpdateUserAvatarController };