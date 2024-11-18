import { Button } from "./ui/button";
import { AuthDialog } from "./AuthDialog";
import { useUser } from "../hooks/use-user";
import { User } from "lucide-react";

export default function NavBar() {
  const { user, logout } = useUser();

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="font-bold text-xl">ClassBooking</div>
        
        <nav className="flex items-center space-x-4">
          {user ? (
            <>
              <Button variant="ghost" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {user.username}
              </Button>
              <Button variant="ghost">My Bookings</Button>
              <Button variant="ghost" onClick={() => logout()}>
                Log out
              </Button>
            </>
          ) : (
            <>
              <AuthDialog mode="login" />
              <AuthDialog mode="register" />
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
