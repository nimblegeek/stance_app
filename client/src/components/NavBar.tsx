import { Button } from "./ui/button";

export default function NavBar() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="font-bold text-xl">ClassBooking</div>
        
        <nav className="flex items-center space-x-4">
          <Button variant="ghost">My Bookings</Button>
          <Button variant="ghost">Schedule</Button>
          <Button>Sign In</Button>
        </nav>
      </div>
    </header>
  );
}
