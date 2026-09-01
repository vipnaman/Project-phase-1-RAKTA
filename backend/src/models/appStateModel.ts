import mongoose, { Schema } from 'mongoose';

const appStateSchema = new Schema(
  {
    key: { type: String, required: true, unique: true, index: true },
    users: { type: [Schema.Types.Mixed], default: [] },
    donors: { type: [Schema.Types.Mixed], default: [] },
    requests: { type: [Schema.Types.Mixed], default: [] },
    notifications: { type: [Schema.Types.Mixed], default: [] },
    helpResponses: { type: [Schema.Types.Mixed], default: [] },
    activities: { type: [Schema.Types.Mixed], default: [] },
  },
  { timestamps: true, versionKey: false },
);

export const AppStateModel = mongoose.models.RaktaAppState || mongoose.model('RaktaAppState', appStateSchema);
