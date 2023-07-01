const schemaOptionsDefault = {
  timestamps: true,
  toJSON: {
    transform: (doc: any, ret) => {
      delete ret.__v;
      ret.id = ret._id;
      delete ret._id;
    },
    virtuals: true,
    getters: true,
  },
  toObject: { virtuals: true, getters: true },
};

export default schemaOptionsDefault;
