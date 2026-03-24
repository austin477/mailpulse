export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name?: string
          avatar_url?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string
          avatar_url?: string
        }
        Update: {
          name?: string
          avatar_url?: string
        }
      }
      email_accounts: {
        Row: {
          id: string
          user_id: string
          email: string
          gmail_id: string
          refresh_token: string
          access_token: string
          access_token_expiry: string
          display_name?: string
          avatar_url?: string
          connected_at: string
          is_active: boolean
        }
        Insert: {
          id?: string
          user_id: string
          email: string
          gmail_id: string
          refresh_token: string
          access_token: string
          access_token_expiry: string
          display_name?: string
          avatar_url?: string
          is_active?: boolean
        }
        Update: {
          access_token?: string
          access_token_expiry?: string
          is_active?: boolean
        }
      }
      emails: {
        Row: {
          id: string
          user_id: string
          message_id: string
          thread_id: string
          from_address: string
          to_addresses: string[]
          subject: string
          body: string
          html_body?: string
          timestamp: string
          is_read: boolean
          is_starred: boolean
          is_draft: boolean
          has_attachments: boolean
          category: string
          priority: string
          sentiment: string
          labels: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          message_id: string
          thread_id: string
          from_address: string
          to_addresses: string[]
          subject: string
          body: string
          html_body?: string
          timestamp: string
          is_read?: boolean
          is_starred?: boolean
          is_draft?: boolean
          has_attachments?: boolean
          category: string
          priority: string
          sentiment: string
          labels?: string[]
        }
        Update: {
          is_read?: boolean
          is_starred?: boolean
          category?: string
          priority?: string
          sentiment?: string
          labels?: string[]
        }
      }
      teams: {
        Row: {
          id: string
          name: string
          slug: string
          description?: string
          plan: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string
          plan?: string
        }
        Update: {
          name?: string
          description?: string
          plan?: string
        }
      }
      team_members: {
        Row: {
          id: string
          team_id: string
          user_id: string
          role: string
          status: string
          joined_at: string
        }
        Insert: {
          id?: string
          team_id: string
          user_id: string
          role: string
          status?: string
        }
        Update: {
          role?: string
          status?: string
        }
      }
      audit_logs: {
        Row: {
          id: string
          team_id: string
          user_id: string
          action: string
          resource: string
          resource_id: string
          changes?: Record<string, any>
          ip_address?: string
          user_agent?: string
          timestamp: string
        }
        Insert: {
          id?: string
          team_id: string
          user_id: string
          action: string
          resource: string
          resource_id: string
          changes?: Record<string, any>
          ip_address?: string
          user_agent?: string
        }
      }
      automations: {
        Row: {
          id: string
          team_id: string
          name: string
          description?: string
          trigger_type: string
          trigger_value: string
          actions: Record<string, any>[]
          enabled: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          team_id: string
          name: string
          description?: string
          trigger_type: string
          trigger_value: string
          actions: Record<string, any>[]
          enabled?: boolean
        }
        Update: {
          name?: string
          description?: string
          trigger_type?: string
          trigger_value?: string
          actions?: Record<string, any>[]
          enabled?: boolean
        }
      }
    }
  }
}
