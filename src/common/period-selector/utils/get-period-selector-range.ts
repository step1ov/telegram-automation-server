import dayjs from 'dayjs';
import { PeriodSelectorDto } from '../dto/period-selector.dto';

const GetPeriodSelectorRange = (data: PeriodSelectorDto): Date | Date[] => {
  switch (data.periodType) {
    case 'date':
      return data.start || new Date();
    case 'range':
      return [data.start || new Date(), data.finish || new Date()];
    case 'yesterday':
      return dayjs().subtract(1, 'day').toDate();
    case 'week':
      return [dayjs().subtract(1, 'week').toDate(), new Date()];
    case 'month':
      return [dayjs().subtract(1, 'month').toDate(), new Date()];
    case 'quarter':
      return [dayjs().subtract(4, 'month').toDate(), new Date()];
    case 'year':
      return [dayjs().subtract(1, 'year').toDate(), new Date()];
  }
  return new Date();
};

export default GetPeriodSelectorRange;
