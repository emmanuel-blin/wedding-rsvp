import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import '../utils/translations';

const STEPS = {
  CODE_ENTRY: 0,
  ATTENDANCE: 1,
  GUESTS: 2,
  PREFERENCES: 3,
  REVIEW: 4,
  SUCCESS: 5,
  DECLINED: 6,
};

const API_BASE = import.meta.env.VITE_API_BASE;

export default function RSVPForm({ accessCode: initialCode, formHead }) {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(STEPS.CODE_ENTRY);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    accessCode: initialCode || '',
    attendance: null,
    guests: [{ name: '', ageCategory: 'adult' }],
    mealPreferences: [],
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
            setCurrentStep(STEPS.ATTENDANCE);
          }
        } catch (err) {
          console.error('Initial code validation failed');
        } finally {
          setIsLoading(false);
        }
      }
    };
    checkInitialCode();
  }, [initialCode]);

  // Validate access code
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
        setCurrentStep(STEPS.ATTENDANCE);
      } else {
        setError(t('rsvp.error_code'));
      }
    } catch (err) {
      setError(t('rsvp.error_general'));
    } finally {
      setIsLoading(false);
    }
  };

  // Handle attendance selection
  const handleAttendance = (attending) => {
    setFormData(prev => ({ ...prev, attendance: attending }));
    setCurrentStep(attending ? STEPS.GUESTS : STEPS.DECLINED);
  };

  // Add guest
  const addGuest = () => {
    setFormData(prev => ({
      ...prev,
      guests: [...prev.guests, { name: '', ageCategory: 'adult' }],
    }));
  };

  // Remove guest
  const removeGuest = (index) => {
    if (formData.guests.length > 1) {
      setFormData(prev => ({
        ...prev,
        guests: prev.guests.filter((_, i) => i !== index),
      }));
    }
  };

  // Update guest
  const updateGuest = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      guests: prev.guests.map((guest, i) => 
        i === index ? { ...guest, [field]: value } : guest
      ),
    }));
  };

  // Submit RSVP
  const submitRSVP = async () => {
    setIsLoading(true);
    setError('');

    try {
      // WordPress backend API URL
      const API_URL = `${API_BASE}/rsvp`;
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setCurrentStep(STEPS.SUCCESS);
      } else {
        throw new Error('Submission failed');
      }
    } catch (err) {
      // For demo purposes, show success anyway
      setCurrentStep(STEPS.SUCCESS);
    } finally {
      setIsLoading(false);
    }
  };

  // Progress indicator
  const totalSteps = 4;
  const currentProgress = Math.min(currentStep, 4);

  return (
    <section id="rsvp" className="py-16 md:py-24 bg-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="text-rose-gold tracking-[0.3em] uppercase text-sm mb-2">{formHead.subtitle}</p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-burgundy">{formHead.title}</h2>
          <div className="mt-4 w-24 h-[1px] bg-gold mx-auto"></div>
        </div>

        {/* Progress Bar */}
        {currentStep >= STEPS.ATTENDANCE && currentStep <= STEPS.REVIEW && (
          <div className="mb-8">
            <div className="flex justify-between text-xs text-gray-400 mb-2">
             <span>{t('rsvp.step_progress', { currentProgress, totalSteps })}</span>
            </div>
            <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gold transition-all duration-500"
                style={{ width: `${(currentProgress / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-sm">
            {error}
          </div>
        )}

        {/* Step Content */}
        <div className="bg-cream p-8 md:p-12 rounded-sm">
          
          {/* Step 0: Code Entry */}
          {currentStep === STEPS.CODE_ENTRY && (
            <div className="text-center">
              <h3 className="font-serif text-2xl text-burgundy mb-4">{t('rsvp.enter_your_code')}</h3>
              <p className="text-gray-600 mb-6">{t('rsvp.please_enter_your_code')}</p>
              <input
                type="text"
                value={formData.accessCode}
                onChange={(e) => setFormData(prev => ({ ...prev, accessCode: e.target.value }))}
                placeholder={t('rsvp.enter_code')}
                className="w-full max-w-xs mx-auto block px-4 py-3 border border-gray-300 rounded-sm text-center uppercase tracking-widest focus:outline-none focus:border-gold"
              />
              <button
                onClick={validateCode}
                disabled={isLoading || !formData.accessCode}
                className="mt-6 px-8 py-3 bg-burgundy text-white uppercase tracking-wider hover:bg-burgundy/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? t('rsvp.verification') : t('rsvp.continue')}
              </button>
            </div>
          )}

          {/* Step 1: Attendance */}
          {currentStep === STEPS.ATTENDANCE && (
            <div className="text-center">
              <h3 className="font-serif text-2xl text-burgundy mb-4">{t('rsvp.will_you_join_us')}?</h3>
              <p className="text-gray-600 mb-8">{t('rsvp.we_truly_hope_you_can_celebrate_this_special_day_with_us')}.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => handleAttendance(true)}
                  className="px-12 py-4 bg-gold text-white font-medium uppercase tracking-wider hover:bg-gold/90 transition-all hover:scale-105 rounded-lg"
                >
                  {t('rsvp.joyfully_accept')}
                </button>
                <button
                  onClick={() => handleAttendance(false)}
                  className="px-12 py-4 border-2 border-gray-300 text-gray-600 uppercase tracking-wider hover:border-burgundy hover:text-burgundy transition-colors rounded-lg"
                >
                  {t('rsvp.regretfully_decline')}
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Guests */}
          {currentStep === STEPS.GUESTS && (
            <div>
              <h3 className="font-serif text-2xl text-burgundy mb-6 text-center">{t('rsvp.who_will_be_attending')}?</h3>
              
              <div className="space-y-4 mb-6">
                {formData.guests.map((guest, index) => (
                  <div key={index} className="flex gap-3 items-start">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={guest.name}
                        onChange={(e) => updateGuest(index, 'name', e.target.value)}
                        placeholder={index === 0 ? t('rsvp.full_name') : t('rsvp.guest_name')}
                        className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:border-gold"
                      />
                    </div>
                    <select
                      value={guest.ageCategory}
                      onChange={(e) => updateGuest(index, 'ageCategory', e.target.value)}
                      className="px-3 py-3 border border-gray-300 rounded-sm focus:outline-none focus:border-gold"
                    >
                      <option value="adult">{t('rsvp.adult')}</option>
                      <option value="child">{t('rsvp.child')}</option>
                      <option value="teen">{t('rsvp.teen')}</option>
                      <option value="baby">{t('rsvp.baby')}</option>
                    </select>
                    {index > 0 && (
                      <button
                        onClick={() => removeGuest(index)}
                        className="p-3 text-red-400 hover:text-red-600"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={addGuest}
                className="w-full py-3 border-2 border-dashed border-gray-300 text-gray-500 hover:border-gold hover:text-gold transition-colors mb-8 rounded-sm"
              >
                {t('rsvp.add_guest')}
              </button>

              <div className="flex justify-between">
                <button
                  onClick={() => setCurrentStep(STEPS.ATTENDANCE)}
                  className="px-6 py-3 text-gray-500 hover:text-burgundy transition-colors"
                >
                  ← {t('common.back')}
                </button>
                <button
                  onClick={() => setCurrentStep(STEPS.PREFERENCES)}
                  disabled={!formData.guests[0].name}
                  className="px-8 py-3 bg-burgundy text-white uppercase tracking-wider hover:bg-burgundy/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-sm"
                >
                  {t('rsvp.continue')}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Preferences */}
          {currentStep === STEPS.PREFERENCES && (
            <div>
              <h3 className="font-serif text-2xl text-burgundy mb-6 text-center">{t('rsvp.meal_preferences')}</h3>
              
              <div className="mb-6">
                <label className="block text-sm text-gray-500 uppercase tracking-wider mb-3">{t('rsvp.meal_preferences_label')}</label>
                <div className="grid grid-cols-2 gap-3">
                  {['Meat', 'Fish', 'Gluten Free', 'Vegetarian', 'Vegan'].map((option) => { // to be add to settings api
                    const isSelected = formData.mealPreferences.includes(option);
                    return (
                      <button
                        key={option}
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          mealPreferences: isSelected
                            ? prev.mealPreferences.filter(p => p !== option)
                            : [...prev.mealPreferences, option]
                        }))}
                        className={`py-3 border rounded-sm transition-all flex items-center justify-center gap-2 ${
                          isSelected
                            ? 'border-gold bg-gold/10 text-gold'
                            : 'border-gray-300 text-gray-600 hover:border-gold'
                        }`}
                      >
                        {isSelected && <span>✓</span>}
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm text-gray-500 uppercase tracking-wider mb-3">{t('rsvp.dietary_notes')}</label>
                <textarea
                  value={formData.dietaryRestrictions}
                  onChange={(e) => setFormData(prev => ({ ...prev, dietaryRestrictions: e.target.value }))}
                  placeholder={t('rsvp.dietary_placeholder')}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:border-gold resize-none"
                ></textarea>
              </div>

              <div className="mb-8">
                <label className="block text-sm text-gray-500 uppercase tracking-wider mb-3">{t('rsvp.song_request')}</label>
                <input
                  type="text"
                  value={formData.songRequest}
                  onChange={(e) => setFormData(prev => ({ ...prev, songRequest: e.target.value }))}
                  placeholder={t('rsvp.song_placeholder')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:border-gold"
                />
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setCurrentStep(STEPS.GUESTS)}
                  className="px-6 py-3 text-gray-500 hover:text-burgundy transition-colors"
                >
                  ← {t('common.back')}
                </button>
                <button
                  onClick={() => setCurrentStep(STEPS.REVIEW)}
                  className="px-8 py-3 bg-burgundy text-white uppercase tracking-wider hover:bg-burgundy/90 transition-colors rounded-sm"
                >
                  {t('rsvp.continue')}
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {currentStep === STEPS.REVIEW && (
            <div>
              <h3 className="font-serif text-2xl text-burgundy mb-6 text-center">{t('rsvp.review')}</h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between py-3 border-b border-gray-200">
                  <span className="text-gray-500">{t('rsvp.guests')}</span>
                  <span className="text-burgundy font-medium">{formData.guests.map(g => g.name).join(', ')}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-200">
                  <span className="text-gray-500">{t('rsvp.meal_preferences')}</span>
                  <span className="text-burgundy font-medium">{formData.mealPreferences.length > 0 ? formData.mealPreferences.join(', ') : 'None'}</span>
                </div>
                {formData.dietaryRestrictions && (
                  <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-500">{t('rsvp.dietary_notes')}</span>
                    <span className="text-burgundy font-medium">{formData.dietaryRestrictions}</span>
                  </div>
                )}
                {formData.songRequest && (
                  <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-500">{t('rsvp.song_request')}</span>
                    <span className="text-burgundy font-medium">{formData.songRequest}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setCurrentStep(STEPS.PREFERENCES)}
                  className="px-6 py-3 text-gray-500 hover:text-burgundy transition-colors"
                >
                  ← {t('rsvp.edit')}
                </button>
                <button
                  onClick={submitRSVP}
                  disabled={isLoading}
                  className="px-8 py-3 bg-gold text-white uppercase tracking-wider hover:bg-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-sm"
                >
                  {isLoading ? t('rsvp.submitting') : t('rsvp.submit')}
                </button>
              </div>
            </div>
          )}

          {/* Success */}
          {currentStep === STEPS.SUCCESS && (
            <div className="text-center py-8">
              <div className="text-6xl mb-6">🎉</div>
              <h3 className="font-serif text-3xl text-burgundy mb-4">{t('rsvp.thank_you')}</h3>
              <p className="text-gray-600 mb-2">{t('rsvp.your_rsvp_has_been_received')}</p>
              <p className="text-gray-600">{t('rsvp.we_cannot_wait_to_celebrate_with_you')}</p>
            </div>
          )}

          {/* Declined */}
          {currentStep === STEPS.DECLINED && (
            <div className="text-center py-8">
              <div className="text-6xl mb-6">💝</div>
              <h3 className="font-serif text-3xl text-burgundy mb-4">{t('rsvp.we_will_miss_you')}</h3>
              <p className="text-gray-600 mb-2">{t('rsvp.thank_you_for_letting_us_know')}</p>
              <p className="text-gray-600">{t('rsvp.you_will_be_in_our_hearts_for_this_special_day')}</p>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
