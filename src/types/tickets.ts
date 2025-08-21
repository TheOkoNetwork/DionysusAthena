// Ticket management type definitions

export interface TicketType {
  id: string;
  name: string;
  description?: string;
  active: boolean;
}

export interface TicketProduct {
  id: string;
  name: string;
  description?: string;
  price?: number;
  ticket_type_id: string;
  active: boolean;
}

export interface TicketProductType {
  id: string;
  name: string;
  description?: string;
  active: boolean;
}