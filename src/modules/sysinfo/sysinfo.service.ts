import { Injectable } from '@nestjs/common';
import * as si from 'systeminformation';

@Injectable()
export class SysInfoService {
  async getTime(): Promise<si.Systeminformation.TimeData> {
    return si.time();
  }
  async getCPU(): Promise<si.Systeminformation.CpuData> {
    return si.cpu();
  }

  async getLoad(): Promise<si.Systeminformation.CurrentLoadData> {
    return si.currentLoad();
  }

  async getMemory(): Promise<si.Systeminformation.MemData> {
    return si.mem();
  }

  async getOS(): Promise<si.Systeminformation.OsData> {
    return si.osInfo();
  }

  async getFS(): Promise<si.Systeminformation.FsSizeData[]> {
    return si.fsSize();
  }
}
