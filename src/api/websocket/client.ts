import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
} from "@microsoft/signalr";

import { store } from "../../state/store";
import { tokenAtom } from "../../state/authStore";

export interface OrderActivityPayload {
  userId: string;
  orderId: string;
  tabletId: string;
  created: Date;
}

export interface SessionActivityPayload {
  sessionId: string;
  userId: string;
  tabletId: string;
}

export interface TabletActivityPayload {
    tabletId: string;
    userId: string;
}

// i.e. restaurant related subscriptions
export interface UserSubscription {
  onOrderCreated?: (payload: OrderActivityPayload) => void;
  onSessionCreated?: (payload: SessionActivityPayload) => void;
  onSessionEnded?: (payload: SessionActivityPayload) => void;
  onTabletCreated?: (payload: TabletActivityPayload) => void;
}

class WebSocketClient {
  private readonly connection: HubConnection;

  private readonly subscriptions = new Map<string, Set<UserSubscription>>();

  constructor(url: string) {
    this.connection = new HubConnectionBuilder()
      .withUrl(url, {
        accessTokenFactory: () =>
          store.get(tokenAtom) ?? "",
      })
      .withAutomaticReconnect([
        0,
        2000,
        10000,
        30000,
      ])
      .build();

    this.connection.on(
      "OrderCreated",
      (payload: OrderActivityPayload) => {
        this.notifyOrderCreated(payload);
      },
    );

    this.connection.on(
      "SessionCreated",
      (payload: SessionActivityPayload) => {
        this.notifySessionCreated(payload);
      },
    );

    this.connection.on(
      "SessionEnded",
      (payload: SessionActivityPayload) => {
        this.notifySessionEnded(payload);
      },
    );

    this.connection.on(
      "TabletCreated",
      (payload: TabletActivityPayload) => {
        this.notifyTabletCreated(payload);
      },
    );

    this.connection.onreconnected(async () => {
      await this.rejoinSubscriptions();
    });
  }

  async connect(): Promise<void> {
    if (this.connection.state === HubConnectionState.Connected) {
      return;
    }

    if (this.connection.state === HubConnectionState.Connecting) {
      return;
    }

    await this.connection.start();

    // Important: manually rejoin groups after
    // the initial connection as well.
    await this.rejoinSubscriptions();
  }

  async disconnect(): Promise<void> {
    await this.connection.stop();
  }

  subscribeUser(userId: string, subscription: UserSubscription): () => void {
    let subscriptions = this.subscriptions.get(userId);

    const firstSubscription = !subscriptions;

    if (!subscriptions) {
      subscriptions = new Set();
      this.subscriptions.set(userId, subscriptions);
    }

    subscriptions.add(subscription);

    if (firstSubscription && this.connection.state === HubConnectionState.Connected) {
      void this.joinUser(userId);
    }

    let unsubscribed = false;

    return () => {
      if (unsubscribed) {
        return;
      }

      unsubscribed = true;

      const current = this.subscriptions.get(userId);

      if (!current) {
        return;
      }

      current.delete(subscription);

      if (current.size === 0) {
        this.subscriptions.delete(userId);

        if (this.connection.state === HubConnectionState.Connected) {
          void this.leaveUser(userId);
        }
      }
    };
  }

  private async joinUser(
    userId: string,
  ): Promise<void> {
    if (this.connection.state !== HubConnectionState.Connected) {
      return;
    }

    await this.connection.invoke(
      "JoinUser",
      userId,
    );
  }

  private async leaveUser(
    userId: string,
  ): Promise<void> {
    if (this.connection.state !== HubConnectionState.Connected) {
      return;
    }

    await this.connection.invoke(
      "LeaveUser",
      userId,
    );
  }

  private async rejoinSubscriptions(): Promise<void> {
    if (this.connection.state !== HubConnectionState.Connected) {
      return;
    }

    for (const userId of this.subscriptions.keys()) {
      try {
        await this.joinUser(userId);
      } catch (error) {
        console.error(
          `Failed to rejoin SignalR group for user ${userId}`,
          error,
        );
      }
    }
  }

  private notifyOrderCreated(payload: OrderActivityPayload): void {
    const subscriptions = this.subscriptions.get(payload.userId);

    if (!subscriptions) {
      return;
    }

    for (const subscription of subscriptions) {
      subscription.onOrderCreated?.(payload);
    }
  }

  private notifySessionCreated(payload: SessionActivityPayload): void {
    const subscriptions = this.subscriptions.get(payload.userId);

    if (!subscriptions) {
      return;
    }

    for (const subscription of subscriptions) {
      subscription.onSessionCreated?.(payload);
    }
  }

  private notifySessionEnded(payload: SessionActivityPayload): void {
    const subscriptions = this.subscriptions.get(payload.userId);

    if (!subscriptions) {
     return;
    }

    for (const subscription of subscriptions) {
      subscription.onSessionEnded?.(payload);
    }
  }

  private notifyTabletCreated(payload: TabletActivityPayload): void {
    const subscriptions = this.subscriptions.get(payload.userId);

    if (!subscriptions) {
      return;
    }

    for (const subscription of subscriptions) {
      subscription.onTabletCreated?.(payload);
    }
  }
}

export const ws = new WebSocketClient(
  import.meta.env.VITE_WS_URL ?? "https://api.example.com/hubs/orders",
);

