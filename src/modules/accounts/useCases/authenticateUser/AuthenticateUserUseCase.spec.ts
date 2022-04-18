import { AppError } from "@shared/errors/AppError";
import { ICreateUserDTO } from "@modules/accounts/dtos/ICreateUserDTO";
import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersRepositoryInMemory";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

let usersRepositoryInMemory: UsersRepositoryInMemory;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

//Usuário autenticado
describe("Authenticated User", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    authenticateUserUseCase = new AuthenticateUserUseCase(
      usersRepositoryInMemory
    );
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });
  //Deve ser capaz de autenticar um usuário
  it("Should be able to authenticate an user", async () => {
    const user: ICreateUserDTO = {
      driver_license: "123123",
      email: "user@example.com",
      password: "1234",
      name: "User test",
    };
    await createUserUseCase.execute(user);

    const result = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    expect(result).toHaveProperty("token");
  });

  //não deve ser capaz de autenticar um usuário inexistente
  it("should not be able authenticate an none existent user", () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "false@email.com",
        password: "asdasd",
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  //não deve ser autenticado com senha incorreta
  it("should not be able to authenticated with incorrect password", () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        driver_license: "99999",
        email: "user@user.com",
        password: "asdasd",
        name: "User test error",
      };

      await createUserUseCase.execute(user);

      await authenticateUserUseCase.execute({
        email: user.email,
        password: "incorrectPassword",
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
