export class SysInfoDto {
  readonly uptime: number;
  readonly timezone: string;
  readonly cpuModel: string;
  readonly cpuCores: number;
  readonly cpuLoad: number;
  readonly memoryTotal: number;
  readonly memoryFree: number;
  readonly memoryUsed: number;
  readonly os: string;
  readonly fsTotal: number;
  readonly fsUsed: number;
  readonly fsFree: number;
}
