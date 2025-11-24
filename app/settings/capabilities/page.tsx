// app/settings/capabilities/page.tsx

import { getCompanyCapabilities } from '@/app/actions';
import CapabilitiesTable from '@/components/settings/CapabilitiesTable';

export const metadata = {
  title: 'Company Capabilities | PSOS',
  description: 'Manage company-level capability assessments',
};

export default async function CompanyCapabilitiesPage() {
  const capabilities = await getCompanyCapabilities();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-semibold mb-2">Company Capabilities</h1>
        <p className="text-muted-foreground">
          Score your organization's capabilities. Use cases will inherit these scores by default
          unless specifically overridden for unique requirements.
        </p>
      </div>

      <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
        <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">How it works</h3>
        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
          <li>• These scores represent your organization's overall capabilities across all use cases</li>
          <li>• When scoring a use case, it will inherit these scores by default</li>
          <li>• Override individual capabilities only when a use case has genuinely different requirements</li>
          <li>• Updating a capability here automatically updates all inheriting use cases</li>
        </ul>
      </div>

      <CapabilitiesTable capabilities={capabilities} />
    </div>
  );
}
