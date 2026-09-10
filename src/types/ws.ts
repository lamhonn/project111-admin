export interface InvalidateEvent {
  resource: string; // e.g. 'orders'
}

// Events the *server* emits to the client
export interface ServerToClientEvents {
  invalidate: (event: InvalidateEvent) => void;
}

// Events the *client* emits to the server
export interface ClientToServerEvents {
  join: (room: string) => void;
  leave: (room: string) => void;
}