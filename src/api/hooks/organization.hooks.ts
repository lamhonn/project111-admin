import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { apiConfig } from '../config';

const ORGANIZATIONS_QUERY = gql`
  query GetOrganizationsForSelection {
    organizations {
      id
    }
  }
`;

interface OrganizationsQueryData {
  organizations: Array<{
    id: string;
  }>;
}

export const useOrganizationId = () => {
  const explicitOrganizationId = apiConfig.organizationId;

  const { data, loading, error } = useQuery<OrganizationsQueryData>(ORGANIZATIONS_QUERY, {
    skip: Boolean(explicitOrganizationId),
    fetchPolicy: 'cache-first',
  });

  const organizationId = explicitOrganizationId ?? data?.organizations?.[0]?.id;

  return {
    organizationId,
    loading: !explicitOrganizationId && loading,
    error: explicitOrganizationId ? undefined : error,
  };
};
