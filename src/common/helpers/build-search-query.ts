import moment from 'moment';

export const buildSearchQuery = (search: Record<string, any>) => {
  const { page, limit, ...arg } = Object.assign({}, search);
  const vPage = parseInt(page) || 1;
  const vLimit = parseInt(limit) || 10;

  const skip = (vPage - 1) * vLimit;

  const query = {} as Record<string, any>;
  const conditions = Object.entries(arg);
  conditions.map(([key, value]) => {
    if (!['time_from', 'time_to'].includes(key))
      query[key] = { $regex: value, $options: 'i' };
  });

  const { time_from, time_to } = arg;
  let vTimeFrom, vTimeTo;
  if (time_from)
    vTimeFrom = new Date(
      moment(time_from, 'YYYY-MM-DD').startOf('day').toISOString(),
    );
  if (time_to)
    vTimeTo = new Date(
      moment(time_to, 'YYYY-MM-DD').endOf('day').toISOString(),
    );
  if (time_from) query['created_at'] = { $gte: vTimeFrom };
  if (time_to) query['created_at'] = { $lte: vTimeTo };
  if (time_from && time_to)
    query['created_at'] = { $gte: vTimeFrom, $lte: vTimeTo };

  return {
    query,
    options: {
      page: vPage,
      limit: vLimit,
      skip,
    },
  };
};
