import slugify from 'slugify';

const getSlug = (value: string) =>
  slugify(value.replace('®', ''), { lower: true, strict: true });

export default getSlug;
