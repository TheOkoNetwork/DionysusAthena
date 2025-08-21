// Ticket management type definitions

export interface TicketType {
  id: string;
  name: string;
}

export interface TicketProduct {
  id: string;
  name: string;
  ticket_type_id: string;
}

export interface TicketProductType {
  id: string;
  name: string;
}