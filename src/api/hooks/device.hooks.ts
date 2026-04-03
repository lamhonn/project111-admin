import { gql } from '@apollo/client';
import { useMutation, useQuery, useSubscription } from '@apollo/client/react';
import { useMemo } from 'react';
import { useOrganizationId } from './organization.hooks';

const AUTH_TOKEN_STORAGE_KEY = 'authToken';

const DEVICES_QUERY = gql`
  query GetDevices($organizationId: ID!) {
    tablets(organizationId: $organizationId) {
      id
      userId
      tableNumber
      created
    }
  }
`;

const CREATE_DEVICE_MUTATION = gql`
  mutation CreateDevice($input: CreateTabletInput!) {
    createTablet(input: $input) {
      success
      message
      tablet {
        id
        userId
        tableNumber
        created
      }
    }
  }
`;

const UPDATE_DEVICE_MUTATION = gql`
  mutation UpdateDevice($input: UpdateTabletInput!) {
    updateTablet(input: $input) {
      success
      message
      tablet {
        id
        userId
        tableNumber
        created
      }
    }
  }
`;

const DELETE_DEVICE_MUTATION = gql`
  mutation DeleteDevice($id: ID!) {
    deleteTablet(id: $id) {
      success
      message
    }
  }
`;

const REQUEST_TABLET_PIN_MUTATION = gql`
  mutation RequestTabletPin($input: RequestTabletPinInput!) {
    requestTabletPin(input: $input) {
      success
      message
      pin
      pairingSessionId
      expiresAt
    }
  }
`;

const ORGANIZATION_TABLET_PIN_ISSUED_SUBSCRIPTION = gql`
  subscription OrganizationTabletPinIssued($organizationId: ID!) {
    organizationTabletPinIssued(organizationId: $organizationId) {
      pairingSessionId
      tableNumber
      pin
      expiresAt
    }
  }
`;

type GraphQLTablet = {
  id: string;
  userId?: string | null;
  tableNumber: number;
  created: string;
};

interface DevicesQueryData {
  tablets: GraphQLTablet[];
}

interface DevicesQueryVariables {
  organizationId: string;
}

interface DeviceMutationResponse {
  success: boolean;
  message?: string | null;
}

interface CreateDeviceMutationData {
  createTablet?: (DeviceMutationResponse & { tablet?: GraphQLTablet | null }) | null;
}

interface UpdateDeviceMutationData {
  updateTablet?: (DeviceMutationResponse & { tablet?: GraphQLTablet | null }) | null;
}

interface DeleteDeviceMutationData {
  deleteTablet?: DeviceMutationResponse | null;
}

interface RequestTabletPinMutationData {
  requestTabletPin?: (DeviceMutationResponse & {
    pin?: string | null;
    pairingSessionId?: string | null;
    expiresAt?: string | null;
  }) | null;
}

interface CreateDeviceMutationVariables {
  input: {
    tableNumber: number;
  };
}

interface UpdateDeviceMutationVariables {
  input: {
    id: string;
    tableNumber: number;
  };
}

interface DeleteDeviceMutationVariables {
  id: string;
}

interface RequestTabletPinMutationVariables {
  input: {
    userId: string;
    tableNumber: number;
  };
}

interface OrganizationTabletPinIssuedSubscriptionData {
  organizationTabletPinIssued: {
    pairingSessionId: string;
    tableNumber: number;
    pin: string;
    expiresAt: string;
  };
}

export interface DeviceEntity {
  id: string;
  deviceId: string;
  tableNumber: string;
  status: string;
  lastSeen: string;
}

export interface PairingPinResult {
  pairingSessionId?: string;
  tableNumber: number;
  pin: string;
  expiresAt: string;
}

interface JwtPayload {
  userId?: string;
}

const formatDate = (value: string): string => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '-';
  }

  return date.toLocaleString();
};

const mapTabletToDevice = (tablet: GraphQLTablet): DeviceEntity => ({
  id: tablet.id,
  deviceId: tablet.id,
  tableNumber: String(tablet.tableNumber),
  status: tablet.userId ? 'Connected' : 'Offline',
  lastSeen: formatDate(tablet.created),
});

const parseJwtPayload = (token: string): JwtPayload | null => {
  try {
    const payloadSegment = token.split('.')[1];
    if (!payloadSegment) {
      return null;
    }

    const base64 = payloadSegment.replace(/-/g, '+').replace(/_/g, '/');
    const normalized = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
    return JSON.parse(atob(normalized)) as JwtPayload;
  } catch {
    return null;
  }
};

const resolveCurrentUserId = (): string | null => {
  const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
  if (!token) {
    return null;
  }

  return parseJwtPayload(token)?.userId ?? null;
};

export const useDeviceManagement = () => {
  const { organizationId, loading: organizationLoading, error: organizationError } = useOrganizationId();

  const { data, loading, error, refetch } = useQuery<DevicesQueryData, DevicesQueryVariables>(DEVICES_QUERY, {
    variables: {
      organizationId: organizationId ?? '',
    },
    skip: !organizationId,
  });

  const [createDeviceMutation, createMutationState] = useMutation<CreateDeviceMutationData, CreateDeviceMutationVariables>(
    CREATE_DEVICE_MUTATION
  );
  const [updateDeviceMutation, updateMutationState] = useMutation<UpdateDeviceMutationData, UpdateDeviceMutationVariables>(
    UPDATE_DEVICE_MUTATION
  );
  const [deleteDeviceMutation, deleteMutationState] = useMutation<DeleteDeviceMutationData, DeleteDeviceMutationVariables>(
    DELETE_DEVICE_MUTATION
  );
  const [requestTabletPinMutation, requestTabletPinState] = useMutation<
    RequestTabletPinMutationData,
    RequestTabletPinMutationVariables
  >(REQUEST_TABLET_PIN_MUTATION);

  const tabletPinIssuedSubscription = useSubscription<
    OrganizationTabletPinIssuedSubscriptionData,
    DevicesQueryVariables
  >(ORGANIZATION_TABLET_PIN_ISSUED_SUBSCRIPTION, {
    variables: {
      organizationId: organizationId ?? '',
    },
    skip: !organizationId,
  });

  const devices = useMemo(() => (data?.tablets ?? []).map(mapTabletToDevice), [data]);

  const ensureSuccess = (response: DeviceMutationResponse | null | undefined) => {
    if (!response?.success) {
      throw new Error(response?.message ?? 'Request failed');
    }
  };

  const createDevice = async (tableNumber: number) => {
    const response = await createDeviceMutation({
      variables: {
        input: {
          tableNumber,
        },
      },
    });

    ensureSuccess(response.data?.createTablet);
    await refetch();
    return response.data?.createTablet?.tablet ? mapTabletToDevice(response.data.createTablet.tablet) : null;
  };

  const updateDevice = async (id: string, tableNumber: number) => {
    const response = await updateDeviceMutation({
      variables: {
        input: {
          id,
          tableNumber,
        },
      },
    });

    ensureSuccess(response.data?.updateTablet);
    await refetch();
  };

  const deleteDevice = async (id: string) => {
    const response = await deleteDeviceMutation({
      variables: {
        id,
      },
    });

    ensureSuccess(response.data?.deleteTablet);
    await refetch();
  };

  const requestPairingPin = async (tableNumber: number): Promise<PairingPinResult> => {
    const userId = resolveCurrentUserId();
    if (!userId) {
      throw new Error('Could not resolve user id from authentication token. Please log in again.');
    }

    const response = await requestTabletPinMutation({
      variables: {
        input: {
          userId,
          tableNumber,
        },
      },
    });

    ensureSuccess(response.data?.requestTabletPin);

    const pin = response.data?.requestTabletPin?.pin;
    const pairingSessionId = response.data?.requestTabletPin?.pairingSessionId;
    const expiresAt = response.data?.requestTabletPin?.expiresAt;

    if (!pin || !expiresAt) {
      throw new Error('Pairing PIN response is missing required values.');
    }

    await refetch();

    return {
      pairingSessionId: pairingSessionId ?? undefined,
      tableNumber,
      pin,
      expiresAt,
    };
  };

  return {
    devices,
    loading: organizationLoading || loading,
    error: organizationError ?? error,
    createDevice,
    requestPairingPin,
    updateDevice,
    deleteDevice,
    isCreating: createMutationState.loading,
    isRequestingPin: requestTabletPinState.loading,
    latestPinIssued: tabletPinIssuedSubscription.data?.organizationTabletPinIssued
      ? {
          pairingSessionId: tabletPinIssuedSubscription.data.organizationTabletPinIssued.pairingSessionId,
          tableNumber: tabletPinIssuedSubscription.data.organizationTabletPinIssued.tableNumber,
          pin: tabletPinIssuedSubscription.data.organizationTabletPinIssued.pin,
          expiresAt: tabletPinIssuedSubscription.data.organizationTabletPinIssued.expiresAt,
        }
      : null,
    isUpdating: updateMutationState.loading,
    isDeleting: deleteMutationState.loading,
  } as const;
};