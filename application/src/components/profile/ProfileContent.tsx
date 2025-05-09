
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "@/services/userService";
import { UserProfileDetails } from "./UserProfileDetails";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChangePasswordForm } from "./ChangePasswordForm";
import { UpdateProfileForm } from "./UpdateProfileForm";

interface ProfileContentProps {
  currentUser: User | null;
}

export function ProfileContent({ currentUser }: ProfileContentProps) {
  const [activeTab, setActiveTab] = useState("details");

  if (!currentUser) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
          <CardDescription>Your profile information could not be loaded</CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Profile</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column - Profile summary card */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Profile Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <UserProfileDetails user={currentUser} />
          </CardContent>
        </Card>

        {/* Right column - Profile tabs for edit and password change */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>My Account</CardTitle>
            <CardDescription>Manage your account settings</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="details">Profile Details</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="pt-4">
                <UpdateProfileForm user={currentUser} />
              </TabsContent>
              
              <TabsContent value="security" className="pt-4">
                <ChangePasswordForm userId={currentUser.id} />
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="text-sm text-muted-foreground">
            Last updated: {new Date(currentUser.updated).toLocaleString()}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
