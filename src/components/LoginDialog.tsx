import React from "react";
import { RegisterDialog } from "./RegisterDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, Shield } from "lucide-react";
import { toast } from "sonner";

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoginDialog({ open, onOpenChange }: LoginDialogProps) {
  const { login, loading } = useAuth();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showRegister, setShowRegister] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      onOpenChange(false);
      toast.success("Successfully logged in!");
    } catch (error: any) {
      // Show backend error if available
      const message =
        error?.message || "Login failed. Please check your credentials.";
      toast.error(message);
    }
  };

  const demoCredentials = [
    { role: "Member", email: "member@example.com" },
    { role: "Validator", email: "validator@example.com" },
    { role: "Team Lead", email: "admin@example.com" },
    { role: "Organization Lead", email: "org-lead@example.com" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-gradient-to-br from-brand-green to-brand-green-light flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <DialogTitle className="text-2xl font-bold">
            Welcome to Governer
          </DialogTitle>
          <DialogDescription>
            Sign in to access your CIS compliance dashboard
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign In
          </Button>
        </form>
        <div className="mt-4 text-center">
          <Button variant="link" onClick={() => setShowRegister(true)}>
            Create an account
          </Button>
        </div>

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <p className="text-sm font-medium mb-2">
            Demo/Test Credentials (for local backend):
          </p>
          <div className="space-y-1 text-xs">
            {demoCredentials.map((cred) => (
              <div key={cred.role} className="flex justify-between">
                <span className="text-muted-foreground">{cred.role}:</span>
                <span className="font-mono">{cred.email}</span>
              </div>
            ))}
            <div className="pt-1 border-t border-border mt-2">
              <span className="text-muted-foreground">Password: </span>
              <span className="font-mono">password123</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Use these only if your backend is seeded with demo users.
          </p>
        </div>
        <RegisterDialog open={showRegister} onOpenChange={setShowRegister} />
      </DialogContent>
    </Dialog>
  );
}
