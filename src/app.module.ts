import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';
import { PersonModule } from './person/person.module';
import { LocationsModule } from './locations/locations.module';
import { InventoryModule } from './inventory/inventory.module';
@Module({
  imports: [UsersModule, AuthModule, RolesModule, PersonModule, LocationsModule, InventoryModule],
  providers: [],
})
export class AppModule {}
