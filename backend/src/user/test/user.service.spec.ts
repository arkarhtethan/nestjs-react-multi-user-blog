import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '../../jwt/jwt.service';
import { CreateUserDto, CreateUserOutput } from '../dto/create-user.dto';
import { LoginDto, LoginOutput } from '../dto/login.dto';
import { User } from '../entities/user.entity';
import { UserService } from '../user.service';
import { getUserStub } from './stubs/user.stub';

const mockRepoitory = () => ({
  save: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
});

const mockJwtService = () => ({
  sign: jest.fn(() => "signed-token-baby"),
  verify: jest.fn(),
});


type MockRepoitory<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('UserService', () => {
  let service: UserService;
  let userRepository: MockRepoitory<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepoitory(),
        },
        {
          provide: JwtService,
          useValue: mockJwtService(),
        },


      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get(getRepositoryToken(User));
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined()
  });

  describe("register()", () => {
    let createUserOutput: CreateUserOutput;
    let createUserDto: CreateUserDto = {
      email: getUserStub().email,
      name: getUserStub().name,
      password: "111111",
    }
    describe('when register is called', () => {

      it("should create a new user", async () => {
        createUserOutput = await service.register(createUserDto);
        expect(createUserOutput.ok).toEqual(true);
        expect(createUserOutput.error).toEqual(undefined);

        expect(userRepository.create).toHaveBeenCalledTimes(1);
        expect(userRepository.create).toHaveBeenCalledWith(createUserDto);

        expect(userRepository.save).toHaveBeenCalledTimes(1);
      })

      it('should fail on error when creating user.', async () => {
        userRepository.create.mockRejectedValueOnce(new Error(''))

        createUserOutput = await service.register(createUserDto);

        expect(userRepository.create).toHaveBeenCalledTimes(1);
        expect(userRepository.create).toHaveBeenCalledWith(createUserDto);

        expect(createUserOutput.ok).toEqual(false);
        expect(createUserOutput.error).not.toEqual(undefined);
        expect(createUserOutput.error).toEqual("Cannot create user.");
      })

      it('should fail when duplicate record found.', async () => {
        userRepository.create.mockRejectedValueOnce(new Error())

        createUserOutput = await service.register(createUserDto);

        expect(userRepository.create).toHaveBeenCalledTimes(1);
        expect(userRepository.create).toHaveBeenCalledWith(createUserDto);

        expect(createUserOutput.ok).toEqual(false);
        expect(createUserOutput.error).not.toEqual(undefined);
        expect(createUserOutput.error).toEqual("Cannot create user.");
      })

    })

  });

  describe("login()", () => {
    let loginOutput: LoginOutput;
    let loginDto: LoginDto = {
      email: "arkar@gmail.com",
      password: "111111"
    };
    it('should fail on error when creating user.', async () => {
      userRepository.findOne.mockResolvedValueOnce(null);
      loginOutput = await service.login(loginDto);
      expect(userRepository.findOne).toHaveBeenCalledTimes(1);
      expect(userRepository.findOne).toHaveBeenCalledWith(loginDto);
      expect(loginOutput).toThrowError();
    })
  });

  describe("findAll()", () => {

  });

  describe("findOne()", () => {

  });

  describe("update()", () => {

  });

  describe("changePassword()", () => {

  });

  describe("myProfile()", () => {

  });

  describe("deleteAccount()", () => {

  });


});
