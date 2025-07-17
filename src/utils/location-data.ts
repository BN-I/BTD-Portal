// Location data using libraries for better maintainability and Stripe compatibility
import { countries } from 'countries-list';
import { Country, State, City } from 'country-state-city';

// Stripe-compatible countries (only Canada and US)
export const STRIPE_COUNTRIES = [
  { code: "CA", name: "Canada", currency: "CAD", phone: "1" },
  { code: "US", name: "United States", currency: "USD", phone: "1" },
];

// Get states/provinces for a specific country
export const getStatesForCountry = (countryCode: string) => {
  try {
    const states = State.getStatesOfCountry(countryCode);
    return states
      .map(state => ({
        code: state.isoCode,
        name: state.name,
        countryCode: state.countryCode,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.warn(`No states found for country: ${countryCode}`);
    return [];
  }
};

// Get cities for a specific state in a country
export const getCitiesForState = (countryCode: string, stateCode: string) => {
  try {
    const cities = City.getCitiesOfState(countryCode, stateCode);
    if (!cities) return [];
    
    return cities
      .map(city => ({
        name: city.name,
        stateCode: city.stateCode,
        countryCode: city.countryCode,
        latitude: city.latitude,
        longitude: city.longitude,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.warn(`No cities found for state: ${stateCode} in country: ${countryCode}`);
    return [];
  }
};

// Get all cities for a country (when state is not available)
export const getCitiesForCountry = (countryCode: string) => {
  try {
    const cities = City.getCitiesOfCountry(countryCode);
    if (!cities) return [];
    
    return cities
      .map(city => ({
        name: city.name,
        stateCode: city.stateCode,
        countryCode: city.countryCode,
        latitude: city.latitude,
        longitude: city.longitude,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.warn(`No cities found for country: ${countryCode}`);
    return [];
  }
};

// Legacy US states for backward compatibility (alphabetically sorted)
export const US_STATES = [
  { code: "AL", name: "Alabama" },
  { code: "AK", name: "Alaska" },
  { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" },
  { code: "CA", name: "California" },
  { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" },
  { code: "DE", name: "Delaware" },
  { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" },
  { code: "HI", name: "Hawaii" },
  { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" },
  { code: "IN", name: "Indiana" },
  { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" },
  { code: "KY", name: "Kentucky" },
  { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" },
  { code: "MD", name: "Maryland" },
  { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" },
  { code: "MN", name: "Minnesota" },
  { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" },
  { code: "MT", name: "Montana" },
  { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" },
  { code: "NH", name: "New Hampshire" },
  { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" },
  { code: "NY", name: "New York" },
  { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" },
  { code: "OH", name: "Ohio" },
  { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" },
  { code: "PA", name: "Pennsylvania" },
  { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" },
  { code: "SD", name: "South Dakota" },
  { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" },
  { code: "UT", name: "Utah" },
  { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" },
  { code: "WA", name: "Washington" },
  { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" },
  { code: "WY", name: "Wyoming" },
];

// Major US cities for quick selection (alphabetically sorted)
export const MAJOR_US_CITIES = [
  "Albuquerque, NM",
  "Anaheim, CA",
  "Arlington, TX",
  "Atlanta, GA",
  "Aurora, CO",
  "Austin, TX",
  "Bakersfield, CA",
  "Baltimore, MD",
  "Baton Rouge, LA",
  "Birmingham, AL",
  "Boise, ID",
  "Boston, MA",
  "Buffalo, NY",
  "Charlotte, NC",
  "Chicago, IL",
  "Cleveland, OH",
  "Colorado Springs, CO",
  "Columbus, OH",
  "Dallas, TX",
  "Denver, CO",
  "Detroit, MI",
  "El Paso, TX",
  "Fort Worth, TX",
  "Fresno, CA",
  "Grand Rapids, MI",
  "Honolulu, HI",
  "Houston, TX",
  "Indianapolis, IN",
  "Jacksonville, FL",
  "Kansas City, MO",
  "Las Vegas, NV",
  "Long Beach, CA",
  "Los Angeles, CA",
  "Louisville, KY",
  "Memphis, TN",
  "Mesa, AZ",
  "Miami, FL",
  "Milwaukee, WI",
  "Minneapolis, MN",
  "Nashville, TN",
  "New Orleans, LA",
  "New York, NY",
  "Oakland, CA",
  "Oklahoma City, OK",
  "Omaha, NE",
  "Orlando, FL",
  "Philadelphia, PA",
  "Phoenix, AZ",
  "Pittsburgh, PA",
  "Portland, OR",
  "Raleigh, NC",
  "Reno, NV",
  "Richmond, VA",
  "Sacramento, CA",
  "Saint Paul, MN",
  "Salt Lake City, UT",
  "San Antonio, TX",
  "San Diego, CA",
  "San Francisco, CA",
  "San Jose, CA",
  "Seattle, WA",
  "Spokane, WA",
  "St. Louis, MO",
  "Tampa, FL",
  "Tucson, AZ",
  "Tulsa, OK",
  "Virginia Beach, VA",
  "Washington, DC",
  "Wichita, KS",
  "Winston-Salem, NC",
];

// Legacy countries for backward compatibility (alphabetically sorted)
export const COUNTRIES = [
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "MX", name: "Mexico" },
  { code: "GB", name: "United Kingdom" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "IT", name: "Italy" },
  { code: "ES", name: "Spain" },
  { code: "NL", name: "Netherlands" },
  { code: "BE", name: "Belgium" },
  { code: "CH", name: "Switzerland" },
  { code: "AT", name: "Austria" },
  { code: "SE", name: "Sweden" },
  { code: "NO", name: "Norway" },
  { code: "DK", name: "Denmark" },
  { code: "FI", name: "Finland" },
  { code: "PL", name: "Poland" },
  { code: "CZ", name: "Czech Republic" },
  { code: "HU", name: "Hungary" },
  { code: "RO", name: "Romania" },
  { code: "BG", name: "Bulgaria" },
  { code: "HR", name: "Croatia" },
  { code: "SI", name: "Slovenia" },
  { code: "SK", name: "Slovakia" },
  { code: "LT", name: "Lithuania" },
  { code: "LV", name: "Latvia" },
  { code: "EE", name: "Estonia" },
  { code: "IE", name: "Ireland" },
  { code: "PT", name: "Portugal" },
  { code: "GR", name: "Greece" },
  { code: "CY", name: "Cyprus" },
  { code: "MT", name: "Malta" },
  { code: "LU", name: "Luxembourg" },
  { code: "IS", name: "Iceland" },
  { code: "LI", name: "Liechtenstein" },
  { code: "MC", name: "Monaco" },
  { code: "SM", name: "San Marino" },
  { code: "VA", name: "Vatican City" },
  { code: "AD", name: "Andorra" },
  { code: "AU", name: "Australia" },
  { code: "NZ", name: "New Zealand" },
  { code: "JP", name: "Japan" },
  { code: "KR", name: "South Korea" },
  { code: "CN", name: "China" },
  { code: "IN", name: "India" },
  { code: "BR", name: "Brazil" },
  { code: "AR", name: "Argentina" },
  { code: "CL", name: "Chile" },
  { code: "CO", name: "Colombia" },
  { code: "PE", name: "Peru" },
  { code: "VE", name: "Venezuela" },
  { code: "EC", name: "Ecuador" },
  { code: "BO", name: "Bolivia" },
  { code: "PY", name: "Paraguay" },
  { code: "UY", name: "Uruguay" },
  { code: "GY", name: "Guyana" },
  { code: "SR", name: "Suriname" },
  { code: "FK", name: "Falkland Islands" },
  { code: "GF", name: "French Guiana" },
  { code: "ZA", name: "South Africa" },
  { code: "EG", name: "Egypt" },
  { code: "NG", name: "Nigeria" },
  { code: "KE", name: "Kenya" },
  { code: "ET", name: "Ethiopia" },
  { code: "TZ", name: "Tanzania" },
  { code: "UG", name: "Uganda" },
  { code: "GH", name: "Ghana" },
  { code: "CI", name: "Ivory Coast" },
  { code: "SN", name: "Senegal" },
  { code: "ML", name: "Mali" },
  { code: "BF", name: "Burkina Faso" },
  { code: "NE", name: "Niger" },
  { code: "TD", name: "Chad" },
  { code: "SD", name: "Sudan" },
  { code: "SS", name: "South Sudan" },
  { code: "CF", name: "Central African Republic" },
  { code: "CM", name: "Cameroon" },
  { code: "GQ", name: "Equatorial Guinea" },
  { code: "GA", name: "Gabon" },
  { code: "CG", name: "Republic of the Congo" },
  { code: "CD", name: "Democratic Republic of the Congo" },
  { code: "AO", name: "Angola" },
  { code: "ZM", name: "Zambia" },
  { code: "ZW", name: "Zimbabwe" },
  { code: "BW", name: "Botswana" },
  { code: "NA", name: "Namibia" },
  { code: "SZ", name: "Eswatini" },
  { code: "LS", name: "Lesotho" },
  { code: "MG", name: "Madagascar" },
  { code: "MU", name: "Mauritius" },
  { code: "SC", name: "Seychelles" },
  { code: "KM", name: "Comoros" },
  { code: "DJ", name: "Djibouti" },
  { code: "SO", name: "Somalia" },
  { code: "ER", name: "Eritrea" },
  { code: "DZ", name: "Algeria" },
  { code: "TN", name: "Tunisia" },
  { code: "LY", name: "Libya" },
  { code: "MA", name: "Morocco" },
  { code: "EH", name: "Western Sahara" },
  { code: "MR", name: "Mauritania" },
];

// Months for date of birth
export const MONTHS = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

// Generate years for date of birth (18+ years old)
export const generateBirthYears = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = currentYear - 18; year >= currentYear - 100; year--) {
    years.push({ value: year.toString(), label: year.toString() });
  }
  return years;
};

// Generate days for date of birth
export const generateBirthDays = () => {
  const days = [];
  for (let day = 1; day <= 31; day++) {
    days.push({ 
      value: day.toString().padStart(2, '0'), 
      label: day.toString() 
    });
  }
  return days;
};

// Helper function to get country name from code
export const getCountryName = (countryCode: string) => {
  const country = STRIPE_COUNTRIES.find(c => c.code === countryCode.toUpperCase());
  return country?.name || countryCode;
};

// Helper function to get state name from code
export const getStateName = (countryCode: string, stateCode: string) => {
  const states = getStatesForCountry(countryCode);
  const state = states.find(s => s.code === stateCode);
  return state?.name || stateCode;
};

// Helper function to format city name with state
export const formatCityName = (cityName: string, stateCode: string) => {
  return `${cityName}, ${stateCode}`;
}; 