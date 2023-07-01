import { FilterQuery } from 'mongoose';

const applyFilters = (
  query: FilterQuery<any>,
  filters?: Record<string, (number | string)[]>,
): FilterQuery<any> => {
  if (filters) {
    const filterQueries = Object.keys(filters)
      .filter((key) => filters[key] && Array.isArray(filters[key]))
      .map((key) => {
        const filterItem = filters[key];
        if (filterItem.length === 1) {
          return { [key]: filterItem[0] };
        }
        return { [key]: { $in: filterItem } };
      });

    if (filterQueries.length > 0) {
      if (filterQueries.length > 1 || Object.keys(query).length > 0) {
        query = {
          $and: [
            ...filterQueries,
            ...Object.entries(query).map(([key, value]) => ({
              [key]: value,
            })),
          ],
        };
      } else {
        query = filterQueries[0];
      }
    }
  }

  return query;
};

export default applyFilters;
