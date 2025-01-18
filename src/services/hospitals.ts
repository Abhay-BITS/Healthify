export interface Hospital {
  id: string;
  name: string;
  address: string;
  location: {
    lat: number;
    lng: number;
  };
  distanceFromUser?: number;
}

// Function to convert degrees to radians
const toRadians = (degrees: number): number => (degrees * Math.PI) / 180;

// Function to calculate distance using the Haversine formula
const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  const R = 6371; // Radius of Earth in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
};

// Complete hospital data
export const getHospitals = (): Hospital[] => [
  {
    id: "H001",
    name: "BITS Pilani Medical Centre [MedC]",
    address: "BITS Pilani Campus, Pilani, Rajasthan, 333031",
    location: { lat: 28.3576658, lng: 75.5900614 }
  },
  {
    id: "H002",
    name: "Birla Sarvajanik Hospital",
    address: "Near Bhagat Singh Circle, Chirawa-Pilani Road, Pilani, Rajasthan, 333031",
    location: { lat: 28.3591596, lng: 75.6042228 }
  },
  {
    id: "H004",
    name: "Choudhry Hospital",
    address: "Shiv Colony, Pilani, Rajasthan, 333031",
    location: { lat: 28.3697701, lng: 75.5949212 }
  },
 
  {
    id: "H006",
    name: "Bedwal Hospital",
    address: "Nirmal Kripa Road, Norangpura, Pilani, Rajasthan, 333031",
    location: { lat: 28.359932, lng: 75.6041292 }
  },
  {
    id: "H007",
    name: "HealthCare Homoeopathic Hospital",
    address: "Main Market Road, Pilani, Rajasthan, 333031",
    location: { lat: 28.3672801, lng: 75.6016833 }
  },
  {
    id: "H008",
    name: "Verma Heart & Lung Care Centre",
    address: "Plot No. 10, Ward No.12, Near Bedwal Hospital, Pilani",
    location: { lat: 28.3802101, lng: 75.6091696 }
  },

 
  {
    id: "H009",
    name: "Indra Hospital",
    address: "F-38 Industrial Area, Near Tagore School, Pilani, Rajasthan",
    location: { lat: 28.373955, lng: 75.588615 }
  },
 
];

// Function to calculate and sort hospitals by distance
export const searchNearbyHospitals = (
  userLat: number,
  userLng: number
): Hospital[] => {
  const hospitals = getHospitals();

  // Calculate distance for each hospital
  hospitals.forEach((hospital) => {
    hospital.distanceFromUser = calculateDistance(
      userLat,
      userLng,
      hospital.location.lat,
      hospital.location.lng
    );
  });

  // Sort hospitals by distance
  return hospitals.sort(
    (a, b) => (a.distanceFromUser ?? 0) - (b.distanceFromUser ?? 0)
  );
};

// Function to display hospitals with distance, and scrolling after every 5 hospitals (browser-friendly)
export const displayHospitalsWithDistance = (
  userLat: number,
  userLng: number
): void => {
  const hospitals = searchNearbyHospitals(userLat, userLng);
  const chunkSize = 5; // Number of hospitals to display at a time

  let currentIndex = 0;

  const showNextChunk = () => {
    const nextHospitals = hospitals.slice(currentIndex, currentIndex + chunkSize);
    
    if (nextHospitals.length > 0) {
      console.log("Hospitals near your location (scroll for more):");
      nextHospitals.forEach((hospital, index) => {
        console.log(`
${currentIndex + index + 1}. ${hospital.name}
   Address: ${hospital.address}
   Distance: ${hospital.distanceFromUser?.toFixed(2) ?? "Unknown"} km
`);
      });
      currentIndex += chunkSize;

      // If there are more hospitals, ask for scroll
      if (currentIndex < hospitals.length) {
        document.getElementById("scrollBtn")!.style.display = "block";
      }
    } else {
      console.log("No more hospitals to show.");
    }
  };

  // Initial display of hospitals
  showNextChunk();

  // Handling the button click to load more
  const scrollButton = document.createElement("button");
  scrollButton.textContent = "Scroll to View More";
  scrollButton.id = "scrollBtn";
  document.body.appendChild(scrollButton);

  scrollButton.addEventListener("click", () => {
    showNextChunk();
    scrollButton.style.display = "none"; // Hide the button after click
  });
};

// hospital.ts
export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  availableSlots: string[];
  contactNumber: string;
  hospitalName: string;
}

export const hospitals = [
  {
    name: "BITS Pilani Medical Centre",
    doctors: [
      {
        id: "D001",
        name: "Dr. John Doe",
        specialization: "Cardiology",
        availableSlots: ["9:00 AM", "11:00 AM", "2:00 PM"],
        contactNumber: "9876543210",
        hospitalName: "BITS Pilani Medical Centre",
      },
      {
        id: "D002",
        name: "Dr. Jane Smith",
        specialization: "Orthopedics",
        availableSlots: ["10:00 AM", "12:00 PM", "3:00 PM"],
        contactNumber: "9876543211",
        hospitalName: "BITS Pilani Medical Centre",
      },
      {
        id: "D003",
        name: "Dr. Alice Brown",
        specialization: "Pediatrics",
        availableSlots: ["8:30 AM", "1:00 PM", "4:30 PM"],
        contactNumber: "9876543212",
        hospitalName: "BITS Pilani Medical Centre",
      },
      {
        id: "D004",
        name: "Dr. Bob White",
        specialization: "Dermatology",
        availableSlots: ["9:30 AM", "1:30 PM", "4:00 PM"],
        contactNumber: "9876543213",
        hospitalName: "BITS Pilani Medical Centre",
      },
      {
        id: "D005",
        name: "Dr. Claire Green",
        specialization: "Gynecology",
        availableSlots: ["10:30 AM", "2:30 PM", "5:00 PM"],
        contactNumber: "9876543214",
        hospitalName: "BITS Pilani Medical Centre",
      },
    ],
  },
  // Add more hospitals with their doctors if needed
];