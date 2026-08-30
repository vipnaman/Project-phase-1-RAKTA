import type { BloodGroup } from '../types/index.js';

const compatibilityMap: Record<BloodGroup, BloodGroup[]> = {
  'O-': ['O-'],
  'O+': ['O-', 'O+'],
  'A-': ['O-', 'A-'],
  'A+': ['O-', 'O+', 'A-', 'A+'],
  'B-': ['O-', 'B-'],
  'B+': ['O-', 'O+', 'B-', 'B+'],
  'AB-': ['O-', 'A-', 'B-', 'AB-'],
  'AB+': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
};

export function getCompatibleDonorGroups(requiredBloodGroup: BloodGroup): BloodGroup[] {
  return compatibilityMap[requiredBloodGroup] || [requiredBloodGroup];
}

export function getBloodCompatibilityInfo(requiredBloodGroup: BloodGroup): {
  potentialDonorMatch: BloodGroup[];
  medicalCompatibility: string;
  disclaimer: string;
} {
  return {
    potentialDonorMatch: getCompatibleDonorGroups(requiredBloodGroup),
    medicalCompatibility:
      'This is a general matching aid based on transfusion compatibility rules. Final compatibility must be confirmed by a qualified medical professional or blood bank.',
    disclaimer:
      'RAKTA does not replace hospital, blood bank, or clinical decision-making. Actual medical eligibility must be reviewed by trained healthcare professionals before transfusion.',
  };
}
