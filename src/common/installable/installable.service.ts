import { Model } from 'mongoose';
import { UserFieldDto } from '../../modules/users/dto/user-field.dto';

export abstract class InstallableService<DocumentType> {
  protected abstract model: Model<DocumentType>;

  abstract findById(id: string): Promise<DocumentType>;

  abstract create(userFieldDto: UserFieldDto): Promise<DocumentType>;

  abstract getInitialData(): any[];
  async install(): Promise<number> {
    const initialData = this.getInitialData();
    const n = initialData.length;
    let counter = 0;
    for (let i = 0; i < n; i++) {
      const elem = initialData[i];
      const existingItem = await this.findById(elem._id);
      if (!existingItem) {
        await this.create(elem);
        counter++;
      }
    }
    return counter;
  }
}
