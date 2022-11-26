import { PartialType } from '@nestjs/swagger';
import { UpdateReportsRequestDto } from './update-reports-request.dto';

export class AllReportsRequestDto extends PartialType(UpdateReportsRequestDto) {}
