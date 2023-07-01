import { User } from '../../users/schemas/user.schema';

export class InstallResultDto {
  grantsAdded: number;
  rolesAdded: number;
  userAdded: User;
  settingsAdded: number;
}
