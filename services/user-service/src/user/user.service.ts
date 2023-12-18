import { Inject, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entities/user.entity';
import { Enums, Types } from '@asarkisyan/nestjs-foodapp-shared';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {Cache} from 'cache-manager';
import { randomUUID } from 'crypto';

@Injectable()
export class UserService {
  private authSecret: string;

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectModel(User)
    private userModel: typeof User,
    private readonly jwtService: JwtService,
    private configService: ConfigService,
  ) {
    this.authSecret = this.configService.get('AUTH_SECRET', 'default');
   }
  async create(createUserDto: Types.User.CreateUserDto) {
    try {
      const { name, email, password } = createUserDto;
      const exists = await this.userModel.findOne({ where: { email } });

      if (exists && exists.id) {
        throw new RpcException(Enums.User.Messages.USER_EXIST_ERROR);
      }

      let user = await this.userModel.create({ name, email, password });

      return user;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  async login(user: Types.User.LoginUser, userData: { name: string }) {
    const payload = { user, sub: user.email };
    
    const accessToken = this.jwtService.sign(payload);

    if (!accessToken) {
      throw new RpcException(Enums.User.Messages.TOKEN_VALIDATION_ERROR);
    }

    delete user.password;

    const { email } = { ...user };

    /** Generate opaque/reference token with no meaning and tie it to the jwt access token */
    const opaqueToken = randomUUID();
    const ttl = 600000; // 10 minutes in millisecods
    // const ttl = 30000; // for testing refresh token
    
    await this.cacheManager.set(email, opaqueToken, ttl);
    await this.cacheManager.set(opaqueToken, accessToken, ttl);

    /** Generate the refresh token. Create a predefined key, to be used from Next API */
    const refreshToken = randomUUID();
    const refreshTokenTtl = 43200000; // 12 hours in millisecods
    const refreshTokenKey = user.email + this.authSecret;

    await this.cacheManager.set(refreshTokenKey, refreshToken, refreshTokenTtl);
    await this.cacheManager.set(refreshToken, email, refreshTokenTtl);

    console.log('opaqueToken--', opaqueToken)
    console.log('refreshToken--', refreshToken)
    
    return {
      opaqueToken,
      email,
      tokenTimestamp: Math.floor(Date.now() / 1000) 
    };
  }

  async validateToken(opaqueToken: string) {
    let jwt: string = await this.cacheManager.get(opaqueToken);
    
    return this.jwtService.verify(jwt);
  }

  async findOne(id: number) {
    return await this.userModel.findOne({ where: { id } });
  }

  async findByEmailAndPassword(email: string, password: string) {
    return await this.userModel.findOne({ where: { email, password } });
  }

  async findByEmail(email: string) {
    return await this.userModel.findOne({
      where: {
        email
      }
    });
  }

  async getUserFromToken(opaqueToken: string) {
    let userData = await this.validateToken(opaqueToken)
    let email = userData.user.email;

    return this.findByEmail(email);
  }

  async refreshToken(refreshTokenDto: { refreshToken: string, email: string}) {
    const email = refreshTokenDto.email;
    const user = await this.findByEmail(email)

    const loginData = {
      email,
      password: user.password
    }

    let userData = {
      name: user.name
    }

    return await this.login(loginData, userData);
  }
}
