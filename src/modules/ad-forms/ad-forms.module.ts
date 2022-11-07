import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdForm } from 'src/entities/ad-form.entity';
import { AdFormsController } from './ad-forms.controller';
import { AdFormsService } from './ad-forms.service';

@Module({
	imports: [TypeOrmModule.forFeature([AdForm])],
	controllers: [AdFormsController],
	providers: [AdFormsService],
})
export class AdFormsModule {}
