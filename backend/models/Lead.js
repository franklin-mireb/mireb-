import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  email: { type: String, required: true },
  telephone: { type: String },
  adresse: { type: String },
  ville: { type: String },
  entreprise: { type: String },
  source: { type: String },
  statut: { 
    type: String, 
    enum: ['nouveau', 'contacté', 'qualifié', 'perdu', 'gagné'], 
    default: 'nouveau' 
  },
  assigneA: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  creePar: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });
export default mongoose.model('Lead', leadSchema);
