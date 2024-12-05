import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';

@Injectable()
export class RolesService {
  getRoles(): Role[] {
    return Object.values(Role);
  }
}
