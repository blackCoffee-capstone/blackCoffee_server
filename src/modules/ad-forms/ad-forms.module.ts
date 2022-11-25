import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdForm } from 'src/entities/ad-form.entity';
import { Location } from 'src/entities/locations.entity';
import { AdFormsController } from './ad-forms.controller';
import { AdFormsService } from './ad-forms.service';

@Module({
	imports: [TypeOrmModule.forFeature([AdForm, Location])],
	controllers: [AdFormsController],
	providers: [AdFormsService],
	exports: [AdFormsService],
})
export class AdFormsModule {}
