export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      lpj: {
        Row: {
          accepted_at: string | null
          id: string
          periode_id: string
          pesan_revisi: string | null
          pondok_id: string
          status: string
          submit_at: string | null
        }
        Insert: {
          accepted_at?: string | null
          id?: string
          periode_id: string
          pesan_revisi?: string | null
          pondok_id: string
          status: string
          submit_at?: string | null
        }
        Update: {
          accepted_at?: string | null
          id?: string
          periode_id?: string
          pesan_revisi?: string | null
          pondok_id?: string
          status?: string
          submit_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lpj_periode_id_fkey"
            columns: ["periode_id"]
            isOneToOne: false
            referencedRelation: "periode"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lpj_pondok_id_fkey"
            columns: ["pondok_id"]
            isOneToOne: false
            referencedRelation: "pondok"
            referencedColumns: ["id"]
          },
        ]
      }
      lpj_pemasukan: {
        Row: {
          id: string
          lpj_id: string
          nama: string
          realisasi: number
          rencana: number
        }
        Insert: {
          id?: string
          lpj_id: string
          nama: string
          realisasi: number
          rencana: number
        }
        Update: {
          id?: string
          lpj_id?: string
          nama?: string
          realisasi?: number
          rencana?: number
        }
        Relationships: [
          {
            foreignKeyName: "lpj_pemasukan_lpj_id_fkey"
            columns: ["lpj_id"]
            isOneToOne: false
            referencedRelation: "lpj"
            referencedColumns: ["id"]
          },
        ]
      }
      lpj_pengeluaran: {
        Row: {
          id: string
          lpj_id: string
          nama: string
          realisasi: number
          rencana: number
        }
        Insert: {
          id?: string
          lpj_id: string
          nama: string
          realisasi: number
          rencana: number
        }
        Update: {
          id?: string
          lpj_id?: string
          nama?: string
          realisasi?: number
          rencana?: number
        }
        Relationships: [
          {
            foreignKeyName: "lpj_pengeluaran_lpj_id_fkey"
            columns: ["lpj_id"]
            isOneToOne: false
            referencedRelation: "lpj"
            referencedColumns: ["id"]
          },
        ]
      }
      pengurus_pondok: {
        Row: {
          id: string
          jabatan: string
          nama: string
          pondok_id: string
        }
        Insert: {
          id?: string
          jabatan: string
          nama: string
          pondok_id: string
        }
        Update: {
          id?: string
          jabatan?: string
          nama?: string
          pondok_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pengurus_pondok_pondok_id_fkey"
            columns: ["pondok_id"]
            isOneToOne: false
            referencedRelation: "pondok"
            referencedColumns: ["id"]
          },
        ]
      }
      periode: {
        Row: {
          id: string
          tahap: string
        }
        Insert: {
          id: string
          tahap?: string
        }
        Update: {
          id?: string
          tahap?: string
        }
        Relationships: []
      }
      pondok: {
        Row: {
          alamat: string
          daerah_sambung: string
          id: string
          kecamatan: string
          kelurahan: string
          kode_pos: string
          kota: string
          nama: string
          provinsi: string
          status_acc: boolean | null
          telepon: string
        }
        Insert: {
          alamat: string
          daerah_sambung: string
          id?: string
          kecamatan: string
          kelurahan: string
          kode_pos: string
          kota: string
          nama: string
          provinsi: string
          status_acc?: boolean | null
          telepon: string
        }
        Update: {
          alamat?: string
          daerah_sambung?: string
          id?: string
          kecamatan?: string
          kelurahan?: string
          kode_pos?: string
          kota?: string
          nama?: string
          provinsi?: string
          status_acc?: boolean | null
          telepon?: string
        }
        Relationships: []
      }
      rab: {
        Row: {
          accepted_at: string | null
          id: string
          periode_id: string
          pesan_revisi: string | null
          pondok_id: string
          status: string
          submit_at: string | null
        }
        Insert: {
          accepted_at?: string | null
          id?: string
          periode_id: string
          pesan_revisi?: string | null
          pondok_id: string
          status: string
          submit_at?: string | null
        }
        Update: {
          accepted_at?: string | null
          id?: string
          periode_id?: string
          pesan_revisi?: string | null
          pondok_id?: string
          status?: string
          submit_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rab_periode_id_fkey"
            columns: ["periode_id"]
            isOneToOne: false
            referencedRelation: "periode"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rab_pondok_id_fkey"
            columns: ["pondok_id"]
            isOneToOne: false
            referencedRelation: "pondok"
            referencedColumns: ["id"]
          },
        ]
      }
      rab_pemasukan: {
        Row: {
          id: string
          nama: string
          nominal: number
          rab_id: string
        }
        Insert: {
          id?: string
          nama: string
          nominal: number
          rab_id: string
        }
        Update: {
          id?: string
          nama?: string
          nominal?: number
          rab_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rab_pemasukan_rab_id_fkey"
            columns: ["rab_id"]
            isOneToOne: false
            referencedRelation: "rab"
            referencedColumns: ["id"]
          },
        ]
      }
      rab_pengeluaran: {
        Row: {
          detail: string | null
          id: string
          kategori: string
          nama: string
          nominal: number
          rab_id: string
        }
        Insert: {
          detail?: string | null
          id?: string
          kategori: string
          nama: string
          nominal: number
          rab_id: string
        }
        Update: {
          detail?: string | null
          id?: string
          kategori?: string
          nama?: string
          nominal?: number
          rab_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rab_pengeluaran_rab_id_fkey"
            columns: ["rab_id"]
            isOneToOne: false
            referencedRelation: "rab"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profile: {
        Row: {
          created_at: string
          id: string
          nama: string
          nomor_telepon: string
          pondok_id: string | null
          role: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          nama?: string
          nomor_telepon?: string
          pondok_id?: string | null
          role?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          nama?: string
          nomor_telepon?: string
          pondok_id?: string | null
          role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_profile_pondok_id_fkey"
            columns: ["pondok_id"]
            isOneToOne: false
            referencedRelation: "pondok"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
