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

// Ticket interface for Typesense search
export interface Ticket {
  barcode: string;
  product: string;
  type: string;
  organiser_id: string;
  given_name: string;
  family_name: string;
  email: string;
  phone_number: string;
}