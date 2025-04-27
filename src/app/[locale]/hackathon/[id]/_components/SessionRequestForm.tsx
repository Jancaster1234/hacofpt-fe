// src/app/[locale]/hackathon/[id]/_components/SessionRequestForm.tsx
import { useState, useEffect } from "react";
import { useTranslations } from "@/hooks/useTranslations";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

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
  isSubmitting?: boolean;
};

export default function SessionRequestForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: SessionRequestFormProps) {
  const t = useTranslations("sessionForm");

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

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Validate fields that have been touched when they change
    const validateTouchedFields = () => {
      const newErrors: Record<string, string> = {};

      if (touched.startTime && !formData.startTime) {
        newErrors.startTime = t("startTimeRequired");
      }

      if (touched.endTime) {
        if (!formData.endTime) {
          newErrors.endTime = t("endTimeRequired");
        } else if (
          formData.startTime &&
          new Date(formData.endTime) <= new Date(formData.startTime)
        ) {
          newErrors.endTime = t("endTimeAfterStart");
        }
      }

      if (touched.location && !formData.location) {
        newErrors.location = t("locationRequired");
      }

      if (touched.description && !formData.description) {
        newErrors.description = t("descriptionRequired");
      }

      setErrors(newErrors);
    };

    validateTouchedFields();
  }, [formData, touched, t]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Mark field as touched when it's changed
    if (!touched[name]) {
      setTouched((prev) => ({ ...prev, [name]: true }));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const validateForm = () => {
    // Mark all fields as touched to show all errors
    const allTouched = Object.keys(formData).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {}
    );
    setTouched(allTouched);

    const newErrors: Record<string, string> = {};

    if (!formData.startTime) {
      newErrors.startTime = t("startTimeRequired");
    }

    if (!formData.endTime) {
      newErrors.endTime = t("endTimeRequired");
    } else if (
      formData.startTime &&
      new Date(formData.endTime) <= new Date(formData.startTime)
    ) {
      newErrors.endTime = t("endTimeAfterStart");
    }

    if (!formData.location) {
      newErrors.location = t("locationRequired");
    }

    if (!formData.description) {
      newErrors.description = t("descriptionRequired");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    await onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 transition-colors duration-300"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {t("description")}
        </label>
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={t("descriptionPlaceholder")}
          className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600 focus:outline-none dark:bg-gray-700 dark:text-white transition-colors duration-300 ${
            errors.description
              ? "border-red-500 dark:border-red-500"
              : "border-gray-300 dark:border-gray-600"
          }`}
          disabled={isSubmitting}
          aria-invalid={errors.description ? "true" : "false"}
          aria-describedby={
            errors.description ? "description-error" : undefined
          }
        />
        {errors.description && (
          <p
            className="mt-1 text-xs text-red-500 dark:text-red-400"
            id="description-error"
          >
            {errors.description}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t("startTime")}
          </label>
          <input
            type="datetime-local"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600 focus:outline-none dark:bg-gray-700 dark:text-white transition-colors duration-300 ${
              errors.startTime
                ? "border-red-500 dark:border-red-500"
                : "border-gray-300 dark:border-gray-600"
            }`}
            disabled={isSubmitting}
            aria-invalid={errors.startTime ? "true" : "false"}
            aria-describedby={errors.startTime ? "startTime-error" : undefined}
          />
          {errors.startTime && (
            <p
              className="mt-1 text-xs text-red-500 dark:text-red-400"
              id="startTime-error"
            >
              {errors.startTime}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t("endTime")}
          </label>
          <input
            type="datetime-local"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600 focus:outline-none dark:bg-gray-700 dark:text-white transition-colors duration-300 ${
              errors.endTime
                ? "border-red-500 dark:border-red-500"
                : "border-gray-300 dark:border-gray-600"
            }`}
            disabled={isSubmitting}
            aria-invalid={errors.endTime ? "true" : "false"}
            aria-describedby={errors.endTime ? "endTime-error" : undefined}
          />
          {errors.endTime && (
            <p
              className="mt-1 text-xs text-red-500 dark:text-red-400"
              id="endTime-error"
            >
              {errors.endTime}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {t("location")}
        </label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={t("locationPlaceholder")}
          className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600 focus:outline-none dark:bg-gray-700 dark:text-white transition-colors duration-300 ${
            errors.location
              ? "border-red-500 dark:border-red-500"
              : "border-gray-300 dark:border-gray-600"
          }`}
          disabled={isSubmitting}
          aria-invalid={errors.location ? "true" : "false"}
          aria-describedby={errors.location ? "location-error" : undefined}
        />
        {errors.location && (
          <p
            className="mt-1 text-xs text-red-500 dark:text-red-400"
            id="location-error"
          >
            {errors.location}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600"
          disabled={isSubmitting}
          aria-label={t("cancel")}
        >
          {t("cancel")}
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm text-white bg-blue-500 dark:bg-blue-600 rounded-md hover:bg-blue-600 dark:hover:bg-blue-700 disabled:bg-blue-300 dark:disabled:bg-blue-500 disabled:cursor-not-allowed transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-opacity-50"
          disabled={isSubmitting}
          aria-label={
            isSubmitting
              ? t("submitting")
              : initialData
                ? t("updateSession")
                : t("requestSession")
          }
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <LoadingSpinner size="sm" className="mr-2" />
              {t("submitting")}
            </span>
          ) : initialData ? (
            t("updateSession")
          ) : (
            t("requestSession")
          )}
        </button>
      </div>
    </form>
  );
}
