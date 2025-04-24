// src/app/[locale]/profile/_components/InformationTab.tsx
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { User } from "@/types/entities/user";
import { toast } from "sonner";

export default function InformationTab({
  user,
  setUser,
}: {
  user: User;
  setUser: (u: User) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [tempUser, setTempUser] = useState<User>(user);

  const handleSave = () => {
    // Simulate API call
    setTimeout(() => {
      setUser(tempUser);
      setEditing(false);
      const id = toast.success("Profile updated successfully", {
        action: {
          label: "✖",
          onClick: () => toast.dismiss(id),
        },
      });
    }, 1000);
  };

  const handleCancel = () => {
    setTempUser(user);
    setEditing(false);
  };

  const handleChange = (key: keyof User, value: string) => {
    setTempUser({ ...tempUser, [key]: value });
  };

  return (
    <div className="grid md:grid-cols-2 gap-6 mt-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Personal Details</h2>
            {!editing && (
              <Button size="sm" onClick={() => setEditing(true)}>
                Edit
              </Button>
            )}
          </div>
          {[
            "email",
            "phone",
            "city",
            "country",
            "githubUrl",
            "linkedinUrl",
          ].map((field) => (
            <div key={field} className="mb-3">
              <strong>{field.charAt(0).toUpperCase() + field.slice(1)}:</strong>{" "}
              {editing ? (
                <Input
                  value={tempUser[field as keyof User] as string}
                  onChange={(e) =>
                    handleChange(field as keyof User, e.target.value)
                  }
                  className="inline-block w-auto mt-1"
                />
              ) : (
                <span className="ml-1">
                  {typeof user[field as keyof User] === "string" ||
                  typeof user[field as keyof User] === "number"
                    ? (user[field as keyof User] as string | number)
                    : "-"}
                </span>
              )}
            </div>
          ))}
          {editing && (
            <div className="mt-4 flex gap-2">
              <Button onClick={handleSave}>Save</Button>
              <Button variant="secondary" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Skills</h2>
          {user.skills && user.skills.length > 0 ? (
            <div className="flex flex-wrap gap-2 mt-2">
              {user.skills.map((skill) => (
                <Badge key={skill}>{skill}</Badge>
              ))}
            </div>
          ) : (
            <p>No skills added yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
