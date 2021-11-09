import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "src/jwt/jwt.service";
import { UserService } from "src/user/user.service";
import { AllowedRoles } from "./role.decorator";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
        private readonly reflector: Reflector,
    ) { }

    async canActivate (context: ExecutionContext) {
        const roles = this.reflector.get<AllowedRoles>('roles', context.getHandler());
        const request = context.switchToHttp().getRequest();
        const token = request.headers['x-jwt'];
        if (!roles) {
            return true;
        }
        if (token) {
            try {
                const decodedToken = this.jwtService.verify(token);
                if (typeof decodedToken === "object" && decodedToken.hasOwnProperty('id')) {
                    const { user } = await this.userService.findOne({ id: decodedToken.id });
                    if (!user) {
                        return false;
                    }
                    request.user = user;
                    if (roles.includes('Any')) {
                        return true;
                    }
                    return roles.includes(user.role)
                } else {
                    return false;
                }
            } catch (error) {
                return false;
            }
        }
        return false;
    }

}