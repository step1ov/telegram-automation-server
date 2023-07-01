import { Module } from '@nestjs/common';
import { SysInfoService } from './sysinfo.service';
import { SysInfoController } from './sysinfo.controller';

@Module({
  providers: [SysInfoService],
  exports: [SysInfoService],
  controllers: [SysInfoController],
})
export class SysInfoModule {}
