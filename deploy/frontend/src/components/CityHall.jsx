import VenueLocation from './VenueLocation';
import { useTranslation } from 'react-i18next';

export default function CityHall({ cityHall: apiCityHall }) {
    const cityHall = apiCityHall || {};
    const { t } = useTranslation();

    return (
        <VenueLocation
        title={cityHall.name || t('defaults.city_hall_name')}
        address={cityHall.address || t('defaults.city_hall_address')}
        description={cityHall.description || t('defaults.city_hall_description')}
        gettingThere={cityHall.gettingThere}
        mapOrder="rtl"
        />
    );
}
