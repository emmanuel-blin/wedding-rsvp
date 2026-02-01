import VenueLocation from './VenueLocation';
import { useTranslation } from 'react-i18next';

export default function CityHall({ cityHall: apiCityHall }) {
  const cityHall = apiCityHall || {};
  const { t } = useTranslation();  

  return (
    <VenueLocation
      title={cityHall.name || "Mairie"}
      address={cityHall.address || "Hôtel de Ville"}
      description={cityHall.description || "Join us for the civil ceremony at the local City Hall."}
      gettingThere={cityHall.gettingThere}
      mapOrder="rtl"
    />
  );
}
