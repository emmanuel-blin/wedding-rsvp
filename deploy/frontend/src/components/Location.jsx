import VenueLocation from './VenueLocation';
import { useTranslation } from 'react-i18next';

export default function Location({ venue: apiVenue }) {
  const venue = apiVenue || {};
  const { t } = useTranslation();
  
  return (
    <VenueLocation
      title={venue.name || "Reception Venue"}
      address={venue.address || "Venue Address"}
      description={venue.description || "Following the ceremony, join us for a night of celebration, dinner, and dancing."}
      gettingThere={venue.gettingThere}
      mapOrder="ltr"
    />
  );
}
