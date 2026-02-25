// ---------------------------------------------------------------------------
// Autenticacion
// ---------------------------------------------------------------------------

export interface CreateSuperUserPayload {
   key: string;
   username: string;
   password: string;
   confirm_password: string;
}

export interface CreateUserPayload {
   username: string;
   password: string;
   confirm_password: string;
}

export interface TokenPayload {
   username: string;
   password: string;
}

export interface TokenResponse {
   msg: string;
   user: {
      token_access: string;
      username: string;
   };
}

// ---------------------------------------------------------------------------
// Quejas
// ---------------------------------------------------------------------------

export interface Queja {
   QuejasDenominacion: string;
   QuejasSector: string;
   QuejasNoMes: number;
   QuejasNum: number;
   QuejasFolio: string;
   QuejasFecRecepcion: string; // dd/mm/aaaa
   QuejasMedio: number;
   QuejasNivelAT: number;
   QuejasProducto: string;
   QuejasCausa: string;
   QuejasPORI: "SI" | "NO";
   QuejasEstatus: 1 | 2; // 1=Pendiente, 2=Concluido
   QuejasEstados: number;
   QuejasMunId: number;
   QuejasLocId?: number | null;
   QuejasColId: number;
   QuejasCP: number;
   QuejasTipoPersona: 1 | 2; // 1=Fisica, 2=Moral
   QuejasSexo?: "H" | "M" | null;
   QuejasEdad?: number | null;
   QuejasFecResolucion?: string | null; // dd/mm/aaaa
   QuejasFecNotificacion?: string | null; // dd/mm/aaaa
   QuejasRespuesta?: 1 | 2 | 3 | null; // 1=Favorable, 2=Desfavorable, 3=Parcial
   QuejasNumPenal?: number | null;
   QuejasPenalizacion?: 1 | 2 | 3 | null; // 1=Cancelacion, 2=Reasignacion, 3=Multa
}

export interface EnvioQuejasResponse {
   "Número total de envios": number;
   "Quejas enviadas": string[];
   message: string;
}

export interface EnvioQuejasErrorResponse {
   errors: Record<string, string[]>;
   message: string;
}
