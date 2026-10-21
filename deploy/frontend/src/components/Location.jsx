import VenueLocation from './VenueLocation';
import { useTranslation } from 'react-i18next';

export default function Location({ venue: apiVenue }) {
    const venue = apiVenue || {};
    const { t } = useTranslation();

    return (
        <VenueLocation
        title={venue.name || t('defaults.venue_name')}
        address={venue.address || t('defaults.venue_address')}
        description={venue.description || t('defaults.venue_description')}
        gettingThere={venue.gettingThere}
        mapOrder="ltr"
        />
    );
}
