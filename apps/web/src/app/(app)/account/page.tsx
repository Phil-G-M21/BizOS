import { requireBusiness } from "@/lib/business";
import { BusinessDetailsForm } from "./business-details-form";
import { ChangeEmailForm } from "./change-email-form";
import { ChangePasswordForm } from "./change-password-form";

export default async function AccountPage() {
  const { business, user } = await requireBusiness();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <div className="text-sm font-medium text-slate-500">Account</div>
        <h1 className="text-3xl font-bold text-slate-900">Account settings</h1>
      </div>

      <BusinessDetailsForm
        businessId={business.id}
        ownerId={user.id}
        initialName={business.name}
        initialRegion={business.region}
        initialCity={business.city}
        initialCategory={business.category}
      />

      <ChangeEmailForm currentEmail={user.email ?? ""} />

      <ChangePasswordForm />
    </div>
  );
}
