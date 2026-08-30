import { Router } from 'express';
import { appState } from '../store.js';
import { successResponse } from '../utils/apiResponse.js';

const router = Router();

router.get('/donors', (req, res) => {
  const bloodGroup = String(req.query.bloodGroup || '').trim();
  const city = String(req.query.city || '').trim();
  const area = String(req.query.area || '').trim();

  const filtered = appState.donors.filter((donor) => {
    const bloodMatches = !bloodGroup || donor.bloodGroup === bloodGroup;
    const cityMatches = !city || donor.city.toLowerCase().includes(city.toLowerCase());
    const areaMatches = !area || donor.area.toLowerCase().includes(area.toLowerCase());
    return bloodMatches && cityMatches && areaMatches;
  });

  res.json(
    successResponse(
      {
        total: filtered.length,
        results: filtered.map((donor) => ({
          id: donor.id,
          name: donor.name,
          bloodGroup: donor.bloodGroup,
          city: donor.city,
          area: donor.area,
          availability: donor.availability,
          verified: donor.verificationStatus === 'VERIFIED',
          lastActive: donor.lastActive,
          donations: donor.donationCount,
          privacy: donor.privacy,
        })),
      },
      'Donor search results loaded.',
    ),
  );
});

router.get('/cities', (_req, res) => {
  const districts = ['Agra', 'Aligarh', 'Ambedkar Nagar', 'Amroha', 'Amethi', 'Auraiya', 'Ayodhya', 'Azamgarh', 'Bagpat', 'Bahraich', 'Ballia', 'Balrampur', 'Banda', 'Barabanki', 'Bareilly', 'Basti', 'Bhadohi', 'Bijnor', 'Budaun', 'Bulandshahr', 'Chandauli', 'Chitrakoot', 'Deoria', 'Etah', 'Etawah', 'Farrukhabad', 'Fatehpur', 'Firozabad', 'Gautam Buddha Nagar', 'Ghaziabad', 'Ghazipur', 'Gonda', 'Gorakhpur', 'Hamirpur', 'Hapur', 'Hardoi', 'Hathras', 'Jalaun', 'Jaunpur', 'Jhansi', 'Kannauj', 'Kanpur Dehat', 'Kanpur Nagar', 'Kasganj', 'Kaushambi', 'Kushinagar', 'Lakhimpur Kheri', 'Lalitpur', 'Lucknow', 'Maharajganj', 'Mahoba', 'Mainpuri', 'Mathura', 'Mau', 'Meerut', 'Mirzapur', 'Moradabad', 'Muzaffarnagar', 'Pilibhit', 'Pratapgarh', 'Prayagraj', 'Rae Bareli', 'Rampur', 'Saharanpur', 'Sambhal', 'Sant Kabir Nagar', 'Shahjahanpur', 'Shamli', 'Shravasti', 'Siddharthnagar', 'Sitapur', 'Sonbhadra', 'Sultanpur', 'Unnao', 'Varanasi'];
  const cities = districts.map((name) => ({ name, state: 'Uttar Pradesh', country: 'India' }));

  res.json(successResponse(cities));
});

export default router;
