import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import '../utils/translations';
import ProgressBar from './ProgressBar';
import ToggleGroup from './ToggleGroup';

// Defaults when no options are set in wp-admin (labels: rsvp.meal_options.<key>)
const DEFAULT_MEAL_OPTIONS = ['meat', 'fish', 'gluten_free', 'vegetarian', 'vegan'];
// Same for allergens (labels: rsvp.allergen_options.<key>)
const DEFAULT_ALLERGENS = ['gluten', 'milk', 'eggs', 'peanuts', 'nuts', 'fish', 'shellfish', 'soy', 'sesame'];

const STEPS = {
    CODE_ENTRY: 0,
    GUESTS: 1,
    ATTENDANCE: 2,
    PREFERENCES: 3,
    REVIEW: 4,
    SUCCESS: 5,
    DECLINED: 6,
};

const API_BASE = import.meta.env.VITE_API_BASE;

// Text fields: 3:1 border, visible focus ring
const INPUT_BASE = 'px-4 py-3 border rounded-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary';
const INPUT_CLASS = `w-full ${INPUT_BASE} border-gray-500`;

export default function RSVPForm({ accessCode: initialCode, formHead }) {
    const { t } = useTranslation();

    // Off for a fixed menu
    const askMealChoice = formHead?.askMealChoice !== false;

    // wp-admin options shown as written, else translated defaults
    const customMealOptions = formHead?.mealOptions?.length ? formHead.mealOptions : null;
    const mealOptions = customMealOptions || DEFAULT_MEAL_OPTIONS;
    const mealLabel = (option) => (customMealOptions ? option : t(`rsvp.meal_options.${option}`));

    // Same for allergens
    const customAllergens = formHead?.allergens?.length ? formHead.allergens : null;
    const allergenOptions = customAllergens || DEFAULT_ALLERGENS;
    const allergenLabel = (option) => (customAllergens ? option : t(`rsvp.allergen_options.${option}`));

    const [currentStep, setCurrentStep] = useState(STEPS.CODE_ENTRY);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Focus the new step's heading after a guest action (not on page load)
    const stepHeadingRef = useRef(null);
    const focusNextStep = useRef(false);
    const goToStep = (step) => {
        focusNextStep.current = true;
        setCurrentStep(step);
    };
    useEffect(() => {
        if (focusNextStep.current) {
            focusNextStep.current = false;
            stepHeadingRef.current?.focus();
        }
    }, [currentStep]);
    const stepHeadingProps = { ref: stepHeadingRef, tabIndex: -1 };

    const [formData, setFormData] = useState({
        accessCode: initialCode || '',
        attendance: null,
        guests: [{ firstName: '', lastName: '', ageCategory: 'adult' }],
        mealPreferences: [],
        allergens: [],
        dietaryRestrictions: '',
        songRequest: '',
    });

    // Validate URL code on mount
    useEffect(() => {
        const checkInitialCode = async () => {
        if (initialCode) {
            setIsLoading(true);
            try {
            const res = await fetch(`${API_BASE}/validate-code`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: initialCode }),
            });
            if (res.ok) {
                setFormData(prev => ({ ...prev, accessCode: initialCode.toUpperCase() }));
                setCurrentStep(STEPS.GUESTS);
            }
            } catch {
            console.error('Initial code validation failed');
            } finally {
            setIsLoading(false);
            }
        }
        };
        checkInitialCode();
    }, [initialCode]);

    const validateCode = async () => {
        setIsLoading(true);
        setError('');

        try {
        const response = await fetch(`${API_BASE}/validate-code`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: formData.accessCode }),
        });

        if (response.ok) {
            setFormData(prev => ({ ...prev, accessCode: prev.accessCode.toUpperCase() }));
            goToStep(STEPS.GUESTS);
        } else {
            setError(t('rsvp.error_code'));
        }
        } catch {
        setError(t('rsvp.error_general'));
        } finally {
        setIsLoading(false);
        }
    };

    // Names are already filled, so a decline is submitted right away
    const handleAttendance = (attending) => {
        const data = { ...formData, attendance: attending };
        setFormData(data);
        if (attending) {
            goToStep(STEPS.PREFERENCES);
        } else {
            submitRSVP(data, STEPS.DECLINED);
        }
    };

    // Multi-choice fields (mealPreferences, allergens)
    const toggleChoice = (field, option) => {
        setFormData(prev => ({
        ...prev,
        [field]: prev[field].includes(option)
            ? prev[field].filter(p => p !== option)
            : [...prev[field], option],
        }));
    };

    // Last name prefilled from the first guest
    const addGuest = () => {
        setFormData(prev => ({
        ...prev,
        guests: [...prev.guests, { firstName: '', lastName: prev.guests[0].lastName, ageCategory: 'adult' }],
        }));
    };

    const removeGuest = (index) => {
        if (formData.guests.length > 1) {
        setFormData(prev => ({
            ...prev,
            guests: prev.guests.filter((_, i) => i !== index),
        }));
        }
    };

    const updateGuest = (index, field, value) => {
        setFormData(prev => ({
        ...prev,
        guests: prev.guests.map((guest, i) =>
            i === index ? { ...guest, [field]: value } : guest
        ),
        }));
    };

    const submitRSVP = async (data = formData, nextStep = STEPS.SUCCESS) => {
        setIsLoading(true);
        setError('');

        try {
        const API_URL = `${API_BASE}/rsvp`;
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            goToStep(nextStep);
        } else {
            throw new Error('Submission failed');
        }
        } catch {
        setError(t('rsvp.error_general'));
        } finally {
        setIsLoading(false);
        }
    };

    // Both names required for every guest
    const guestFullName = (guest) => `${guest.firstName} ${guest.lastName}`.trim();
    const allGuestsNamed = formData.guests.every(g => g.firstName.trim() && g.lastName.trim());

    // Continue stays clickable and shows which names are missing
    const [showNameErrors, setShowNameErrors] = useState(false);
    const isNameMissing = (value) => showNameErrors && !value.trim();
    const nameInputClass = (value) =>
        `w-full ${INPUT_BASE} ${isNameMissing(value) ? 'border-red-600' : 'border-gray-500'}`;
    const continueToAttendance = () => {
        if (!allGuestsNamed) {
            setShowNameErrors(true);
            return;
        }
        goToStep(STEPS.ATTENDANCE);
    };

    const totalSteps = 4;
    const currentProgress = Math.min(currentStep, 4);

    return (
        <section id="rsvp" className="py-16 md:py-24 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
            <p className="text-secondary tracking-[0.3em] uppercase text-sm mb-2">{formHead.subtitle}</p>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-primary">{formHead.title}</h2>
            <div className="mt-4 w-24 h-px bg-accent mx-auto"></div>
            </div>

            {currentStep >= STEPS.GUESTS && currentStep <= STEPS.REVIEW && (
            <ProgressBar current={currentProgress} total={totalSteps} />
            )}

            {error && (
            <div role="alert" className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-sm">
                {error}
            </div>
            )}

            <div className="bg-surface p-8 md:p-12 rounded-sm">
            {currentStep === STEPS.CODE_ENTRY && (
                <form
                className="text-center"
                onSubmit={(e) => {
                    e.preventDefault();
                    validateCode();
                }}
                >
                <h3 {...stepHeadingProps} className="font-serif text-2xl text-primary mb-4 focus:outline-none">{t('rsvp.enter_your_code')}</h3>
                <p className="text-gray-600 mb-6">{t('rsvp.please_enter_your_code')}</p>
                <input
                    type="text"
                    value={formData.accessCode}
                    onChange={(e) => setFormData(prev => ({ ...prev, accessCode: e.target.value }))}
                    placeholder={t('rsvp.enter_code')}
                    aria-label={t('rsvp.access_code')}
                    autoComplete="off"
                    autoCapitalize="characters"
                    className={`${INPUT_BASE} border-gray-500 w-full max-w-xs mx-auto block text-center uppercase tracking-widest`}
                />
                <button
                    type="submit"
                    disabled={isLoading || !formData.accessCode}
                    className="mt-6 px-8 py-3 bg-primary text-white uppercase tracking-wider hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? t('rsvp.verification') : t('rsvp.continue')}
                </button>
                </form>
            )}

            {currentStep === STEPS.ATTENDANCE && (
                <div className="text-center">
                <h3 {...stepHeadingProps} className="font-serif text-2xl text-primary mb-4 focus:outline-none">{t('rsvp.will_you_join_us')}?</h3>
                <p className="text-gray-600 mb-8">{t('rsvp.we_truly_hope_you_can_celebrate_this_special_day_with_us')}.</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                    onClick={() => handleAttendance(true)}
                    disabled={isLoading}
                    className="px-12 py-4 bg-accent text-primary font-medium uppercase tracking-wider hover:bg-accent/90 transition-all motion-safe:hover:scale-105 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                    {t('rsvp.joyfully_accept')}
                    </button>
                    <button
                    onClick={() => handleAttendance(false)}
                    disabled={isLoading}
                    className="px-12 py-4 border-2 border-gray-300 text-gray-600 uppercase tracking-wider hover:border-primary hover:text-primary transition-colors rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                    {t('rsvp.regretfully_decline')}
                    </button>
                </div>
                <div className="flex justify-start mt-8">
                    <button
                    onClick={() => goToStep(STEPS.GUESTS)}
                    disabled={isLoading}
                    className="px-6 py-3 text-gray-500 hover:text-primary transition-colors"
                    >
                    ← {t('common.back')}
                    </button>
                </div>
                </div>
            )}

            {currentStep === STEPS.GUESTS && (
                <div>
                <h3 {...stepHeadingProps} className="font-serif text-2xl text-primary mb-6 text-center focus:outline-none">{t('rsvp.who_will_be_attending')}?</h3>

                <div className="space-y-4 mb-6">
                    {formData.guests.map((guest, index) => (
                    <div key={index} role="group" aria-label={t('rsvp.guest_n', { n: index + 1 })} className="flex flex-col sm:flex-row gap-3 sm:items-start">
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                            type="text"
                            value={guest.firstName}
                            onChange={(e) => updateGuest(index, 'firstName', e.target.value)}
                            placeholder={`${t('rsvp.first_name')} *`}
                            aria-label={t('rsvp.first_name')}
                            aria-required="true"
                            aria-invalid={isNameMissing(guest.firstName)}
                            autoComplete={index === 0 ? 'given-name' : 'off'}
                            className={nameInputClass(guest.firstName)}
                        />
                        <input
                            type="text"
                            value={guest.lastName}
                            onChange={(e) => updateGuest(index, 'lastName', e.target.value)}
                            placeholder={`${t('rsvp.last_name')} *`}
                            aria-label={t('rsvp.last_name')}
                            aria-required="true"
                            aria-invalid={isNameMissing(guest.lastName)}
                            autoComplete={index === 0 ? 'family-name' : 'off'}
                            className={nameInputClass(guest.lastName)}
                        />
                        </div>
                        <div className="flex gap-3">
                        <select
                            value={guest.ageCategory}
                            onChange={(e) => updateGuest(index, 'ageCategory', e.target.value)}
                            aria-label={t('rsvp.age_category')}
                            className={`${INPUT_BASE} border-gray-500 px-3 flex-1 sm:flex-none`}
                        >
                            <option value="adult">{t('rsvp.adult')}</option>
                            <option value="child">{t('rsvp.child')}</option>
                            <option value="teen">{t('rsvp.teen')}</option>
                            <option value="baby">{t('rsvp.baby')}</option>
                        </select>
                        {index > 0 && (
                            <button
                            onClick={() => removeGuest(index)}
                            aria-label={t('rsvp.remove_guest')}
                            className="min-w-11 min-h-11 flex items-center justify-center text-red-600 hover:text-red-800"
                            >
                            <span aria-hidden="true">✕</span>
                            </button>
                        )}
                        </div>
                    </div>
                    ))}
                </div>

                <button
                    onClick={addGuest}
                    className="w-full py-3 border-2 border-dashed border-gray-300 text-gray-500 hover:border-secondary hover:text-secondary transition-colors mb-8 rounded-sm"
                >
                    {t('rsvp.add_guest')}
                </button>

                {showNameErrors && !allGuestsNamed && (
                <p role="alert" className="mb-4 text-sm text-red-700 text-right">{t('rsvp.error_names')}</p>
                )}

                <div className="flex justify-end">
                    <button
                    onClick={continueToAttendance}
                    className="px-8 py-3 bg-primary text-white uppercase tracking-wider hover:bg-primary/90 transition-colors rounded-sm"
                    >
                    {t('rsvp.continue')}
                    </button>
                </div>
                </div>
            )}

            {currentStep === STEPS.PREFERENCES && (
                <div>
                <h3 {...stepHeadingProps} className="font-serif text-2xl text-primary mb-6 text-center focus:outline-none">{t('rsvp.meal_preferences')}</h3>

                {askMealChoice && (
                <fieldset className="mb-6">
                    <legend className="block text-sm text-gray-500 uppercase tracking-wider mb-3">{t('rsvp.meal_preferences_label')}</legend>
                    <ToggleGroup
                    options={mealOptions}
                    selected={formData.mealPreferences}
                    onToggle={(option) => toggleChoice('mealPreferences', option)}
                    getLabel={mealLabel}
                    />
                </fieldset>
                )}

                <fieldset className="mb-6">
                    <legend className="block text-sm text-gray-500 uppercase tracking-wider mb-3">{t('rsvp.allergens_label')}</legend>
                    <ToggleGroup
                    options={allergenOptions}
                    selected={formData.allergens}
                    onToggle={(option) => toggleChoice('allergens', option)}
                    getLabel={allergenLabel}
                    />
                </fieldset>

                <div className="mb-6">
                    <label htmlFor="rsvp-dietary" className="block text-sm text-gray-500 uppercase tracking-wider mb-3">{t('rsvp.dietary_other')}</label>
                    <input
                    id="rsvp-dietary"
                    type="text"
                    value={formData.dietaryRestrictions}
                    onChange={(e) => setFormData(prev => ({ ...prev, dietaryRestrictions: e.target.value }))}
                    placeholder={t('rsvp.dietary_placeholder')}
                    className={INPUT_CLASS}
                    />
                </div>

                <div className="mb-8">
                    <label htmlFor="rsvp-song" className="block text-sm text-gray-500 uppercase tracking-wider mb-3">{t('rsvp.song_request')}</label>
                    <input
                    id="rsvp-song"
                    type="text"
                    value={formData.songRequest}
                    onChange={(e) => setFormData(prev => ({ ...prev, songRequest: e.target.value }))}
                    placeholder={t('rsvp.song_placeholder')}
                    className={INPUT_CLASS}
                    />
                </div>

                <div className="flex justify-between">
                    <button
                    onClick={() => goToStep(STEPS.ATTENDANCE)}
                    className="px-6 py-3 text-gray-500 hover:text-primary transition-colors"
                    >
                    ← {t('common.back')}
                    </button>
                    <button
                    onClick={() => goToStep(STEPS.REVIEW)}
                    className="px-8 py-3 bg-primary text-white uppercase tracking-wider hover:bg-primary/90 transition-colors rounded-sm"
                    >
                    {t('rsvp.continue')}
                    </button>
                </div>
                </div>
            )}

            {currentStep === STEPS.REVIEW && (
                <div>
                <h3 {...stepHeadingProps} className="font-serif text-2xl text-primary mb-6 text-center focus:outline-none">{t('rsvp.review')}</h3>

                <div className="space-y-4 mb-8">
                    <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-500">{t('rsvp.guests')}</span>
                    <span className="text-primary font-medium">{formData.guests.map(guestFullName).join(', ')}</span>
                    </div>
                    {askMealChoice && (
                    <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-500">{t('rsvp.meal_preferences')}</span>
                    <span className="text-primary font-medium">{formData.mealPreferences.length > 0
                        ? formData.mealPreferences.map(mealLabel).join(', ')
                        : t('common.none')}</span>
                    </div>
                    )}
                    {formData.allergens.length > 0 && (
                    <div className="flex justify-between py-3 border-b border-gray-200">
                        <span className="text-gray-500">{t('rsvp.allergens')}</span>
                        <span className="text-primary font-medium">{formData.allergens.map(allergenLabel).join(', ')}</span>
                    </div>
                    )}
                    {formData.dietaryRestrictions && (
                    <div className="flex justify-between py-3 border-b border-gray-200">
                        <span className="text-gray-500">{t('rsvp.dietary_notes')}</span>
                        <span className="text-primary font-medium">{formData.dietaryRestrictions}</span>
                    </div>
                    )}
                    {formData.songRequest && (
                    <div className="flex justify-between py-3 border-b border-gray-200">
                        <span className="text-gray-500">{t('rsvp.song_request')}</span>
                        <span className="text-primary font-medium">{formData.songRequest}</span>
                    </div>
                    )}
                </div>

                <div className="flex justify-between">
                    <button
                    onClick={() => goToStep(STEPS.PREFERENCES)}
                    className="px-6 py-3 text-gray-500 hover:text-primary transition-colors"
                    >
                    ← {t('rsvp.edit')}
                    </button>
                    <button
                    onClick={() => submitRSVP()}
                    disabled={isLoading}
                    className="px-8 py-3 bg-accent text-primary uppercase tracking-wider hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-sm"
                    >
                    {isLoading ? t('rsvp.submitting') : t('rsvp.submit')}
                    </button>
                </div>
                </div>
            )}

            {currentStep === STEPS.SUCCESS && (
                <div className="text-center py-8">
                <div className="text-6xl mb-6" aria-hidden="true">🎉</div>
                <h3 {...stepHeadingProps} className="font-serif text-3xl text-primary mb-4 focus:outline-none">{t('rsvp.thank_you')}</h3>
                <p className="text-gray-600 mb-2">{t('rsvp.your_rsvp_has_been_received')}</p>
                <p className="text-gray-600">{t('rsvp.we_cannot_wait_to_celebrate_with_you')}</p>
                </div>
            )}

            {currentStep === STEPS.DECLINED && (
                <div className="text-center py-8">
                <div className="text-6xl mb-6" aria-hidden="true">💝</div>
                <h3 {...stepHeadingProps} className="font-serif text-3xl text-primary mb-4 focus:outline-none">{t('rsvp.we_will_miss_you')}</h3>
                <p className="text-gray-600 mb-2">{t('rsvp.thank_you_for_letting_us_know')}</p>
                <p className="text-gray-600">{t('rsvp.you_will_be_in_our_hearts_for_this_special_day')}</p>
                </div>
            )}

            </div>
        </div>
        </section>
    );
}
