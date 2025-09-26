import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

const DonationHistory = () => {
  const donations = [
    {
      id: 1,
      date: "2025-09-01",
      donorName: "Rahul Sharma",
      bloodGroup: "O+",
      contact: "+91 9876543210",
      hospital: "AIIMS Delhi",
      certificateUrl: "/certificates/donation1.pdf",
    },
    {
      id: 2,
      date: "2025-07-12",
      donorName: "Rahul Sharma",
      bloodGroup: "O+",
      contact: "+91 9876543210",
      hospital: "Fortis Hospital, Noida",
      certificateUrl: "/certificates/donation2.pdf",
    },
  ]

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Donation History</h1>

      <Table>
        <TableCaption>Your past donations</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Donor Name</TableHead>
            <TableHead>Blood Group</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Hospital</TableHead>
            <TableHead className="text-center">Action</TableHead> {/* right align */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {donations.map((donation) => (
            <TableRow key={donation.id}>
              <TableCell>{donation.date}</TableCell>
              <TableCell>{donation.donorName}</TableCell>
              <TableCell>{donation.bloodGroup}</TableCell>
              <TableCell>{donation.contact}</TableCell>
              <TableCell>{donation.hospital}</TableCell>
              <TableCell className="text-center"> {/* right align button */}
                <Button
                  variant="destructive"
                  size="sm"
                  className="inline-flex items-center gap-2"
                  onClick={() => window.open(donation.certificateUrl, "_blank")}
                >
                  <Download className="w-4 h-4" /> Certificate
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default DonationHistory