import { UsersService } from '../modules/users/users.service';
import { ObjectId } from 'mongodb';
import { HttpException, HttpStatus } from '@nestjs/common';

const checkUserExists = async (
  usersService: UsersService,
  userId: ObjectId,
) => {
  if (!(await usersService.findById(userId))) {
    throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
  }
};

export default checkUserExists;
