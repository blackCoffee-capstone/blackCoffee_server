import { PickType } from '@nestjs/swagger';
import { LoginRequestDto } from './login-request.dto';

export class DeleteUserRequestDto extends PickType(LoginRequestDto, ['password']) {}
