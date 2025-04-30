/* eslint-disable @typescript-eslint/no-unused-vars */
// src/app/profile/_components/InformationTab.tsx
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { User } from "@/types/entities/user";
import { Badge } from "@/components/ui/badge";
import { X, Pencil, Save, XCircle } from "lucide-react";

interface InformationTabProps {
  user: User;
  onUpdateUser: (updatedUser: Partial<User>) => Promise<void>;
}

export default function InformationTab({ user, onUpdateUser }: InformationTabProps) {
  const [editing, setEditing] = useState(false);
  const [tempUser, setTempUser] = useState<Partial<User>>({
    firstName: user.firstName,
    lastName: user.lastName,
    bio: user.bio,
    phone: user.phone,
    skills: user.skills
  });
  const [newSkill, setNewSkill] = useState("");

  const handleSave = async () => {
    try {
      const updateData = {
        firstName: tempUser.firstName,
        lastName: tempUser.lastName,
        bio: tempUser.bio,
        phone: tempUser.phone,
        skills: tempUser.skills
      };

      await onUpdateUser(updateData);
      setEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const handleCancel = () => {
    setTempUser({
      firstName: user.firstName,
      lastName: user.lastName,
      bio: user.bio,
      phone: user.phone,
      skills: user.skills
    });
    setEditing(false);
    setNewSkill("");
  };

  const handleChange = (key: keyof User, value: string) => {
    setTempUser({ ...tempUser, [key]: value });
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !tempUser.skills?.includes(newSkill.trim())) {
      setTempUser({
        ...tempUser,
        skills: [...(tempUser.skills || []), newSkill.trim()]
      });
      setNewSkill("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setTempUser({
      ...tempUser,
      skills: tempUser.skills?.filter(skill => skill !== skillToRemove) || []
    });
  };

  const fields: (keyof User)[] = [
    "firstName",
    "lastName",
    "bio",
    "phone",
  ];

  return (
    <div className="grid md:grid-cols-2 gap-6 mt-6">
      <Card className="border-2">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Personal Details</h2>
            {!editing && (
              <Button
                size="sm"
                onClick={() => setEditing(true)}
                className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white"
              >
                <Pencil size={16} />
                Edit
              </Button>
            )}
          </div>
          <div className="space-y-4">
            {fields.map((field) => (
              <div key={field} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                {editing ? (
                  <Input
                    value={tempUser[field] as string || ""}
                    onChange={(e) => handleChange(field, e.target.value)}
                    className="w-full"
                  />
                ) : (
                  <p className="text-gray-900">
                    {user[field] as string || "-"}
                  </p>
                )}
              </div>
            ))}
          </div>
          {editing && (
            <div className="mt-6 flex gap-2">
              <Button
                onClick={handleSave}
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white"
              >
                <Save size={16} />
                Save
              </Button>
              <Button
                variant="secondary"
                onClick={handleCancel}
                className="flex items-center gap-2"
              >
                <XCircle size={16} />
                Cancel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-2">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Skills</h2>
          </div>
          {editing ? (
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Add new skill"
                  className="flex-1"
                />
                <Button
                  onClick={handleAddSkill}
                  className="bg-sky-500 hover:bg-sky-600 text-white"
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 min-h-[40px]">
                {tempUser.skills?.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="flex items-center gap-1 bg-sky-50 text-sky-700 hover:bg-sky-100"
                  >
                    {skill}
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      className="ml-1 hover:text-red-500 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2 min-h-[40px]">
              {user.skills && user.skills.length > 0 ? (
                user.skills.map((skill) => (
                  <Badge
                    key={skill}
                    className="bg-sky-50 text-sky-700"
                  >
                    {skill}
                  </Badge>
                ))
              ) : (
                <p className="text-gray-500 italic">No skills added yet.</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
