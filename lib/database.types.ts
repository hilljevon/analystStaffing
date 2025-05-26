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
      cases: {
        Row: {
          admitDate: string | null
          anticipatedDisposition: string | null
          authEndDate: string | null
          authStartDate: string | null
          barriersToDisposition: string | null
          caseAssignmentCategory: string | null
          caseId: string | null
          coverageType: string | null
          created_at: string
          desk: string | null
          dob: string | null
          dx: string | null
          enteredDate: string | null
          explicitlyAssignedRn: string | null
          id: number
          inOrOutOfArea: string | null
          lastAssignedRn: string | null
          lastCmDate: string | null
          lastPadReason: string | null
          lastPertinentEventDate: string | null
          lastReviewDate: string | null
          lastReviewRequired: string | null
          levelOfCare: string | null
          los: number | null
          managingFac: string | null
          mtt: string | null
          notAuthorized: string | null
          padReasonEnteredDate: string | null
          primaryMedicalHome: string | null
          priorityLevel: string | null
          reason: string | null
          reviewOutcome: string | null
          reviewOutcomeReason: string | null
          rn: string | null
          rn2: string | null
          serviceCode: string | null
          sftDateTime: string | null
          sftEvent: string | null
          stabilityNkfCmVerbal: string | null
          stabilityOrderReceived: string | null
          stablePerOursMd: string | null
          vendorName: string | null
        }
        Insert: {
          admitDate?: string | null
          anticipatedDisposition?: string | null
          authEndDate?: string | null
          authStartDate?: string | null
          barriersToDisposition?: string | null
          caseAssignmentCategory?: string | null
          caseId?: string | null
          coverageType?: string | null
          created_at?: string
          desk?: string | null
          dob?: string | null
          dx?: string | null
          enteredDate?: string | null
          explicitlyAssignedRn?: string | null
          id?: number
          inOrOutOfArea?: string | null
          lastAssignedRn?: string | null
          lastCmDate?: string | null
          lastPadReason?: string | null
          lastPertinentEventDate?: string | null
          lastReviewDate?: string | null
          lastReviewRequired?: string | null
          levelOfCare?: string | null
          los?: number | null
          managingFac?: string | null
          mtt?: string | null
          notAuthorized?: string | null
          padReasonEnteredDate?: string | null
          primaryMedicalHome?: string | null
          priorityLevel?: string | null
          reason?: string | null
          reviewOutcome?: string | null
          reviewOutcomeReason?: string | null
          rn?: string | null
          rn2?: string | null
          serviceCode?: string | null
          sftDateTime?: string | null
          sftEvent?: string | null
          stabilityNkfCmVerbal?: string | null
          stabilityOrderReceived?: string | null
          stablePerOursMd?: string | null
          vendorName?: string | null
        }
        Update: {
          admitDate?: string | null
          anticipatedDisposition?: string | null
          authEndDate?: string | null
          authStartDate?: string | null
          barriersToDisposition?: string | null
          caseAssignmentCategory?: string | null
          caseId?: string | null
          coverageType?: string | null
          created_at?: string
          desk?: string | null
          dob?: string | null
          dx?: string | null
          enteredDate?: string | null
          explicitlyAssignedRn?: string | null
          id?: number
          inOrOutOfArea?: string | null
          lastAssignedRn?: string | null
          lastCmDate?: string | null
          lastPadReason?: string | null
          lastPertinentEventDate?: string | null
          lastReviewDate?: string | null
          lastReviewRequired?: string | null
          levelOfCare?: string | null
          los?: number | null
          managingFac?: string | null
          mtt?: string | null
          notAuthorized?: string | null
          padReasonEnteredDate?: string | null
          primaryMedicalHome?: string | null
          priorityLevel?: string | null
          reason?: string | null
          reviewOutcome?: string | null
          reviewOutcomeReason?: string | null
          rn?: string | null
          rn2?: string | null
          serviceCode?: string | null
          sftDateTime?: string | null
          sftEvent?: string | null
          stabilityNkfCmVerbal?: string | null
          stabilityOrderReceived?: string | null
          stablePerOursMd?: string | null
          vendorName?: string | null
        }
        Relationships: []
      }
      schedules: {
        Row: {
          adAnalysts: number
          ccrAnalysts: number
          ccrCM: number
          created_at: string
          date: string
          dcpAnalysts: number
          dcpCMA: number
          dctAnalysts: number
          id: number
          neededAnalysts: number
          nsAnalysts: number
          nsCM: number
          ntAnalysts: number
          ooaAnalysts: number
          ooaCMA: number
          otAnalysts: number
          refAnalysts: number
          refCM: number
          refCMA: number
          scanAnalysts: number
          scanCM: number
          scheduledAnalysts: number
          stabilityAnalysts: number
          totalCMAs: number
          totalRNs: number
          trainingAnalysts: number
          trainingCM: number
          usedAnalysts: number
        }
        Insert: {
          adAnalysts: number
          ccrAnalysts: number
          ccrCM: number
          created_at?: string
          date: string
          dcpAnalysts: number
          dcpCMA: number
          dctAnalysts: number
          id?: number
          neededAnalysts: number
          nsAnalysts: number
          nsCM: number
          ntAnalysts: number
          ooaAnalysts: number
          ooaCMA: number
          otAnalysts: number
          refAnalysts: number
          refCM: number
          refCMA: number
          scanAnalysts: number
          scanCM: number
          scheduledAnalysts: number
          stabilityAnalysts: number
          totalCMAs: number
          totalRNs: number
          trainingAnalysts: number
          trainingCM: number
          usedAnalysts: number
        }
        Update: {
          adAnalysts?: number
          ccrAnalysts?: number
          ccrCM?: number
          created_at?: string
          date?: string
          dcpAnalysts?: number
          dcpCMA?: number
          dctAnalysts?: number
          id?: number
          neededAnalysts?: number
          nsAnalysts?: number
          nsCM?: number
          ntAnalysts?: number
          ooaAnalysts?: number
          ooaCMA?: number
          otAnalysts?: number
          refAnalysts?: number
          refCM?: number
          refCMA?: number
          scanAnalysts?: number
          scanCM?: number
          scheduledAnalysts?: number
          stabilityAnalysts?: number
          totalCMAs?: number
          totalRNs?: number
          trainingAnalysts?: number
          trainingCM?: number
          usedAnalysts?: number
        }
        Relationships: []
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
