// ──────────────────────────────────────────
// Indian States & Districts Data
// Used for doctor registration and appointment booking
// ──────────────────────────────────────────

export interface StateData {
  name: string;
  districts: string[];
}

export const INDIAN_STATES: StateData[] = [
  {
    name: 'Odisha',
    districts: [
      'Angul', 'Balangir', 'Balasore', 'Bargarh', 'Bhadrak', 'Boudh',
      'Cuttack', 'Deogarh', 'Dhenkanal', 'Gajapati', 'Ganjam', 'Jagatsinghpur',
      'Jajpur', 'Jharsuguda', 'Kalahandi', 'Kandhamal', 'Kendrapara', 'Kendujhar',
      'Khordha', 'Koraput', 'Malkangiri', 'Mayurbhanj', 'Nabarangpur', 'Nayagarh',
      'Nuapada', 'Puri', 'Rayagada', 'Sambalpur', 'Subarnapur', 'Sundergarh'
    ]
  },
  {
    name: 'Andhra Pradesh',
    districts: [
      'Anantapur', 'Chittoor', 'East Godavari', 'Guntur', 'Krishna',
      'Kurnool', 'Nellore', 'Prakasam', 'Srikakulam', 'Visakhapatnam',
      'Vizianagaram', 'West Godavari', 'YSR Kadapa'
    ]
  },
  {
    name: 'Assam',
    districts: [
      'Baksa', 'Barpeta', 'Cachar', 'Darrang', 'Dhubri', 'Dibrugarh',
      'Goalpara', 'Golaghat', 'Jorhat', 'Kamrup', 'Kamrup Metropolitan',
      'Karbi Anglong', 'Karimganj', 'Kokrajhar', 'Lakhimpur', 'Nagaon',
      'Nalbari', 'Sivasagar', 'Sonitpur', 'Tinsukia'
    ]
  },
  {
    name: 'Bihar',
    districts: [
      'Araria', 'Aurangabad', 'Begusarai', 'Bhagalpur', 'Bhojpur',
      'Darbhanga', 'Gaya', 'Gopalganj', 'Jehanabad', 'Katihar',
      'Madhubani', 'Munger', 'Muzaffarpur', 'Nalanda', 'Patna',
      'Purnia', 'Rohtas', 'Saharsa', 'Saran', 'Vaishali'
    ]
  },
  {
    name: 'Chhattisgarh',
    districts: [
      'Bastar', 'Bijapur', 'Bilaspur', 'Dantewada', 'Dhamtari',
      'Durg', 'Janjgir-Champa', 'Jashpur', 'Kanker', 'Korba',
      'Koriya', 'Mahasamund', 'Raigarh', 'Raipur', 'Rajnandgaon', 'Surguja'
    ]
  },
  {
    name: 'Delhi',
    districts: [
      'Central Delhi', 'East Delhi', 'New Delhi', 'North Delhi',
      'North East Delhi', 'North West Delhi', 'South Delhi',
      'South East Delhi', 'South West Delhi', 'West Delhi'
    ]
  },
  {
    name: 'Goa',
    districts: ['North Goa', 'South Goa']
  },
  {
    name: 'Gujarat',
    districts: [
      'Ahmedabad', 'Amreli', 'Anand', 'Banaskantha', 'Bharuch',
      'Bhavnagar', 'Dahod', 'Gandhinagar', 'Junagadh', 'Kutch',
      'Mehsana', 'Narmada', 'Navsari', 'Panchmahal', 'Rajkot',
      'Sabarkantha', 'Surat', 'Vadodara', 'Valsad'
    ]
  },
  {
    name: 'Haryana',
    districts: [
      'Ambala', 'Bhiwani', 'Faridabad', 'Fatehabad', 'Gurugram',
      'Hisar', 'Jhajjar', 'Jind', 'Kaithal', 'Karnal',
      'Kurukshetra', 'Mahendragarh', 'Panipat', 'Rewari', 'Rohtak',
      'Sirsa', 'Sonipat', 'Yamunanagar'
    ]
  },
  {
    name: 'Jharkhand',
    districts: [
      'Bokaro', 'Chatra', 'Deoghar', 'Dhanbad', 'Dumka',
      'East Singhbhum', 'Garhwa', 'Giridih', 'Godda', 'Gumla',
      'Hazaribagh', 'Koderma', 'Latehar', 'Lohardaga', 'Palamu',
      'Ranchi', 'Sahibganj', 'Simdega', 'West Singhbhum'
    ]
  },
  {
    name: 'Karnataka',
    districts: [
      'Bagalkot', 'Bangalore Rural', 'Bangalore Urban', 'Belgaum',
      'Bellary', 'Bidar', 'Bijapur', 'Chamrajnagar', 'Chikmagalur',
      'Dakshina Kannada', 'Davanagere', 'Dharwad', 'Gulbarga',
      'Hassan', 'Haveri', 'Kodagu', 'Kolar', 'Mandya', 'Mysore',
      'Raichur', 'Shimoga', 'Tumkur', 'Udupi', 'Uttara Kannada'
    ]
  },
  {
    name: 'Kerala',
    districts: [
      'Alappuzha', 'Ernakulam', 'Idukki', 'Kannur', 'Kasaragod',
      'Kollam', 'Kottayam', 'Kozhikode', 'Malappuram', 'Palakkad',
      'Pathanamthitta', 'Thiruvananthapuram', 'Thrissur', 'Wayanad'
    ]
  },
  {
    name: 'Madhya Pradesh',
    districts: [
      'Bhopal', 'Dewas', 'Gwalior', 'Indore', 'Jabalpur',
      'Katni', 'Rewa', 'Sagar', 'Satna', 'Ujjain'
    ]
  },
  {
    name: 'Maharashtra',
    districts: [
      'Ahmednagar', 'Akola', 'Amravati', 'Aurangabad', 'Beed',
      'Chandrapur', 'Dhule', 'Jalgaon', 'Kolhapur', 'Latur',
      'Mumbai City', 'Mumbai Suburban', 'Nagpur', 'Nanded', 'Nashik',
      'Osmanabad', 'Palghar', 'Pune', 'Raigad', 'Ratnagiri',
      'Sangli', 'Satara', 'Solapur', 'Thane', 'Wardha'
    ]
  },
  {
    name: 'Punjab',
    districts: [
      'Amritsar', 'Barnala', 'Bathinda', 'Faridkot', 'Fatehgarh Sahib',
      'Firozpur', 'Gurdaspur', 'Hoshiarpur', 'Jalandhar', 'Kapurthala',
      'Ludhiana', 'Mansa', 'Moga', 'Muktsar', 'Patiala',
      'Rupnagar', 'Sangrur', 'SAS Nagar'
    ]
  },
  {
    name: 'Rajasthan',
    districts: [
      'Ajmer', 'Alwar', 'Banswara', 'Barmer', 'Bharatpur',
      'Bhilwara', 'Bikaner', 'Chittorgarh', 'Churu', 'Dausa',
      'Jaipur', 'Jaisalmer', 'Jodhpur', 'Kota', 'Nagaur',
      'Pali', 'Sikar', 'Tonk', 'Udaipur'
    ]
  },
  {
    name: 'Tamil Nadu',
    districts: [
      'Chennai', 'Coimbatore', 'Cuddalore', 'Dharmapuri', 'Dindigul',
      'Erode', 'Kanchipuram', 'Kanyakumari', 'Karur', 'Madurai',
      'Nagapattinam', 'Namakkal', 'Nilgiris', 'Perambalur', 'Pudukkottai',
      'Salem', 'Sivaganga', 'Thanjavur', 'Theni', 'Tiruchirappalli',
      'Tirunelveli', 'Tiruvannamalai', 'Vellore', 'Villupuram'
    ]
  },
  {
    name: 'Telangana',
    districts: [
      'Adilabad', 'Hyderabad', 'Karimnagar', 'Khammam', 'Mahabubnagar',
      'Medak', 'Nalgonda', 'Nizamabad', 'Rangareddy', 'Warangal'
    ]
  },
  {
    name: 'Uttar Pradesh',
    districts: [
      'Agra', 'Aligarh', 'Allahabad', 'Bareilly', 'Faizabad',
      'Ghaziabad', 'Gorakhpur', 'Jhansi', 'Kanpur Nagar', 'Lucknow',
      'Mathura', 'Meerut', 'Moradabad', 'Muzaffarnagar', 'Noida',
      'Saharanpur', 'Varanasi'
    ]
  },
  {
    name: 'Uttarakhand',
    districts: [
      'Almora', 'Chamoli', 'Champawat', 'Dehradun', 'Haridwar',
      'Nainital', 'Pauri Garhwal', 'Pithoragarh', 'Rudraprayag',
      'Tehri Garhwal', 'Udham Singh Nagar', 'Uttarkashi'
    ]
  },
  {
    name: 'West Bengal',
    districts: [
      'Bankura', 'Bardhaman', 'Birbhum', 'Darjeeling', 'Hooghly',
      'Howrah', 'Jalpaiguri', 'Kolkata', 'Malda', 'Midnapore East',
      'Midnapore West', 'Murshidabad', 'Nadia', 'North 24 Parganas',
      'Purulia', 'South 24 Parganas'
    ]
  }
];

/** Get districts for a given state name */
export const getDistrictsForState = (stateName: string): string[] => {
  const state = INDIAN_STATES.find(s => s.name === stateName);
  return state?.districts ?? [];
};

/** Get all state names */
export const getStateNames = (): string[] => INDIAN_STATES.map(s => s.name);
