import React from "react";
import { Button } from "@/components/ui/button";
import { Heart, Activity, Gift, Calendar } from "lucide-react";

export default function DonorProfile() {
  // Dummy donor data (replace with real API / Supabase fetch)
  const donor = {
    name: "John Doe",
    bloodType: "A+",
    age: 29,
    lastDonation: "2025-08-10",
    nextEligible: "2025-11-10",
    donationsCount: 12,
    rewardPoints: 85,
    avatarUrl: "https://i.pravatar.cc/150?img=12",
  };

  return (
    <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Left panel: Profile Picture + Basic Info */}
      <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center text-center">
        <img
          src={donor.avatarUrl}
          alt="Donor Avatar"
          className="w-32 h-32 rounded-full mb-4"
        />
        <h2 className="text-2xl font-bold mb-1">{donor.name}</h2>
        <p className="text-gray-500 mb-2">Age: {donor.age}</p>
        <p className="text-red-500 font-semibold text-lg">Blood Type: {donor.bloodType}</p>

        <div className="mt-4 flex flex-col gap-2 w-full">
          <Button variant="outline" className="flex items-center justify-center gap-2">
            <Activity className="h-4 w-4" /> View Donation History
          </Button>
          <Button variant="default" className="flex items-center justify-center gap-2">
            <Heart className="h-4 w-4" /> Donate Now
          </Button>
          <Button variant="secondary" className="flex items-center justify-center gap-2">
            <Gift className="h-4 w-4" /> My Rewards ({donor.rewardPoints})
          </Button>
        </div>
      </div>

      {/* Middle panel: Donation Stats */}
      <div className="bg-white shadow-md rounded-lg p-6 flex flex-col gap-4">
        <h3 className="text-xl font-semibold mb-2">Donation Stats</h3>
        <div className="flex justify-between items-center">
          <span>Last Donation:</span>
          <span className="font-medium">{donor.lastDonation}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Next Eligible:</span>
          <span className="font-medium text-green-600">{donor.nextEligible}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Total Donations:</span>
          <span className="font-medium">{donor.donationsCount}</span>
        </div>
        <div className="mt-4">
          <h4 className="font-semibold mb-2">Health Tips</h4>
          <ul className="list-disc list-inside text-gray-600 text-sm">
            <li>Stay hydrated before donation</li>
            <li>Maintain healthy iron levels</li>
            <li>Eat a nutritious meal</li>
            <li>Rest well after donation</li>
          </ul>
        </div>
      </div>

      {/* Right panel: Quick Actions + Calendar */}
      <div className="bg-white shadow-md rounded-lg p-6 flex flex-col gap-4">
        <h3 className="text-xl font-semibold mb-2">Upcoming Events</h3>
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center bg-red-50 p-3 rounded">
            <span>Blood Drive @ City Hall</span>
            <span className="text-sm text-gray-500">27 Sep</span>
          </div>
          <div className="flex justify-between items-center bg-red-50 p-3 rounded">
            <span>Community Donation Camp</span>
            <span className="text-sm text-gray-500">15 Oct</span>
          </div>
          <div className="flex justify-between items-center bg-red-50 p-3 rounded">
            <span>Local Hospital Drive</span>
            <span className="text-sm text-gray-500">05 Nov</span>
          </div>
        </div>

        <Button variant="default" className="mt-4 flex items-center justify-center gap-2">
          <Calendar className="h-4 w-4" /> Add to Calendar
        </Button>
      </div>
    </div>
  );
}
