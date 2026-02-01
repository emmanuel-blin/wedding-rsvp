import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

export const translations = {
  fr: {
    hero: {
      rsvp_now: "Répondre maintenant",
      countdown_days: "Jours",
      countdown_hours: "Heures",
      countdown_minutes: "Minutes",
      countdown_seconds: "Secondes",
    },
    sections: {
      location: "Lieu",
      location_sub: "Comment nous trouver",
      timeline: {
        title: "Programme",
        events: [
          { title: "Cérémonie Civile", location: "Mairie" },
          { title: "Cocktail", location: "Terrasse du jardin" },
          { title: "Dîner de réception", location: "Grande salle" },
          { title: "Soirée dansante", location: "Piste de danse" },
        ]
      },
      rsvp: "Réponse souhaitée",
      rsvp_sub: "Faites-nous savoir si vous venez",
    },
    location: {
      address: "Adresse",
      getting_there: "Accès",
      view_map: "Voir la carte",
    },
    rsvp: {
      section_title: "Réponse souhaitée",
      section_sub: "Nous espérons que vous pourrez venir",
      step_progress: "Étape {{currentProgress}} sur {{totalSteps}}",
      access_code: "Code d'accès",
      enter_your_code: "Entrez votre code d'invitation",
      please_enter_your_code: "Veuillez entrer le code figurant sur votre invitation.",
      will_you_join_us: "Serez-vous des nôtres ",
      we_truly_hope_you_can_celebrate_this_special_day_with_us: "Nous espérons sincèrement vous voir à nos côtés.",
      who_will_be_attending: "Qui sera présent ",
      meal_preferences: "Préférences alimentaires",
      verification: "Vérification",
      enter_code: "Entrez votre code...",
      validate: "Valider",
      continue: "Continuer",
      joyfully_accept: "Accepter avec joie",
      regretfully_decline: "Décliner avec regret",
      full_name: "Nom complet *",
      guest_name: "Nom de l'invité",
      age_category: "Catégorie d'âge",
      adult: "Adulte",
      child: "Enfant",
      teen: "Ado",
      baby: "bébé",
      add_guest: "+ Ajouter un invité",
      meal_preferences_label: "Sélectionnez vos préférences (plusieurs choix possibles)",
      meal_options: ['Viande', 'Poisson', 'Sans Gluten', 'Végétarien', 'Végétalien'],
      dietary_notes: "Allergies ou restrictions alimentaires",
      dietary_placeholder: "Dites-nous si vous avez des allergies...",
      song_request: "Une chanson pour vous faire danser ?",
      song_placeholder: "Quelle chanson vous fera monter sur la piste ?",
      review: "Récapituler",
      guests: "Invités",
      edit: "Modifier",
      submit: "Confirmer ma présence",
      submitting: "Envoi en cours...",
      thank_you: "Merci !",
      your_rsvp_has_been_received: "Votre réponse a bien été enregistrée.",
      we_cannot_wait_to_celebrate_with_you: "Nous avons hâte de fêter ça avec vous !",
      we_will_miss_you: "Vous allez nous manquer !",
      thank_you_for_letting_us_know: "Merci de nous avoir prévenus.",
      you_will_be_in_our_hearts_for_this_special_day: "Vous serez dans nos cœurs pour ce grand jour.",
      error_code: "Code invalide. Veuillez vérifier votre invitation.",
      error_general: "Une erreur est survenue. Veuillez réessayer.",
    },
    common: {
      loading: "Chargement...",
      back: "Retour",
      none: "Aucun",
      made_with_love: "Fait avec amour",
      api_error: "Impossible de charger les détails du mariage. Veuillez contacter la personne qui vous a envoyé l'invitation.",
    }
  },
  en: {
    hero: {
      rsvp_now: "RSVP Now",
      countdown_days: "Days",
      countdown_hours: "Hours",
      countdown_minutes: "Minutes",
      countdown_seconds: "Seconds",
    },
    sections: {
      location: "Location",
      location_sub: "Where to find us",
      timeline: {
        title: "Timeline",
        events: [
          { title: "Civil Ceremony", location: "City Hall" },
          { title: "Cocktail Hour", location: "Garden Terrace" },
          { title: "Dinner Reception", location: "Grand Hall" },
          { title: "Dancing", location: "Dance Floor" },
        ]
      },
      rsvp: "RSVP",
      rsvp_sub: "Let us know if you're coming",
    },
    location: {
      address: "Address",
      getting_there: "Getting There",
      view_map: "View Map",
    },
    rsvp: {
      section_title: "RSVP",
      section_sub: "We hope you can come",
      step_progress: "Step {{currentProgress}} of {{totalSteps}}",
      access_code: "Access Code",
      enter_your_code: "Enter your invitation code",
      please_enter_your_code: "Please enter the code shown on your invitation.",
      will_you_join_us: "Will you join us?",
      we_truly_hope_you_can_celebrate_this_special_day_with_us: "We truly hope you can celebrate this special day with us.",
      who_will_be_attending: "Who will be attending?",
      meal_preferences: "Meal preferences",
      verification: "Verification",
      enter_code: "Enter code...",
      validate: "Validate",
      continue: "Continue",
      joyfully_accept: "Joyfully accept",
      regretfully_decline: "Regretfully decline",
      full_name: "Full Name *",
      guest_name: "Guest Name",
      age_category: "Age Category",
      adult: "Adult",
      child: "Child",
      teen: "Teen",
      baby: "Baby",
      add_guest: "+ Add a guest",
      meal_preferences_label: "Select your preferences (multiple choices possible)",
      meal_options: ['Meat', 'Fish', 'Gluten Free', 'Vegetarian', 'Vegan'],
      dietary_notes: "Dietary restrictions or allergies",
      dietary_placeholder: "Tell us if you have any allergies...",
      song_request: "A song to get you dancing?",
      song_placeholder: "Which song will get you on the dance floor?",
      review: "Review",
      guests: "Guests",
      edit: "Edit",
      submit: "Confirm Attendance",
      submitting: "Sending...",
      thank_you: "Thank you!",
      your_rsvp_has_been_received: "Your response has been successfully recorded.",
      we_cannot_wait_to_celebrate_with_you: "We can't wait to celebrate with you!",
      we_will_miss_you: "We'll miss you!",
      thank_you_for_letting_us_know: "Thank you for letting us know.",
      you_will_be_in_our_hearts_for_this_special_day: "You'll be in our hearts on this special day.",
      error_code: "Invalid code. Please check your invitation.",
      error_general: "An error occurred. Please try again.",
    },
    common: {
      loading: "Loading...",
      back: "Back",
      none: "None",
      made_with_love: "Made with love",
      api_error: "Unable to load wedding details. Please contact the person who sent you the invitation.",
    }
  }
};

i18next
  .use(initReactI18next)
  .init({
    resources: {
      fr: {
        translation: translations.fr,
      },
      en: {
        translation: translations.en,
      },
    },
    lng: 'fr',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18next;