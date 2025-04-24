// src/app/[locale]/hackathon/[id]/_components/SessionRequestForm.tsx
import { useState } from "react";

type SessionRequestFormProps = {
  initialData?: {
    startTime?: string;
    endTime?: string;
    location?: string;
    description?: string;
  };
  onSubmit: (data: {
    startTime: string;
    endTime: string;
    location: string;
    description: string;
  }) => Promise<void>;
  onCancel: () => void;
};

export default function SessionRequestForm({
  initialData,
  onSubmit,
  onCancel,
}: SessionRequestFormProps) {
  // Format dates for input fields
  const formatDateForInput = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    // Format as YYYY-MM-DDThh:mm
    return date.toISOString().slice(0, 16);
  };

  const [formData, setFormData] = useState({
    startTime:
      formatDateForInput(initialData?.startTime) ||
      formatDateForInput(new Date().toISOString()),
    endTime:
      formatDateForInput(initialData?.endTime) ||
      formatDateForInput(new Date(Date.now() + 60 * 60 * 1000).toISOString()), // Default 1 hour later
    location: initialData?.location || "",
    description: initialData?.description || "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.startTime) {
      newErrors.startTime = "Start time is required";
    }

    if (!formData.endTime) {
      newErrors.endTime = "End time is required";
    } else if (
      formData.startTime &&
      new Date(formData.endTime) <= new Date(formData.startTime)
    ) {
      newErrors.endTime = "End time must be after start time";
    }

    if (!formData.location) {
      newErrors.location = "Location is required";
    }

    if (!formData.description) {
      newErrors.description = "Description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="What would you like to discuss?"
          className={`w-full p-2 border rounded-md ${
            errors.description ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.description && (
          <p className="mt-1 text-xs text-red-500">{errors.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Time
          </label>
          <input
            type="datetime-local"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            className={`w-full p-2 border rounded-md ${
              errors.startTime ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.startTime && (
            <p className="mt-1 text-xs text-red-500">{errors.startTime}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Time
          </label>
          <input
            type="datetime-local"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            className={`w-full p-2 border rounded-md ${
              errors.endTime ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.endTime && (
            <p className="mt-1 text-xs text-red-500">{errors.endTime}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Location
        </label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Where would you like to meet? (Room name, online link, etc.)"
          className={`w-full p-2 border rounded-md ${
            errors.location ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.location && (
          <p className="mt-1 text-xs text-red-500">{errors.location}</p>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <span className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Submitting...
            </span>
          ) : initialData ? (
            "Update Session"
          ) : (
            "Request Session"
          )}
        </button>
      </div>
    </form>
  );
}
