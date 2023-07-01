import { Controller, Get, UseGuards } from '@nestjs/common';
import { SysInfoService } from './sysinfo.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SysInfoDto } from './dto/sysinfo.dto';

@Controller('sysinfo')
export class SysInfoController {
  constructor(private readonly sysInfoService: SysInfoService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getInfo(): Promise<SysInfoDto> {
    const time = await this.sysInfoService.getTime();
    const cpu = await this.sysInfoService.getCPU();
    const load = await this.sysInfoService.getLoad();
    const memory = await this.sysInfoService.getMemory();
    const os = await this.sysInfoService.getOS();
    const fs = await this.sysInfoService.getFS();
    let fsTotal = 0,
      fsFree = 0,
      fsUsed = 0;
    for (let i = 0; i < 1; i++) {
      const item = fs[i];
      fsTotal += item.size;
      fsFree += item.available;
      fsUsed += item.used;
    }

    return {
      uptime: time.uptime,
      timezone: time.timezone,
      cpuModel: cpu.manufacturer + ' ' + cpu.brand + ' ' + cpu.speed + 'GHz',
      cpuCores: cpu.cores,
      cpuLoad: load.currentLoad,
      memoryTotal: memory.total,
      memoryFree: memory.free,
      memoryUsed: memory.used,
      os: os.platform + ' ' + os.distro + ' ' + os.release,
      fsTotal,
      fsFree,
      fsUsed,
    };
  }
}
