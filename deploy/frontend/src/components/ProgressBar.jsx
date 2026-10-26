import { useTranslation } from 'react-i18next';
import '../utils/translations';

export default function ProgressBar({ current, total }) {
    const { t } = useTranslation();

    return (
        <div className="mb-8">
            <div className="flex justify-between text-xs text-gray-400 mb-2">
            <span>{t('rsvp.step_progress', { currentProgress: current, totalSteps: total })}</span>
            </div>
            {/* Visual only: the step text above is what screen readers read */}
            <div className="h-1 bg-gray-200 rounded-full overflow-hidden" aria-hidden="true">
            <div
                className="h-full bg-gold transition-all duration-500 motion-reduce:transition-none"
                style={{ width: `${(current / total) * 100}%` }}
            ></div>
            </div>
        </div>
    );
}
