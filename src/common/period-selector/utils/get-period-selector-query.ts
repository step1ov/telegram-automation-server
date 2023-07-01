import { PeriodSelectorDto } from '../dto/period-selector.dto';
import { FilterQuery } from 'mongoose';
import GetPeriodSelectorRange from './get-period-selector-range';
import GetDateTimestamp from '../../../utils/get-date-timestamp';

const GetPeriodSelectorQuery = (data: PeriodSelectorDto): FilterQuery<any> => {
  const dates = GetPeriodSelectorRange(data);
  if (Array.isArray(dates)) {
    const start = GetDateTimestamp(new Date(dates[0]));
    const finish = GetDateTimestamp(new Date(dates[1]));
    return { day: { $gte: start, $lte: finish } };
  } else {
    const day = GetDateTimestamp(new Date(dates));
    return { day };
  }
};

export default GetPeriodSelectorQuery;
