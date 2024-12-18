import { PartialType } from '@nestjs/swagger';
import { CreateWerehouseDto } from './create-werehouse.dto';

export class UpdateWerehouseDto extends PartialType(CreateWerehouseDto) {}
